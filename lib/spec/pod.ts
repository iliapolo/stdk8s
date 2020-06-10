import * as model from '../model';
import * as k8s from '../../imports/k8s';

export interface PodSpecProps {

  readonly containers: model.Container[];

  readonly volumes?: model.Volume[];

}

export class PodSpec {

  public containers: model.Container[];
  public volumes: model.Volume[];

  constructor(props: PodSpecProps = {}) {
    this.containers = props.containers ?? [];
    this.volumes = props.volumes ?? [];
  }

  public addContainer(container: model.Container): void {
    this.containers.push(container);
  }

  public addVolume(volume: model.Volume): void {
    this.volumes.push(volume);
  }

  public build(): k8s.PodSpec {

    if (this.containers.length == 0) {
      throw new Error('PodSpec must have at least 1 container');
    }

    const volumes: k8s.Volume[] = [];
    const containers: k8s.Container[] = [];

    for (const volume of this.volumes) {
      volumes.push({
        name: volume.name,
        configMap: volume.configMap
      })
    }

    for (const container of this.containers) {

      const volumeMounts: k8s.VolumeMount[] = [];

      for (const volumeMount of container.volumeMounts) {
        volumeMounts.push({
          // TODO: validate this volume is actually one of the pod volumes.
          // later we can consider automatically adding the volume.
          name: volumeMount.volume.name,
          mountPath: volumeMount.path
        })
      }

      containers.push({
        name: container.name,
        image: container.image,
        ports: [{
          containerPort: container.port
        }],
        volumeMounts: volumeMounts
      })
    }

    return {
      containers: containers,
      volumes: volumes
    }
  }

}
