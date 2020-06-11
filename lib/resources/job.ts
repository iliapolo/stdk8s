import { Resource, ResourceProps } from './base';
import { ApiObject } from 'cdk8s';
import { Construct } from 'constructs';

import * as k8s from '../../imports/k8s';
import { JobSpec } from '../spec/job';

export interface JobProps extends ResourceProps {
  readonly spec: JobSpec;
}

export class Job extends Resource {
  public readonly apiObject: ApiObject;
  public readonly spec: JobSpec;

  constructor(scope: Construct, id: string, props: JobProps) {
    super(scope, id, props);

    this.spec = props.spec;

    this.apiObject = new k8s.Job(this, 'Default', {
      metadata: {
        name: this.metadata?.name,
        ...this.metadata?._toKube(),
      },
      spec: this.spec._toKube(),
    });
  }
}