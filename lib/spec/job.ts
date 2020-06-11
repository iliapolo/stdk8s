import * as k8s from '../../imports/k8s';
import { PodTemplateSpec } from './pod-template';
import { RestartPolicy } from './pod';

export interface JobSpecProps {
  readonly template: PodTemplateSpec;
}

export class JobSpec {

  public readonly template: PodTemplateSpec;

  constructor(props: JobSpecProps) {
    this.template = props.template;

    if (!this.template.podSpec.restartPolicy) {
      this.template.podSpec.restartPolicy = RestartPolicy.NEVER;
    }
  }

  /**
   * @internal
   */
  public _toKube(): k8s.JobSpec {
    return {
      template: this.template._toKube(),
    };
  }
}