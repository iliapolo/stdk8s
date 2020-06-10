import * as k8s from '../../imports/k8s';
import { Construct } from 'constructs';
import * as spec from '../spec';
import { ResourceProps, Resource } from './base';
import * as cdk8s from 'cdk8s';

export interface StatefulSetProps extends ResourceProps {

  readonly spec?: spec.StatefulSetSpec;

}

export class StatefulSet extends Resource {

  public readonly apiObject: cdk8s.ApiObject;

  public readonly spec: spec.StatefulSetSpec;

  constructor(scope: Construct, id: string, props: StatefulSetProps = {}) {
    super(scope, id, props);

    this.spec = props.spec ?? new spec.StatefulSetSpec();

    this.apiObject = new k8s.StatefulSet(this, 'StatefulSet', {
      metadata: {
        name: this.metadata?.name,
        ...this.metadata?._toKube()
      },
      spec: this.spec._toKube()
    })
  }

}
