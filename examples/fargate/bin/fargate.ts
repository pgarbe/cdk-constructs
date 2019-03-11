#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { FargateStack } from '../lib/fargate-stack';

const app = new cdk.App();
new FargateStack(app, 'FargateStack');
app.run();
