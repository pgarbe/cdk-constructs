import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { IVpc } from '@aws-cdk/aws-ec2';
import ecs = require('@aws-cdk/aws-ecs');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import { BaseLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2';
import { AddressRecordTarget, ARecord, IHostedZone } from '@aws-cdk/aws-route53';
import route53targets = require('@aws-cdk/aws-route53-targets');
import cdk = require('@aws-cdk/core');

export enum LoadBalancerType {
  APPLICATION,
  NETWORK
}

export interface FargateClusterProps {

  /**
   * Determines whether the Application Load Balancer will be internet-facing
   *
   * @default true
   */
  readonly publicLoadBalancer?: boolean;

  /**
   * Whether to create an application load balancer or a network load balancer
   *
   * @default application
   */
  readonly loadBalancerType?: LoadBalancerType

  /**
   * Whether to create an AWS log driver
   *
   * @default true
   */
  readonly enableLogging?: boolean;

  /**
   * Certificate Manager certificate to associate with the load balancer.
   * Setting this option will set the load balancer port to 443.
   *
   * @default - No certificate associated with the load balancer.
   */
  readonly certificate?: ICertificate;

  /**
   * Domain name for the service, e.g. api.example.com
   *
   * @default - No domain name.
   */
  readonly domainName?: string;

  /**
   * Route53 hosted zone for the domain, e.g. "example.com."
   *
   * @default - No Route53 hosted domain zone.
   */
  readonly domainZone?: IHostedZone;

  // /**
  //  * The EC2 instance type of the ECS cluster nodes
  //  *
  //  * @default 't2.micro'
  //  */
  // instanceType?: string;
  readonly vpc: IVpc
}
export interface IFargateCluster extends cdk.IConstruct {
  readonly cluster: ecs.Cluster;
  readonly loadBalancer: BaseLoadBalancer
  readonly loadBalancerType: LoadBalancerType;
  readonly listener: elbv2.ApplicationListener | elbv2.NetworkListener
}

export class FargateCluster extends cdk.Construct implements IFargateCluster {
  public readonly cluster: ecs.Cluster;
  public readonly loadBalancer: elbv2.BaseLoadBalancer;
  public readonly loadBalancerType: LoadBalancerType;
  public readonly listener: elbv2.ApplicationListener | elbv2.NetworkListener;
  public readonly targetGroup: elbv2.ApplicationTargetGroup | elbv2.NetworkTargetGroup;

  constructor(parent: cdk.Construct, name: string, props: FargateClusterProps) {
    super(parent, name);

    this.cluster = new ecs.Cluster(this, name, {
      vpc: props.vpc
    });

    // Load balancer
    this.loadBalancerType = props.loadBalancerType !== undefined ? props.loadBalancerType : LoadBalancerType.APPLICATION;

    if (this.loadBalancerType !== LoadBalancerType.APPLICATION && this.loadBalancerType !== LoadBalancerType.NETWORK) {
       throw new Error(`invalid loadBalancerType`);
    }

    const internetFacing = props.publicLoadBalancer !== undefined ? props.publicLoadBalancer : true;

    const lbProps = {
      vpc: props.vpc,
      internetFacing
    };

    if (this.loadBalancerType === LoadBalancerType.APPLICATION) {
      this.loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'LB', lbProps);
    } else {
      this.loadBalancer = new elbv2.NetworkLoadBalancer(this, 'LB', lbProps);
    }

    const targetProps = {
      port: 80
    };

    const hasCertificate = props.certificate !== undefined;
    if (hasCertificate && this.loadBalancerType !== LoadBalancerType.APPLICATION) {
      throw new Error("Cannot add certificate to an NLB");
    }

    if (this.loadBalancerType === LoadBalancerType.APPLICATION) {
      this.listener = (this.loadBalancer as elbv2.ApplicationLoadBalancer).addListener('PublicListener', {
        port: hasCertificate ? 443 : 80,
        open: true
      });
      this.targetGroup = this.listener.addTargets('ECS', targetProps);

      if (props.certificate !== undefined) {
        this.listener.addCertificateArns('Arns', [props.certificate.certificateArn]);
      }
    } else {
      this.listener = (this.loadBalancer as elbv2.NetworkLoadBalancer).addListener('PublicListener', { port: 80 });
      this.targetGroup = this.listener.addTargets('ECS', targetProps);
    }

    if (typeof props.domainName !== 'undefined') {
      if (typeof props.domainZone === 'undefined') {
        throw new Error('A Route53 hosted domain zone name is required to configure the specified domain name');
      }

      new ARecord(this, "DNS", {
        zone: props.domainZone,
        recordName: props.domainName,
        target: AddressRecordTarget.fromAlias(new route53targets.LoadBalancerTarget(this.loadBalancer)),
      });
    }

    // Todo: Forward port 80 to 443
    // lb.addListener('Listener', {
    //     port: 80
    // });
  }
}
