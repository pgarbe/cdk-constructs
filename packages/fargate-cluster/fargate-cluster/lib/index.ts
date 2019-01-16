import cdk = require('@aws-cdk/cdk');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import { IVpcNetwork } from '@aws-cdk/aws-ecs/node_modules/@aws-cdk/aws-ec2';

export interface FargateClusterProps {
    // /**
    //  * The EC2 instance type of the ECS cluster nodes
    //  *
    //  * @default 't2.micro'
    //  */
    // instanceType?: string;
    vpc: IVpcNetwork
}

export class FargateCluster extends cdk.Construct {

    /** @returns the ARN of the SQS queue */
    // public readonly queueArn: sqs.QueueArn;

    constructor(parent: cdk.Construct, name: string, props: FargateClusterProps) {
        super(parent, name);

        const cluster = new ecs.Cluster(this, 'MyCluster', {
            vpc: props.vpc
        });


        const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', { vpc: props.vpc, internetFacing: true });

        // Todo: Forward port 80 to 443
        // lb.addListener('Listener', { 
        //     port: 80 
        // });


        const listener = lb.addListener('Listener', { port: 443 });

        
    }
}
