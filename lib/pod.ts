import * as k8s from '../imports/k8s';
import { Construct, Lazy } from 'constructs';
import * as model from './common';

export interface PodSpecProps {

  readonly containers?: model.Container[];

  readonly volumes?: model.Volume[];

}

export class PodSpec {

  private containers: model.Container[];
  private volumes: model.Volume[];

  constructor(props: PodSpecProps) {
    this.containers = props.containers ?? [];
    this.volumes = props.volumes ?? [];
  }

  public addContainer(container: model.Container): void {
    this.containers.push(container);
  }

  public addVolume(volume: model.Volume): void {
    this.volumes.push(volume);
  }

  public mount(options: model.VolumeMount) {

    this.volumes.push(options.volume)

    for (const container of this.containers) {
      container.mount(options)
    }

  }

  public build(): k8s.PodSpec {

    if (this.containers.length == 0) {
      throw new Error('PodSpec must have at least 1 container');
    }

    return {
      containers: this.containers.map(c => {
        return {
          name: c.name,
          image: c.image,
          volumeMounts: c.volumeMounts.map(vm => {
            return {
              name: vm.volume.name,
              mountPath: vm.path
            }
          })
        }
      }),
      volumes: this.volumes.map(v => {
        return {
          name: v.name,
          configMap: v.configMap
        }
      })
    }
  }

}

export interface PodProps extends model.ObjectProps {

  readonly containers?: model.Container[];

  readonly volumes?: model.Volume[];

}

export class Pod extends Construct {

  private readonly spec: PodSpec;

  constructor(scope: Construct, id: string, props: PodProps) {
    super(scope, id);

    this.spec = new PodSpec({
      containers: props.containers,
      volumes: props.volumes
    });

    new k8s.Pod(this, 'Pod', {
      metadata: props.metadata,
      spec: (Lazy.anyValue({ produce: () => this.spec.build() }) as unknown) as k8s.PodSpec
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
