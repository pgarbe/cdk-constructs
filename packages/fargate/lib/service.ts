import { IAlarmAction } from '@aws-cdk/aws-cloudwatch';
import ec2 = require('@aws-cdk/aws-ec2');
import { FargatePlatformVersion, FargateTaskDefinition, ICluster } from '@aws-cdk/aws-ecs';
import { EventRule } from '@aws-cdk/aws-events';
import eventTargets = require('@aws-cdk/aws-events-targets');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import { MonitoredLambda } from '@pgarbe/lambda';

export interface EventsTriggeredFargateServiceProps {
  readonly eventRule: EventRule;

  /**
   * Cluster where service will be deployed
   */
  readonly cluster: ICluster; // should be required? do we assume 'default' exists?

  /**
   * Task Definition used for running tasks in the service
   */
  readonly taskDefinition: FargateTaskDefinition;

  /**
   * Assign public IP addresses to each task
   *
   * @default false
   */
  readonly assignPublicIp?: boolean;

  /**
   * In what subnets to place the task's ENIs
   *
   * @default Private subnet if assignPublicIp, public subnets otherwise
   */
  readonly vpcSubnets?: ec2.IVpcSubnet;

  /**
   * Existing security group to use for the tasks
   *
   * @default A new security group is created
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * Fargate platform version to run this service on
   *
   * Unless you have specific compatibility requirements, you don't need to
   * specify this.
   *
   * @default Latest
   */
  readonly platformVersion?: FargatePlatformVersion;
  readonly alarmAction: IAlarmAction;
}

export interface IEventsTriggeredFargateService extends cdk.IConstruct {
  readonly fooArn: string;
}

export class EventsTriggeredFargateService extends cdk.Construct implements IEventsTriggeredFargateService {

  public readonly fooArn: string;

  constructor(parent: cdk.Construct, name: string, props: EventsTriggeredFargateServiceProps) {
    super(parent, name);
    this.fooArn = "";

    const triggerLambda = new MonitoredLambda(this, 'TriggerLambda', {
      functionProps: {
        runtime: lambda.Runtime.NodeJS810,
        handler: 'index.handler',
        code: lambda.Code.asset('./trigger-lambda.js'),
        environment: {
          taskDefinitionArn: props.taskDefinition.taskDefinitionArn,
          // securityGroups: props.networkConfiguration.address

          // AwsVpcNetworking(props.cluster.vpc, props.assignPublicIp, props.vpcPlacement, props.securityGroup);
        },
        logRetentionDays: 7
      },
      alarmActions: props.alarmAction
    });

    const target = new eventTargets.LambdaFunction(triggerLambda.lambda);
    props.eventRule.addTarget(target);

  }
}
