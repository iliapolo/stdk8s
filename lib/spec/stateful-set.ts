import * as spec from '../spec';
import * as k8s from '../../imports/k8s';

export interface StatefulSetSpecProps {

  readonly serviceName?: string;

  readonly podTemplateSpec?: spec.PodTemplateSpec;

}

export class StatefulSetSpec {

  public readonly serviceName?: string;
  public readonly podTemplateSpec: spec.PodTemplateSpec;
  public readonly labels: Record<string, string>;

  constructor(props: StatefulSetSpecProps = {}) {
    this.serviceName = props.serviceName;
    this.podTemplateSpec = props.podTemplateSpec ?? new spec.PodTemplateSpec();

    this.labels = {};
  }

  public selectByLabel(key: string, value: string) {
    this.labels[key] = value;
  }

  public build(): k8s.StatefulSetSpec {

    
    this.podTemplateSpec.metadata.addLabel()

    this.selectByLabel();

    return {
      serviceName: this.serviceName,
      template: this.podTemplateSpec.build(),
      selector: {
        matchLabels: this.labels
      }
    }
  }

}
