import { expect, haveResource } from '@aws-cdk/assert';
import { IAlarmAction } from '@aws-cdk/aws-cloudwatch';
import lambda = require('@aws-cdk/aws-lambda');
import { Stack } from '@aws-cdk/cdk';
import sut = require('../lib');

test('test default monitored lambda construct', () => {

  // GIVEN
  const stack = new Stack();

  // WHEN
  new sut.MonitoredLambda(stack, 'lambda', {
    functionProps: {
      runtime: lambda.Runtime.NodeJS810,
      handler: 'index.handler',
      code: lambda.Code.inline('code'),
    },
    alarmActions: new TestAlarmAction('A')
  });

  // THEN - stack contains a lambda
  expect(stack).to(haveResource('AWS::Lambda::Function', {
  }));

  // THEN - alarm should be created
  expect(stack).to(haveResource('AWS::CloudWatch::Alarm', {
  }));
});

class TestAlarmAction implements IAlarmAction {
  constructor(private readonly arn: string) {
  }

  public get alarmActionArn(): string {
    return this.arn;
  }
}