/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { CfnCondition, Fn, NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { CfnEIP, CfnNatGateway, CfnRoute, CfnRouteTable, CfnSubnet, CfnSubnetRouteTableAssociation, ISubnet, IVpc, Subnet, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface VPCProps  extends NestedStackProps {
  vpc: IVpc,
  cidrBlock: string,
  nextCidrBlock: string,
}

/**
 * Cognito
 */
export class Network extends NestedStack {
  readonly privateSubnets: ISubnet[]
  readonly publicSubnets: ISubnet[]
  readonly natGateway: CfnNatGateway
  readonly privateRouteTable: CfnRouteTable

  constructor(scope: Construct, id: string, props: VPCProps) {
    super(scope, id);

    const {vpc, cidrBlock, nextCidrBlock} = props;
    this.publicSubnets = vpc.publicSubnets;
    this.privateSubnets = vpc.privateSubnets; 
    const noPrivateSubnet = new CfnCondition(this, 'NoPrivateSubnet', { expression: Fn.conditionEquals(vpc.privateSubnets.length, 0) });

    this.natGateway = this.createNatGateway(vpc.selectSubnets({
      subnetType: SubnetType.PUBLIC,
    }).subnets[0])

    this.privateRouteTable = this.createPrivateRouteTable(vpc, this.natGateway)

    const privateCfnSubnet = new CfnSubnet(this, 'PrivateSubnet', {
      vpcId: vpc.vpcId,
      availabilityZone: vpc.availabilityZones[0],
      cidrBlock: cidrBlock, // Adjust the CIDR block based on your requirements
      mapPublicIpOnLaunch: false,
    });
    privateCfnSubnet.cfnOptions.condition = noPrivateSubnet
    const privateCfnSubnet2 = new CfnSubnet(this, 'PrivateSubnet2', {
      vpcId: vpc.vpcId,
      availabilityZone: vpc.availabilityZones[1],
      cidrBlock: nextCidrBlock, // Adjust the CIDR block based on your requirements
      mapPublicIpOnLaunch: false,
    });
    privateCfnSubnet2.cfnOptions.condition = noPrivateSubnet
    const routeTable = vpc.publicSubnets[0].routeTable;
    const privateSubnet = Subnet.fromSubnetAttributes(this, 'ConvertedSubnet', {
      subnetId: privateCfnSubnet.ref,
      availabilityZone: privateCfnSubnet.availabilityZone,
      routeTableId: routeTable.routeTableId
    });
    const privateSubnet2 = Subnet.fromSubnetAttributes(this, 'ConvertedSubnet2', {
      subnetId: privateCfnSubnet2.ref,
      availabilityZone: privateCfnSubnet2.availabilityZone,
      routeTableId: routeTable.routeTableId
    });
    this.privateSubnets.push(privateSubnet);
    this.privateSubnets.push(privateSubnet2);

    this.privateSubnets.forEach((subnet, index) => {
      new CfnSubnetRouteTableAssociation(this, `PrivateSubnetRouteTableAssociation${index}`, {
        subnetId: subnet.subnetId,
        routeTableId: this.privateRouteTable.ref
      });
    });

  }

  private createNatGateway(publicSubnet: ISubnet){
    return new CfnNatGateway(this, 'NatGateway', {
      subnetId: publicSubnet.subnetId,
      allocationId: new CfnEIP(this, 'EIP', {}).attrAllocationId
    });
  }

  private createPrivateRouteTable(vpc: IVpc, natGateway: CfnNatGateway){

    const privateRouteTable = new CfnRouteTable(this, 'PrivateRouteTable', {
      vpcId: vpc.vpcId
    });

    new CfnRoute(this, 'PrivateRoute', {
      routeTableId: privateRouteTable.ref,
      destinationCidrBlock: '0.0.0.0/0',
      natGatewayId: natGateway.attrNatGatewayId
    });


    return privateRouteTable;
  }
}
