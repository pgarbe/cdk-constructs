#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import 'source-map-support/register';
import { FargateStack } from '../lib/fargate-stack';

const app = new cdk.App();
new FargateStack(app, 'FargateStack');
app.run();
