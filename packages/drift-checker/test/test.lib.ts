import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import sut = require('../lib');

export = {
  'test monitored lambda construct'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new sut.DriftChecker(stack, 'checker', {
      intervalMin: 42
    });

    // THEN - stack contains a lambda
    expect(stack).to(haveResource('AWS::Lambda::Function', {
    }));

    test.done();
  }
};