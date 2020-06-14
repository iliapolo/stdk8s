import * as k8s from '../imports/k8s';
import { Construct } from 'constructs';
import { ResourceProps, Resource } from './base';
import * as cdk8s from 'cdk8s';
import { IServiceAccount } from './service-account';
import { EnvValue, Container } from './container';
import { Volume } from './volume';

export interface PodProps extends ResourceProps {

  readonly spec?: PodSpec;

}

export class Pod extends Resource {

  public readonly apiObject: cdk8s.ApiObject;

  public readonly spec: PodSpec;

  constructor(scope: Construct, id: string, props: PodProps = {}) {
    super(scope, id, props);

    this.spec = props.spec ?? new PodSpec();

    this.apiObject = new k8s.Pod(this, 'Pod', {
      metadata: {
        name: this.metadata?.name,
        ...this.metadata?._toKube(),
      },
      spec: this.spec._toKube(),
    })
  }

}

export interface PodSpecProps {

  readonly containers?: Container[];

  readonly volumes?: Volume[];

  /**
   * @default RestartPolicy.ALWAYS
   */
  readonly restartPolicy?: RestartPolicy;

  readonly serviceAccout?: IServiceAccount;
}

export enum RestartPolicy {
  ALWAYS = 'Always',
  ON_FAILURE = 'OnFailure',
  NEVER = 'Never'
}

export class PodSpec {

  public containers: Container[];
  public volumes: Volume[];
  public restartPolicy?: RestartPolicy;
  public serviceAccount?: IServiceAccount;

  constructor(props: PodSpecProps = {}) {
    this.containers = props.containers ?? [];
    this.volumes = props.volumes ?? [];
    this.restartPolicy = props.restartPolicy;
    this.serviceAccount = props.serviceAccout;
  }

  public addContainer(container: Container): void {
    this.containers.push(container);
  }

  public addVolume(volume: Volume): void {
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
        workingDir: container.workingDir,
        env: renderEnv(container.env),
      });

      if (container.port) {
        ports.push({
          containerPort: container.port,
        });
      }
    }

    return {
      restartPolicy: this.restartPolicy,
      serviceAccountName: this.serviceAccount?.name,
      containers: containers,
      volumes: volumes,
    };

    function renderEnv(env?: { [name: string]: EnvValue }): k8s.EnvVar[] {
      const result = new Array<k8s.EnvVar>();
      for (const [name, v] of Object.entries(env ?? {})) {
        result.push({
          name,
          value: v.value,
          valueFrom: v.valueFrom,
        });
      }
      return result;
    }
  }

}
