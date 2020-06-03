import * as k8s from '../imports/k8s';
import { Construct, Lazy } from 'constructs';

export interface ServiceProps {
  readonly name: string;
}

export class Service extends Construct {

  public readonly name: string;

  constructor(scope: Construct, id: string, props: ServiceProps) {
    super(scope, id);

    this.name = props.name;

    new k8s.Service(this, 'Service', {
      metadata: {
        name: this.name
      }
    })
  }

}
