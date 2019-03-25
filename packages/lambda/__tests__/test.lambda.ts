import { expect, haveResource } from '@aws-cdk/assert';
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import sut = require('../lib');

test('test monitored lambda construct', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new sut.MonitoredLambda(stack, 'lambda', {
    functionProps: {
      runtime: lambda.Runtime.NodeJS810,
      handler: 'index.handler',
      code: lambda.Code.inline('code'),
    },
    retentionDays: 42
  });

  // THEN - stack contains a lambda
  expect(stack).to(haveResource('AWS::Lambda::Function', {
  }));

  // THEN - stack contains a lambda
  expect(stack).to(haveResource('AWS::Logs::LogGroup', {
    RetentionInDays: 42
  }));
});