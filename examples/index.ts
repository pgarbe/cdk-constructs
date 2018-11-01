import cdk = require('@aws-cdk/cdk');
import lambda = require('@aws-cdk/aws-lambda');
import monitoredLambda = require('@pgarbe/monitoredLambda')

class MyStack extends cdk.Stack {
    constructor(parent: cdk.App, id: string, props?: cdk.StackProps) {
        super(parent, id, props);

        new monitoredLambda.MonitoredLambda(this, 'MyFirstLambda', {
            retentionDays: 5,
            functionProps: {
                runtime: lambda.Runtime.NodeJS810,
                handler: 'index.handler',
                code: lambda.Code.inline('exports.handler = function(event, ctx, cb) { return cb(null, "hi"); }')
            }
        });
        
    }
}

class MyApp extends cdk.App {
    constructor() {
        super();


        new MyStack(this, 'hello-cdk');
    }
}

new MyApp().run();