import cdk = require('@aws-cdk/cdk');
import ecs = require('@aws-cdk/aws-ecs');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import { IVpcNetwork } from '@aws-cdk/aws-ec2';
import { ICertificate } from '@aws-cdk/aws-certificatemanager';

export interface FargateClusterProps {
  // /**
  //  * The EC2 instance type of the ECS cluster nodes
  //  *
  //  * @default 't2.micro'
  //  */
  // instanceType?: string;
  vpc: IVpcNetwork

  /**
   * Certificate Manager certificate to associate with the load balancer.
   * Setting this option will set the load balancer port to 443.
   */
  certificate?: ICertificate;    
}

export class FargateCluster extends cdk.Construct {

    /** @returns the ARN of the SQS queue */
    // public readonly queueArn: sqs.QueueArn;

    constructor(parent: cdk.Construct, name: string, props: FargateClusterProps) {
        super(parent, name);

        new ecs.Cluster(this, name, {
            vpc: props.vpc
        });

        const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', { vpc: props.vpc, internetFacing: true });

        const hasCertificate = props.certificate !== undefined;
        const listener = lb.addListener('PublicListener', { 
          port: hasCertificate ? 443 : 80,
          open: true
        });

        if (props.certificate !== undefined) {
          listener.addCertificateArns('Arns', [props.certificate.certificateArn]);
        }

        listener.addTargets('default', {
            port: 80,
            targets: []
        });

        // Todo: Forward port 80 to 443
        // lb.addListener('Listener', { 
        //     port: 80 
        // });
    }
}
