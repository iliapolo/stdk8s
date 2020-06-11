import * as model from '../model';
import * as k8s from '../../imports/k8s';

export interface PodSpecProps {

  readonly containers?: model.Container[];

  readonly volumes?: model.Volume[];

  /**
   * @default RestartPolicy.ALWAYS
   */
  readonly restartPolicy?: RestartPolicy;

export enum RestartPolicy {
  ALWAYS = 'Always',
  ON_FAILURE = 'OnFailure',
  NEVER = 'Never'
}

export class PodSpec {

  public containers: model.Container[];
  public volumes: model.Volume[];
  public restartPolicy?: RestartPolicy;

  constructor(props: PodSpecProps = {}) {
    this.containers = props.containers ?? [];
    this.volumes = props.volumes ?? [];
    this.restartPolicy = props.restartPolicy;
  }

  public addContainer(container: model.Container): void {
    this.containers.push(container);
  }

  public addVolume(volume: model.Volume): void {
    this.volumes.push(volume);
  }

  /**
   * @internal
   */
  public _toKube(): k8s.PodSpec {

    if (this.containers.length == 0) {
      throw new Error('PodSpec must have at least 1 container');
    }

    const volumes: k8s.Volume[] = [];
    const containers: k8s.Container[] = [];

    for (const volume of this.volumes) {
      volumes.push({
        name: volume.name,
        configMap: volume.configMap,
      })
    }

    for (const container of this.containers) {

      const volumeMounts: k8s.VolumeMount[] = [];

      for (const volumeMount of container.volumeMounts) {
        volumeMounts.push({
          // TODO: validate this volume is actually one of the pod volumes.
          // later we can consider automatically adding the volume.
          name: volumeMount.volume.name,
          mountPath: volumeMount.path,
        })
      }

      const ports = new Array();

      containers.push({
        name: container.name,
        image: container.image,
        ports: ports,
        volumeMounts: volumeMounts,
        command: container.command,
      });

      if (container.port) {
        ports.push({
          containerPort: container.port,
        });
      }
    }

    return {
      restartPolicy: this.restartPolicy,
      containers: containers,
      volumes: volumes,
    }
  }

}
