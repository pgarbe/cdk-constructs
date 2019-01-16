import cdk = require('@aws-cdk/cdk');
import ecs = require('@aws-cdk/aws-ecs');


export class Fargate extends cdk.Construct {

    /** @returns the ARN of the SQS queue */
    // public readonly queueArn: sqs.QueueArn;

    constructor(parent: cdk.Construct, name: string) {
        super(parent, name);

        // const task = new ecs.cloudformation.ServiceResource(this, name, {
        //     taskDefinition: {}
        // });

        // task.

        // new Alarm(this, 'Alarm', {
        //     metric: fn.metricErrors(),
        //     threshold: 0,
        //     evaluationPeriods: 2,
        // });

        // new LogGroup(this, 'LogGroup', { 
        //     logGroupName: fn.functionName,
        //     retentionDays: props.retentionDays
        // });
    }
}
