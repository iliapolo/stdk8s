import * as k8s from '../../imports/k8s';
import { Construct, Lazy } from 'constructs';
import * as model from '../model';
import * as spec from '../spec';
import { ResourceProps, Resource } from './base';

export interface PodProps extends ResourceProps {

  readonly spec?: spec.PodSpec;

}

export class Pod extends Resource {

  public readonly spec: spec.PodSpec;

  constructor(scope: Construct, id: string, props: PodProps = {}) {
    super(scope, id, props);

    this.spec = props.spec ?? new spec.PodSpec();

    new k8s.Pod(this, 'Pod', {
      metadata: (Lazy.anyValue({ produce: () => this.metadata.build() }) as unknown) as k8s.ObjectMeta,
      spec: (Lazy.anyValue({ produce: () => this.spec.build() }) as unknown) as k8s.PodSpec
    })
  }

}
