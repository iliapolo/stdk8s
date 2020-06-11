import * as k8s from '../../imports/k8s';
import { Construct } from 'constructs';
import * as spec from '../spec';
import { Resource, ResourceProps } from './base';
import * as cdk8s from 'cdk8s';

export interface PodTemplateProps extends ResourceProps {

  readonly spec: spec.PodTemplateSpec;

}

export class PodTemplate extends Resource {

  public readonly apiObject: cdk8s.ApiObject;

  private readonly spec: spec.PodTemplateSpec;

  constructor(scope: Construct, name: string, props: PodTemplateProps) {
    super(scope, name, props);

    this.spec = props.spec;

    this.apiObject = new k8s.PodTemplate(this, 'PodTemplate', {
      metadata: {
        name: this.metadata?.name,
        ...this.metadata?._toKube(),
      },
      template: this.spec._toKube(),
    })

  }


}