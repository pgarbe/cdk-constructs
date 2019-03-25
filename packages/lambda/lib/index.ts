import { Alarm } from '@aws-cdk/aws-cloudwatch';
import lambda = require('@aws-cdk/aws-lambda');
import { LogGroup } from '@aws-cdk/aws-logs';
import cdk = require('@aws-cdk/cdk');

export interface MonitoredLambdaProps {
    /**
     * Number of days after CloudWatch logs of the Lambda should expire
     *
     * @default 10
     */
    readonly retentionDays?: number;
    readonly functionProps: lambda.FunctionProps
}

export class MonitoredLambda extends cdk.Construct {

    /** @returns the ARN of the SQS queue */
    // public readonly queueArn: sqs.QueueArn;

    constructor(parent: cdk.Construct, name: string, props: MonitoredLambdaProps) {
        super(parent, name);

        const fn = new lambda.Function(this, name, props.functionProps);

        new Alarm(this, 'Alarm', {
            metric: fn.metricErrors(),
            threshold: 0,
            evaluationPeriods: 2,
        });

        new LogGroup(this, 'LogGroup', {
            logGroupName: fn.functionName,
            retentionDays: props.retentionDays
        });
    }
}
