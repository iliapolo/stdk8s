import * as k8s from '../imports/k8s';
import { Construct } from 'constructs';
import * as model from './common';
import { PodSpec } from './pod';

export interface PodTemplateSpecProps {

  readonly containers?: model.Container[];

  readonly volumes?: model.Volume[];

}
export class PodTemplateSpec {

  private readonly podSpec: PodSpec;

  private readonly labels: Record<string, string> = {};

  constructor(props: PodTemplateSpecProps) {
    this.podSpec = new PodSpec({
      containers: props.containers,
      volumes: props.volumes
    });
  }

  public addContainer(container: model.Container): void {
    this.podSpec.addContainer(container);
  }

  public addVolume(volume: model.Volume): void {
    this.podSpec.addVolume(volume);
  }

  public mount(options: model.VolumeMount) {
    this.podSpec.mount(options);
  }

  public addLabel(name: string, value: string) {
    this.labels[name] = value;
  }

  public build(): k8s.PodTemplateSpec {
    return {
      spec: this.podSpec.build(),
      metadata: {
        labels: this.labels
      }
    }
  }
}

export interface PodTemplateProps {

}

export class PodTemplate extends Construct {
  constructor(scope: Construct, name: string) {
    super(scope, name);
  }
}