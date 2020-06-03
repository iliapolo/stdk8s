import * as k8s from '../imports/k8s';
import { Construct, Lazy } from 'constructs';
import * as model from './common';
import { Service } from './service';
import { PodTemplateSpec } from './podtemplate';

export interface StatefulSetSpecProps {

  readonly service: Service;

  readonly containers?: model.Container[];

  readonly volumes?: model.Volume[];

  readonly labels?: Record<string, string>;

}

export class StatefulSetSpec {

  private readonly podTemplateSpec: PodTemplateSpec;

  private readonly props: StatefulSetSpecProps;

  constructor(props: StatefulSetSpecProps) {
    this.podTemplateSpec = new PodTemplateSpec({
      containers: props.containers,
      volumes: props.volumes
    })
    this.props = props;
  }

  public addContainer(container: model.Container) {
    this.podTemplateSpec.addContainer(container);
  }

  public addVolume(volume: model.Volume) {
    this.podTemplateSpec.addVolume(volume);
  }

  public mount(volumeMount: model.VolumeMount) {
    this.podTemplateSpec.mount(volumeMount);
  }

  public build(): k8s.StatefulSetSpec {
    return {
      template: this.podTemplateSpec.build(),
      serviceName: this.props.service.name,
      selector: {
        matchLabels: this.props.labels
      }
    }
  }

}

export interface StatefulSetProps extends model.ObjectProps {

  readonly service: Service;

  readonly containers?: model.Container[];

  readonly volumes?: model.Volume[];

  readonly labels?: Record<string, string>;

}

export class StatefulSet extends Construct {

  private readonly spec: StatefulSetSpec;

  constructor(scope: Construct, id: string, props: StatefulSetProps) {
    super(scope, id);

    this.spec = new StatefulSetSpec({
      containers: props.containers,
      volumes: props.volumes,
      labels: props.labels,
      service: props.service
    });

    new k8s.StatefulSet(this, 'StatefulSet', {
      metadata: props.metadata,
      spec: (Lazy.anyValue({ produce: () => this.spec.build() }) as unknown) as k8s.StatefulSetSpec
    })
  }

  public addContainer(container: model.Container): void {
    this.spec.addContainer(container);
  }

  public addVolume(volume: model.Volume): void {
    this.spec.addVolume(volume);
  }

  public mount(options: model.VolumeMount) {
    this.spec.mount(options);
  }

}
