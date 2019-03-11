CDK Constructs
==============


For now, a playground for [AWS CDK](https://awslabs.github.io/aws-cdk/) constructs. 

# Constructs

* [FargateCluster](https://github.com/pgarbe/cdk-constructs/blob/master/packages/fargate/README.md#FargateCluster)
* [FargateService](https://github.com/pgarbe/cdk-constructs/blob/master/packages/fargate/README.md#FargateService)
* MonitoredLambda
* ReverseDriftDetection
* ScalingEcsCluster
* ReliableEcrRepo

# How to setup your own CDK Package Library

Warning: CDK is under heavy development.

Why Typescript?

## Using Lerna


## Unit Tests


## Linting

```bash
npm install tslint typescript -g
tslint -i
```

The CDK team itself is using their own tool called [awslint](todo), which is linting the cdk libraries against their own guidelines which are called [AWS Resource Construct Design Guidelines](https://github.com/awslabs/aws-cdk/blob/master/design/aws-guidelines.md).

Unfortunately, awslint can not be used to check your own libraries. I opened already an [issue](https://github.com/awslabs/aws-cdk/issues/1942) to make it public available.

* TypeScript
* CDK libs

## CI/CD using CodePipeline
https://github.com/awslabs/aws-delivlib

## Multi language support

