//
// This app manages the delivery pipeline for aws-delivlib itself. Very meta.
//
// To update the pipeline, you'll need AWS credentials for this account and
// then run:
//
//     npm run pipeline-update
//
import cdk = require('@aws-cdk/cdk');
import delivlib = require('aws-delivlib');

export class PipelineStack extends cdk.Stack {
  constructor(parent: cdk.App, id: string, props: cdk.StackProps = { }) {
    super(parent, id, props);

    const github = new delivlib.GitHubRepo ({
      repository: 'pgarbe/cdk-constructs',
      tokenParameterName: 'github-token',
      // commitEmail: 'philipp.garbe@web.de',
      // commitUsername: 'pgarbe',
      // sshKeySecret: { secretArn: 'arn:aws:secretsmanager:eu-west-1:424144556073:secret:???' },
    });

    const pipeline = new delivlib.Pipeline(this, 'GitHubPipeline', {
      title: 'CDK Constructs',
      repo: github,
      pipelineName: 'cdkconstructs-master',
      notificationEmail: 'aws-pipeline-notification@garbe.io',
      buildSpec: {
        version: '0.2',
        phases: {
          install: {
            commands: [ 'npm ci' ],
          },
          build: {
            commands: [
              'make bootstrap',
              'make package',
            ],
          },
        },
        artifacts: {
          'files': [ '**/*' ],
          'base-directory': 'dist',
        },
      },
    });

    pipeline.publishToNpm({
      npmTokenSecret: { secretArn: 'arn:aws:secretsmanager:eu-west-1:424144556073:secret:npm-qxszqn' },
    });

    // pipeline.autoBump({
    //   bumpCommand: 'npm i && npm run bump',
    //   branch: 'master',
    // });
  }
}

const app = new cdk.App();

// this pipeline is mastered in a specific account where all the secrets are stored
new PipelineStack(app, 'pgarbe-cdkconstructs-pipeline', {
  env: { region: 'eu-west-1', account: '424144556073' },
});

app.run();
