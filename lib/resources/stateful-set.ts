import * as k8s from '../../imports/k8s';
import { Construct, Lazy } from 'constructs';
import * as model from '../model';
import * as spec from '../spec';

export interface StatefulSetProps {

  readonly metadata?: model.ObjectMeta;

  readonly spec?: spec.StatefulSetSpec;

}

export class StatefulSet extends Construct {

  public readonly spec: spec.StatefulSetSpec;
  public readonly metadata: model.ObjectMeta;

  constructor(scope: Construct, id: string, props: StatefulSetProps = {}) {
    super(scope, id);

    this.spec = props.spec ?? new spec.StatefulSetSpec();
    this.metadata = props.metadata ?? new model.ObjectMeta();

    new k8s.StatefulSet(this, 'StatefulSet', {
      metadata: (Lazy.anyValue({ produce: () => this.metadata.build() }) as unknown) as k8s.ObjectMeta,
      spec: (Lazy.anyValue({ produce: () => this.spec.build() }) as unknown) as k8s.StatefulSetSpec
    })
  }

}
