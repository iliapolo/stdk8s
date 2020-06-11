import * as k8s from '../../imports/k8s';
import { Construct } from 'constructs';
import * as spec from '../spec';
import { ResourceProps, Resource } from './base';
import * as cdk8s from 'cdk8s';

export interface ServiceProps extends ResourceProps {

  readonly spec?: spec.ServiceSpec;

}

export class Service extends Resource {

  public readonly apiObject: cdk8s.ApiObject;

  public readonly spec: spec.ServiceSpec;

  constructor(scope: Construct, id: string, props: ServiceProps = {}) {
    super(scope, id, props);

    this.spec = props.spec ?? new spec.ServiceSpec();

    this.apiObject = new k8s.Service(this, 'Pod', {
      metadata: {
        name: this.metadata?.name,
        ...this.metadata?._toKube(),
      },
      spec: this.spec._toKube(),
    })
  }

}
