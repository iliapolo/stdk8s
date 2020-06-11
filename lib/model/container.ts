import * as model from '../model';

export interface ContainerProps {
  readonly image: string;

  /**
   * @default "main"
   */
  readonly name?: string;

  /**
   * // TODO: make this an array of structs (see k8s#ContainerPort)
   * @default - on port is exposed
   */
  readonly port?: number

  /**
   * The command to execute
   */
  readonly command?: string[];
}

export class Container {

  public readonly volumeMounts: model.VolumeMount[] = [];
  public readonly name: string;
  public readonly image: string;
  public readonly port?: number;
  public readonly command?: string[];

  constructor(props: ContainerProps) {
    this.name = props.name ?? 'main';
    this.image = props.image;
    this.port = props.port;
    this.command = props.command;
  }

  public mount(options: model.VolumeMount) {
    this.volumeMounts.push(options);
  }
}