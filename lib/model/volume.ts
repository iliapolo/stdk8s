export interface ConfigMapVolumeSource {

  readonly name: string;
}

export class Volume {

  private constructor(public readonly name: string,
                      public readonly configMap?: ConfigMapVolumeSource) {}

  public static fromConfigMap(name: string): Volume {
    return new Volume(`${name}-volume`, { name });
  }

}
