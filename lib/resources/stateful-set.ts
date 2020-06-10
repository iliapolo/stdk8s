import * as k8s from '../../imports/k8s';
import { Construct, Lazy } from 'constructs';
import * as model from '../model';
import * as spec from '../spec';
import { ResourceProps, Resource } from './base';

export interface StatefulSetProps extends ResourceProps {

  readonly spec?: spec.StatefulSetSpec;

}

export class StatefulSet extends Resource {

  public readonly spec: spec.StatefulSetSpec;

  constructor(scope: Construct, id: string, props: StatefulSetProps = {}) {
    super(scope, id, props);

    this.spec = props.spec ?? new spec.StatefulSetSpec();

    new k8s.StatefulSet(this, 'StatefulSet', {
      metadata: (Lazy.anyValue({ produce: () => this.metadata.build() }) as unknown) as k8s.ObjectMeta,
      spec: (Lazy.anyValue({ produce: () => this.spec.build() }) as unknown) as k8s.StatefulSetSpec
    })
  }

}
