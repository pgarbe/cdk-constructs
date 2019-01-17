# Fargate Cluster

This package contains constructs for working with AWS Fargate. The simplest example of using this library looks like this:

```ts
// Create a Fargate cluster with an ALB
const cluster = new fargate.FargateCluster(this, 'MyCluster', {
  vpc,
});

// Fargate service which uses ALB from FargateCluster
const service = new fargate.FargateService(this, 'MyService', {
  cluster: cluster,
  scaling: xy,
  pathPattern or hostPattern
});
```
