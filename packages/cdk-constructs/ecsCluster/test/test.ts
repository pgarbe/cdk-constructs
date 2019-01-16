import { expect } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import ecsCluster = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
    'default properties'(test: Test) {
        const stack = new Stack();
        new ecsCluster.EcsCluster(stack, 'cluster', { instanceType: 't2.micro' });

        expect(stack).toMatch({
          "Resources": {
            "clusterlaunchConfigCC19C4B8": {
              "Type": "AWS::AutoScaling::LaunchConfiguration",
              "Properties": {
                "ImageId": "",
                "InstanceType": "t2.micro"
              }
            },
            "clusterECSF3F7FFA5": {
              "Type": "AWS::AutoScaling::AutoScalingGroup",
              "Properties": {
                "MaxSize": "2",
                "MinSize": "1",
                "LaunchConfigurationName": "launchConfig"
              }
            }
          }
        });

        test.done();
    }
};