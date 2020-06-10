import * as k8s from '../../imports/k8s';
import { Construct, Lazy } from 'constructs';
import * as model from '../model';
import * as spec from '../spec';
import { ResourceProps, Resource } from './base';

export interface ServiceProps extends ResourceProps {

  readonly spec?: spec.ServiceSpec;

}

export class Service extends Resource {

  public readonly spec: spec.ServiceSpec;

  constructor(scope: Construct, id: string, props: ServiceProps = {}) {
    super(scope, id, props);

    this.spec = props.spec ?? new spec.ServiceSpec();

    new k8s.Service(this, 'Pod', {
      metadata: (Lazy.anyValue({ produce: () => this.metadata.build() }) as unknown) as k8s.ObjectMeta,
      spec: (Lazy.anyValue({ produce: () => this.spec.build() }) as unknown) as k8s.ServiceSpec
    })
  }

}
