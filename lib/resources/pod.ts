import * as k8s from '../../imports/k8s';
import { Construct, Lazy } from 'constructs';
import * as model from '../model';
import * as spec from '../spec';

export interface PodProps {

  readonly metadata?: model.ObjectMeta;

  readonly spec?: spec.PodSpec;

}

export class Pod extends Construct {

  public readonly spec: spec.PodSpec;
  public readonly metadata: model.ObjectMeta;

  constructor(scope: Construct, id: string, props: PodProps = {}) {
    super(scope, id);

    this.spec = props.spec ?? new spec.PodSpec();
    this.metadata = props.metadata ?? new model.ObjectMeta();

    new k8s.Pod(this, 'Pod', {
      metadata: (Lazy.anyValue({ produce: () => this.metadata.build() }) as unknown) as k8s.ObjectMeta,
      spec: (Lazy.anyValue({ produce: () => this.spec.build() }) as unknown) as k8s.PodSpec
    })
  }

}
