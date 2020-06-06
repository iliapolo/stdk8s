import * as k8s from '../../imports/k8s';
import { Construct, Lazy } from 'constructs';
import * as model from '../model';
import * as spec from '../spec';

export interface PodTemplateProps {

  readonly metadata: model.ObjectMeta;

  readonly spec: spec.PodTemplateSpec;

}

export class PodTemplate extends Construct {

  private readonly metadata: model.ObjectMeta;
  private readonly spec: spec.PodTemplateSpec;

  constructor(scope: Construct, name: string, props: PodTemplateProps) {
    super(scope, name);

    this.metadata = props.metadata;
    this.spec = props.spec;

    new k8s.PodTemplate(this, 'PodTemplate', {
      metadata: (Lazy.anyValue({ produce: () => this.metadata.build() }) as unknown) as k8s.ObjectMeta,
      template: (Lazy.anyValue({ produce: () => this.spec.build() }) as unknown) as k8s.PodTemplateSpec
    })

  }


}