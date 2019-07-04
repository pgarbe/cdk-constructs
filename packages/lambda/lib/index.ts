import { Alarm, IAlarmAction } from '@aws-cdk/aws-cloudwatch';
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');

export interface MonitoredLambdaProps {
  readonly functionProps: lambda.FunctionProps
  readonly alarmActions: IAlarmAction
}

export interface IMonitoredLambda extends cdk.IConstruct {
  readonly lambda: lambda.Function;
}

export class MonitoredLambda extends cdk.Construct implements IMonitoredLambda {

  /** @returns the lambda function */
  public readonly lambda: lambda.Function;

  constructor(parent: cdk.Construct, name: string, props: MonitoredLambdaProps) {
    super(parent, name);

    props = {
      ...props,
      functionProps: {
        logRetention: 7, // My default here
        ...props.functionProps // user given always wins if provided
      }
    };

    const fn = new lambda.Function(this, name, props.functionProps);

    const alarm = new Alarm(this, 'Alarm', {
      metric: fn.metricErrors(),
      threshold: 0,
      evaluationPeriods: 2,
    });
    alarm.addAlarmAction(props.alarmActions);

    this.lambda = fn;
  }
}
