import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import events = require('@aws-cdk/aws-events');
import eventTargets = require('@aws-cdk/aws-events-targets');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import path = require('path');

export interface DriftCheckerProps {
  /**
   * The visibility timeout to be configured on the SQS Queue, in seconds.
   *
   * @default 300
   */
  readonly intervalMin?: number;
}

export class DriftChecker extends cdk.Construct {

  constructor(parent: cdk.Construct, name: string, props: DriftCheckerProps = {}) {
    super(parent, name);

    // defines an AWS Lambda resource
    const checker = new lambda.Function(this, 'CheckerHandler', {
      runtime: lambda.Runtime.NodeJS810,      // execution environment
      code: lambda.Code.asset(path.join(__dirname,  "/../lambda")),  // code loaded from the "lambda" directory
      handler: 'checker.handler'                // file is "checker", function is "handler"
    });

    const interval = props.intervalMin === undefined ? 1 : props.intervalMin;
    if (interval > 0) {
      const unit = interval === 1 ? 'minute' : 'minutes';
      const timer = new events.EventRule(this, 'CheckerTimer', {
        scheduleExpression: `rate(${interval} ${unit})`
      });

      const target = new eventTargets.LambdaFunction(checker);

      timer.addTarget(target);
    }
  }

  /**
   * Return the given named metric for this Construct
   */
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'pgarbe/drift-checker',
      metricName,
      // dimensions: { ServiceName: this.serviceName },
      ...props
    });
  }

  /**
   * Metric for drifted stacks
   *
   * @default average over 5 minutes
   */
  public metricDriftedStacks(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('DriftedStacks', props );
  }
  // TODO: Expose "metrics"

}
