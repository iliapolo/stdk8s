import * as model from '../model';

export interface ContainerProps {

  readonly image: string;

  readonly name: string;

  // TODO: make this an array of structs (see k8s#ContainerPort)
  readonly port?: number

}

export class Container {

  public readonly volumeMounts: model.VolumeMount[] = [];
  public readonly name: string;
  public readonly image: string;
  public readonly port?: number;

  constructor(props: ContainerProps) {
    this.name = props.name;
    this.image = props.image;
    this.port = props.port;
  }

  public mount(options: model.VolumeMount) {
    this.volumeMounts.push(options);
  }

}