import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import sut = require('../lib');

test('test monitored lambda construct', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new sut.DriftChecker(stack, 'checker', {
    intervalMin: 42
  });

  // THEN - stack contains a lambda
  expect(stack).to(haveResource('AWS::Lambda::Function', {
  }));
});