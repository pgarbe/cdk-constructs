import { IAlarmAction } from '@aws-cdk/aws-cloudwatch';
import ecs = require('@aws-cdk/aws-ecs');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import { IFargateCluster } from './cluster';

export interface SharedAlbFargateServiceProps {

  /**
   * The image to start.
   */
  readonly image: ecs.ContainerImage;

  /**
   * The container port of the application load balancer attached to your Fargate service. Corresponds to container port mapping.
   *
   * @default 80
   */
  readonly containerPort?: number;

  /**
   * Determines whether your Fargate Service will be assigned a public IP address.
   *
   * @default false
   */
  readonly publicTasks?: boolean;

  /**
   * Number of desired copies of running tasks
   *
   * @default 1
   */
  readonly desiredCount?: number;

  /**
   * Environment variables to pass to the container
   *
   * @default - No environment variables.
   */
  readonly environment?: { [key: string]: string };

  /**
   * Cluster where service will be deployed
   */
  readonly fargateCluster: IFargateCluster; // should be required? do we assume 'default' exists?

  /**
   * The number of cpu units used by the task.
   * Valid values, which determines your range of valid values for the memory parameter:
   * 256 (.25 vCPU) - Available memory values: 0.5GB, 1GB, 2GB
   * 512 (.5 vCPU) - Available memory values: 1GB, 2GB, 3GB, 4GB
   * 1024 (1 vCPU) - Available memory values: 2GB, 3GB, 4GB, 5GB, 6GB, 7GB, 8GB
   * 2048 (2 vCPU) - Available memory values: Between 4GB and 16GB in 1GB increments
   * 4096 (4 vCPU) - Available memory values: Between 8GB and 30GB in 1GB increments
   *
   * This default is set in the underlying FargateTaskDefinition construct.
   *
   * @default 256
   */
  readonly cpu?: number;

  /**
   * The amount (in MiB) of memory used by the task.
   *
   * This field is required and you must use one of the following values, which determines your range of valid values
   * for the cpu parameter:
   *
   * 0.5GB, 1GB, 2GB - Available cpu values: 256 (.25 vCPU)
   *
   * 1GB, 2GB, 3GB, 4GB - Available cpu values: 512 (.5 vCPU)
   *
   * 2GB, 3GB, 4GB, 5GB, 6GB, 7GB, 8GB - Available cpu values: 1024 (1 vCPU)
   *
   * Between 4GB and 16GB in 1GB increments - Available cpu values: 2048 (2 vCPU)
   *
   * Between 8GB and 30GB in 1GB increments - Available cpu values: 4096 (4 vCPU)
   *
   * This default is set in the underlying FargateTaskDefinition construct.
   *
   * @default 512
   */
  readonly memoryLimitMiB?: number;

  /**
   * Override for the Fargate Task Definition execution role
   *
   * @default - No value
   */
  readonly executionRole?: iam.IRole;

  /**
   * Override for the Fargate Task Definition task role
   *
   * @default - No value
   */
  readonly taskRole?: iam.IRole;

  /**
   * Override value for the container name
   *
   * @default - No value
   */
  readonly containerName?: string;

  /**
   * Whether to create an AWS log driver
   *
   * @default true
   */
  readonly enableLogging?: boolean;

  /**
   * Override value for the service name
   *
   * @default CloudFormation-generated name
   */
  readonly serviceName?: string;

  readonly alarmAction: IAlarmAction;
}

export interface ISharedAlbFargateService extends cdk.IConstruct {
  readonly logDriver?: ecs.LogDriver;
}

export class SharedAlbFargateService extends cdk.Construct implements ISharedAlbFargateService {

  public readonly logDriver?: ecs.LogDriver;

  constructor(parent: cdk.Construct, name: string, props: SharedAlbFargateServiceProps) {
    super(parent, name);

    // Create log driver if logging is enabled
    const enableLogging = props.enableLogging !== undefined ? props.enableLogging : true;
    this.logDriver = enableLogging ? new ecs.AwsLogDriver({ streamPrefix: this.node.id }) : undefined;

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      memoryLimitMiB: props.memoryLimitMiB,
      cpu: props.cpu,
      executionRole: props.executionRole !== undefined ? props.executionRole : undefined,
      taskRole: props.taskRole !== undefined ? props.taskRole : undefined
    });

    const containerName = props.containerName !== undefined ? props.containerName : 'web';

    const container = taskDefinition.addContainer(containerName, {
      image: props.image,
      logging: this.logDriver,
      environment: props.environment
    });

    container.addPortMappings({
      containerPort: props.containerPort || 80,
    });

    const assignPublicIp = props.publicTasks !== undefined ? props.publicTasks : false;
    const service = new ecs.FargateService(this, "Service", {
      cluster: props.fargateCluster.cluster,
      desiredCount: props.desiredCount || 1,
      taskDefinition,
      assignPublicIp,
      serviceName: props.serviceName,
    });

    const targetProps = {
      hostHeader: 'example.com',
      port: 80,
      targets: [service],
      priority: 1
    };

    props.fargateCluster.listener.addTargets('ECSTargets', targetProps);
  }
}
