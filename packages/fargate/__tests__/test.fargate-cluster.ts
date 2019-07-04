import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/core');
import fc = require('../lib');

test('test fargate cluster construct', () => {

  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');

  // WHEN
  new fc.FargateCluster(stack, 'Service', {
    vpc
  });

  // THEN - stack contains a public load balancer as default
  expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
    Scheme: "internet-facing"
  }));
});