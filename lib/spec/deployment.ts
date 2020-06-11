import * as spec from '../spec';
import * as k8s from '../../imports/k8s';
import { onSynth } from '../utils';

export interface DeploymentSpecProps {

  readonly replicas?: number;

  readonly template?: spec.PodTemplateSpec;

}

export class DeploymentSpec {

  private readonly replicas?: number;

  public readonly template: spec.PodTemplateSpec;
  public readonly labels: Record<string, string>;

  constructor(props: DeploymentSpecProps = {}) {
    this.replicas = props.replicas;
    this.template = props.template ?? new spec.PodTemplateSpec();
    this.labels = {};
  }

  public selectByLabel(key: string, value: string) {
    this.labels[key] = value;
  }

  /**
   * @internal
   */
  public _toKube(): k8s.DeploymentSpec {
    return onSynth(() => ({
      replicas: this.replicas,
      template: this.template._toKube(),
      selector: {
        matchLabels: this.labels,
      },
    }));
  }
}
