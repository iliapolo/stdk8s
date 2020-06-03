import { ConfigMap } from './configmap';

export class Volume {

  private constructor(public readonly name: string,
                      public readonly configMap?: ConfigMap) {}

  public static fromConfigMap(configMap: ConfigMap): Volume {
    return new Volume(`${configMap.name}-volume`, configMap);
  }

}

export interface ContainerProps {
  readonly name: string;
  readonly image: string;
}

export class Container {

  public readonly volumeMounts: VolumeMount[] = [];
  public readonly name: string;
  public readonly image: string;

  constructor(props: ContainerProps) {
    this.name = props.name;
    this.image = props.image;
  }

  public mount(options: VolumeMount) {
    this.volumeMounts.push(options);
  }

}

export interface VolumeMount {
  readonly volume: Volume;
  readonly path: string;
}
export interface ObjectMeta {

  readonly labels?: { [key: string]: string };

  readonly name?: string;

  readonly namespace?: string;
}
export interface ObjectProps {
  readonly metadata?: ObjectMeta
}
