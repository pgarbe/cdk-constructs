import lambda = require("@aws-cdk/aws-lambda");
import sns = require("@aws-cdk/aws-sns");
import cdk = require("@aws-cdk/core");
import monitoredLambda = require("@pgarbe/lambda");

class MyStack extends cdk.Stack {
  constructor(parent: cdk.App, id: string, props?: cdk.StackProps) {
    super(parent, id, props);

    const alarmQueue = new sns.Topic(parent, 'Alarms', {
      topicName: "myalarms"
    });

    new monitoredLambda.MonitoredLambda(this, "MyFirstLambda", {
      functionProps: {
        runtime: lambda.Runtime.NODEJS_10_X,
        handler: "index.handler",
        code: lambda.Code.asset("./lambda-handler")
      },
      alarmActions: alarmQueue
    });
  }
}

class MyApp extends cdk.App {
  constructor() {
    super();
    new MyStack(this, "hello-cdk");
  }
}

new MyApp().run();
