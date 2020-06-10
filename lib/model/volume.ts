import { ConfigMap } from '../resources/config-map';

export interface ConfigMapVolumeSource {

  readonly name: string;

}

export class Volume {

  private constructor(public readonly name: string,
                      public readonly configMap?: ConfigMapVolumeSource) {}

  public static fromConfigMap(configMap: ConfigMap): Volume {
    return new Volume(`${configMap.name}-volume`, {
      name: configMap.name
    });
  }

}
