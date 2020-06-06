import * as k8s from '../../imports/k8s';
import { Construct, Lazy } from 'constructs';
import * as model from '../model';
import * as spec from '../spec';

export interface ServiceProps {

  readonly metadata?: model.ObjectMeta;

  readonly spec?: spec.ServiceSpec;

}

export class Service extends Construct {

  public readonly spec: spec.ServiceSpec;
  public readonly metadata: model.ObjectMeta;

  constructor(scope: Construct, id: string, props: ServiceProps = {}) {
    super(scope, id);

    this.spec = props.spec ?? new spec.ServiceSpec();
    this.metadata = props.metadata ?? new model.ObjectMeta();

    new k8s.Service(this, 'Pod', {
      metadata: (Lazy.anyValue({ produce: () => this.metadata.build() }) as unknown) as k8s.ObjectMeta,
      spec: (Lazy.anyValue({ produce: () => this.spec.build() }) as unknown) as k8s.ServiceSpec
    })
  }

}
