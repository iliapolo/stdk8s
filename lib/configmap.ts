import { Construct } from 'constructs';
import * as k8s from '../imports/k8s';

export class ConfigMap extends Construct {

  public readonly data: Record<string, string>;
  public readonly name: string;

  private constructor(scope: Construct, id: string, name: string, data: Record<string, string>) {
    super(scope, id);

    this.name = name;
    this.data = data;

    new k8s.ConfigMap(this, 'ConfigMap', {
      data: this.data,
      metadata: {
        name: this.name
      }
    })
  }

  public static fromDirectory(scope: Construct, id: string, directory: string): ConfigMap {

    function readDirectory(): Record<string, string> {
      throw new Error('No implemented!');
    }

    function name(): string {
      throw new Error('No implemented!');
    }

    return new ConfigMap(scope, id, name(), readDirectory())
  }


}
