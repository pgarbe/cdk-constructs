import cdk = require('@aws-cdk/cdk');
import autoscaling = require('@aws-cdk/aws-autoscaling')

export interface EcsClusterProps {
    /**
     * The EC2 instance type of the ECS cluster nodes
     *
     * @default 't2.micro'
     */
    instanceType?: string;
}

export class EcsCluster extends cdk.Construct {

    // ECS Cluster
    // ASG
    // 

    /** @returns the ARN of the SQS queue */
    // public readonly queueArn: sqs.QueueArn;

    constructor(parent: cdk.Construct, name: string, props: EcsClusterProps = {}) {
        super(parent, name);

        const launchConfig = new autoscaling.cloudformation.LaunchConfigurationResource(this, "launchConfig", {
            imageId: '',
            instanceType: props.instanceType || 't2.micro'
        });

        new autoscaling.cloudformation.AutoScalingGroupResource(this, 'ECS', {
            maxSize: '2',
            minSize: '1',
            launchConfigurationName: launchConfig.id
        });

        // const queue = new sqs.Queue(this, 'LibQueue', {
        //     visibilityTimeoutSec: props.visibilityTimeout || 300
        // });

        // const topic = new sns.Topic(this, 'LibTopic');

        // topic.subscribeQueue(queue);

        // this.queueArn = queue.queueArn;
    }
}
