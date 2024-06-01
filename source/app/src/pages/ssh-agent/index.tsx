import {
  AppLayout,
  Button,
  Container,
  ContentLayout,
  FormField,
  Grid,
  Header,
  Icon,
  Link,
  Select,
} from '@cloudscape-design/components';
import SpaceBetween from "@cloudscape-design/components/space-between";
import CustomBreadCrumb from 'pages/left-menu/CustomBreadCrumb';
import Navigation from 'pages/left-menu/Navigation';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { RouterEnum } from 'routers/routerEnum';
import './style.scss';
// import CodeView from '@cloudscape-design/code-view/code-view';

const DataGenerateHeader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Header variant="h2" 
      description={t('sshAgent:SSHAgentDesc')}
      >
      {t('sshAgent:SSHAgent')}
    </Header>
  );
};

const SSHAgent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const [keyword, setKeyword] = useState("")
  const [selectedAcount, setSelectedAcount] = useState(null as any)
  const [selectedRegion, setSelectedRegion] = useState(null as any)
  const [selectedVPC, setSelectedVPC] = useState(null as any)
  const [step, setStep] = useState(1)
  const [currentPageIndex, setCurrentPageIndex] = useState(1)
  const [partialDelete, setPartialDelete] = React.useState(false);
  const accounts = [{label: "23434324441", value:"23434324441"},
                    {label: "53242443442", value:"53242443442"},
                    {label: "434242344344", value:"434242344344"},
                    {label: "434455454564", value:"434455454564"},
                    {label: "664353453545", value:"664353453545"},
                    {label: "65656531445", value:"65656531445"}
  ]

  const regions = [{label:"cn-north-1", value:"cn-north-1", tag:"中国(北京)"},
                   {label:"cn-northwest-1", value:"cn-northwest-1", tag:"中国(宁夏)"}]

  const vpcs = [
    {label:"vpc-0a7a48634c022c5c2",value:"vpc-0a7a48634c022c5c2",tags:["SPD DEMO"]},
    {label:"vpc-05432ec96cea692cb",value:"vpc-05432ec96cea692cb",tags:["SPDDDD"]},
    {label:"vpc-077a7ad968d6b5566", value:"vpc-077a7ad968d6b5566",tags:["-"]},
    {label:"vpc-0c1e568a5d8436041", value:"vpc-0c1e568a5d8436041",tags:["-"]},
    {label:"vpc-05ac67fe20035168e", value:"vpc-05ac67fe20035168e",tags:["-"]},
    {label:"vpc-0745a0b0d613a3561", value:"vpc-0745a0b0d613a3561",tags:["-"]},
    {label:"vpc-02e461d6842e50001", value:"vpc-02e461d6842e50001",tags:["-"]},
    {label:"vpc-0988d82720929704c", value:"vpc-0988d82720929704c",tags:["-"]},
  ]

  const machines = [
    {label:"i-0604242c984707aec",value:"i-0604242c984707aec",tags:["Hubin's Demo"]},
    {label:"i-0604242dsd44fdffc",value:"i-0604242dsd44fdffc",tags:["SPDDDD"]},
    {label:"i-077a7ad968d6b5566", value:"i-077a7ad968d6b5566",tags:["-"]},
    {label:"i-0c1e568a5d8436041", value:"i-0c1e568a5d8436041",tags:["-"]},
    {label:"i-05ac67fe20035168e", value:"i-05ac67fe20035168e",tags:["-"]},
    {label:"i-0745a0b0d613a3561", value:"i-0745a0b0d613a3561",tags:["-"]},
    {label:"i-02e461d6842e50001", value:"i-02e461d6842e50001",tags:["-"]},
    {label:"i-0988d82720929704c", value:"i-0988d82720929704c",tags:["-"]},
  ]
  const breadcrumbItems = [
    { text: t('breadcrumb.home'), href: RouterEnum.Home.path },
    { text: t('breadcrumb.sshAgent'), href: RouterEnum.DataGenerate.path },
  ];

  const gotoNext = ()=>{
    setStep(step+1)
  }

  const gotoBefore = ()=>{
    setStep(step-1)
  }

  return (
    <AppLayout
      contentHeader={<DataGenerateHeader />}
      content={
        <ContentLayout className="catalog-layout">
          {step===1?(
            <div style={{paddingLeft:20, marginTop:60}}>
            <Container
              header={<div style={{paddingLeft:20,paddingTop:30}}><Header variant="h3">配置目标资源</Header></div>}
            >
              <div style={{padding:20,paddingBottom:40}}>
                <SpaceBetween direction='vertical' size='xxl'>
                <FormField  
                  description={<div>没有想要操作的账号？点击{" "}
                  <Link
                href="#"
                variant="primary"
                fontSize="body-s"
              >
                这里
              </Link>{" "}配置新账号</div>}
              label="步骤1. 请选择账号"
          >
            <Grid gridDefinition={[{colspan:7},{colspan:5}]}>
              <Select
                selectedOption={selectedAcount}
                onChange={({ detail }) =>
                  setSelectedAcount(detail.selectedOption)
                }
                options={accounts}
                // loadingText="账号加载中"
                placeholder="请选择一个账号..."
                // statusType="loading"
              />
              <Select
                selectedOption={selectedRegion}
                onChange={({ detail }) =>
                  setSelectedRegion(detail.selectedOption)
                }
                options={regions}
                // loadingText="账号加载中"
                placeholder="请选择区域..."
                // statusType="loading"
              />
            </Grid>
      
    </FormField>
    {/* <div style={{height:5,width:'60%'}}></div> */}
    <FormField
      description="与Bucket的名字做匹配，名字中包含关键字的将被作为清理对象."
      label="步骤2. 选择对应VPC"
    >
      <Select
                selectedOption={selectedVPC}
                onChange={({ detail }) =>
                  setSelectedVPC(detail.selectedOption)
                }
                options={vpcs}
                // loadingText="账号加载中"
                placeholder="请选择VPC..."
                // statusType="loading"
              />
    </FormField>
    <FormField
      description="请选择一台现有的EC2机器作为中转机，如果没有，可以点击右边按钮启动一台低配EC2"
      label="步骤3. 选择一台EC2作为堡垒机"
    >
      <Grid gridDefinition={[{colspan:6},{colspan:3},{colspan:3}]}>
      <Select
                selectedOption={selectedVPC}
                onChange={({ detail }) =>
                  setSelectedVPC(detail.selectedOption)
                }
                options={machines}
                // loadingText="账号加载中"
                placeholder="请选择一台机器实例作为堡垒机..."
                // statusType="loading"
              /><div style={{fontSize:12,paddingTop:12,textAlign:'right',marginRight:-30}}>下拉框没有合适的机器？</div>
      <div style={{display:"flex",justifyContent:"right"}}><Button >启动一台低配机器</Button></div>
      
      </Grid>
    </FormField>
    <FormField
      description="生成对应的证书并自动保存到本地，如果本地已经有对应的证书，这一步可以忽略."
      label={
        <span>
          生成与堡垒机绑定的Perm证书 <i>- 可选</i>{" "}
        </span>
      }
    >
      <Button >点击生成Perm证书</Button>
      {/* <Textarea /> */}
    </FormField>
            </SpaceBetween>
            </div>
            
            </Container>
            </div>
          ):(
            <div style={{paddingLeft:20, marginTop:60}}>
            <Container
              header={
              
              <div style={{paddingLeft:20,paddingTop:30}}>
                <Header
                 variant="h3"
                 >连接目标资源</Header>
              </div>
              }
            >
              <div style={{padding:20,paddingTop:5,width:'92%',height:510}}>
                <SpaceBetween direction='vertical' size='l'>
              <FormField
      description="与Bucket的名字做匹配，名字中包含关键字的将被作为清理对象，下面假定您的pem文件存放在~/.ssh目录下"
      label="步骤4. 进入perm证书所在的目录，并修改权限为400"
    >
        <div style={{width:'90%',height:60,backgroundColor:'#f0eeee',marginTop:20}}>
          <Grid gridDefinition={[{colspan:11},{colspan:1}]}>
            <div style={{paddingLeft:20,color:"grey"}}>
               cd ~/.ssh<br/>
               chmod 400 177403969768-cn-northwest-1.pem
            </div>
            <div style={{paddingTop:10}}>
              <Icon name="copy" />
            </div>
          </Grid>
        </div>
    </FormField>
    <FormField
      description="与Bucket的名字做匹配，名字中包含关键字的将被作为清理对象，下面假定您的pem文件存放在~/.ssh目录下"
      label="步骤5. 复制下列命令，连接资源"
    >
        <div style={{width:'150%',backgroundColor:'#f0eeee',marginTop:20,padding:20}}>
          <Grid gridDefinition={[{colspan:11},{colspan:1}]}>
            <div style={{color:"grey",verticalAlign:'middle'}}>
            ssh -i 177403969768-cn-northwest-1.pem ec2-user@ec2-52-83-10-25.cn-northwest-1.compute.amazonaws.com.cn -Nf -L 7000:rds-with-ssl.cbwe62x7ftwi.rds.cn-northwest-1.amazonaws.com.cn:3306
            </div>
            <div>
              <Icon name="copy" />
            </div>
          </Grid>
        </div>
    </FormField></SpaceBetween>
              
            </div>
            
            </Container>
            </div>
          )}
           <div style={{paddingTop:20, paddingBottom:10,display:'flex',justifyContent:"right"}}>
            <SpaceBetween size='m' direction='horizontal'>
            {step===2&&<><Button onClick={gotoBefore}>上一步</Button><Button variant="primary" onClick={gotoNext}>返回</Button></>}
            {step===1&&<Button variant="primary" onClick={gotoNext}>下一步</Button>}
            </SpaceBetween>
            </div>
        </ContentLayout>
      }
      headerSelector="#header"
      breadcrumbs={<CustomBreadCrumb breadcrumbItems={breadcrumbItems} />}
      navigation={<Navigation activeHref={RouterEnum.DataGenerate.path} />}
      navigationWidth={290}
    />
  );
};

export default SSHAgent;
