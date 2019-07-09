import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/core');
import fc = require('../lib');
import { FargateCluster } from '../lib';
import { IAlarmAction, IAlarm } from '@aws-cdk/aws-cloudwatch';
import { ContainerImage } from '@aws-cdk/aws-ecs';
import { Construct } from '@aws-cdk/core';

test('test fargate cluster construct', () => {

  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const fargateCluster = new FargateCluster(stack, 'FargateCluster', { vpc })

  // WHEN
  new fc.SharedAlbFargateService(stack, 'Service', {
    fargateCluster: fargateCluster,
    alarmAction: new TestAlarmAction('A'),
    image: ContainerImage.fromRegistry('abc')
  });

  // THEN - stack contains a public load balancer as default
  expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
    Scheme: "internet-facing"
  }));
});

class TestAlarmAction implements IAlarmAction {
  constructor(private readonly arn: string) {
  }

  public bind(_scope: Construct, _alarm: IAlarm) {
    return { alarmActionArn: this.arn };
  }
}