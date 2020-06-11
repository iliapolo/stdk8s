import * as k8s from '../../imports/k8s';
import { Construct } from 'constructs';
import * as spec from '../spec';
import { ResourceProps, Resource } from './base';
import * as cdk8s from 'cdk8s';

export interface PodProps extends ResourceProps {

  readonly spec?: spec.PodSpec;

}

export class Pod extends Resource {

  public readonly apiObject: cdk8s.ApiObject;

  public readonly spec: spec.PodSpec;

  constructor(scope: Construct, id: string, props: PodProps = {}) {
    super(scope, id, props);

    this.spec = props.spec ?? new spec.PodSpec();

    this.apiObject = new k8s.Pod(this, 'Pod', {
      metadata: {
        name: this.metadata?.name,
        ...this.metadata?._toKube(),
      },
      spec: this.spec._toKube(),
    })
  }

}
