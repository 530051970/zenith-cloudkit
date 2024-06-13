#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { ZenithCloudkitStack } from '../lib/zenith-cloudkit-stack';

const app = new cdk.App();
const stack = new ZenithCloudkitStack(app, 'ZenithCloudkitStackTest', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
app.synth();


