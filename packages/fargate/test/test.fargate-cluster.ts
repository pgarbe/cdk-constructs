import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import fc = require('../lib');

export = {
  'test fargate cluster construct'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');

    // WHEN
    new fc.FargateCluster(stack, 'Service', {
      vpc
    });

    // THEN - stack contains a load balancer
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
    }));

    test.done();
  }
};