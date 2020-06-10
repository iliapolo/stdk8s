import { Construct, Lazy } from 'constructs';
import * as k8s from '../../imports/k8s';
import * as model from '../model';
import { ResourceProps, Resource } from './base';

export interface ConfigMapProps extends ResourceProps {

  readonly binaryData?: { [key: string]: string };

  readonly data?: { [key: string]: string };

}

export class ConfigMap extends Resource {

  private readonly binaryData?: { [key: string]: string };
  private readonly data?: { [key: string]: string };

  private constructor(scope: Construct, id: string, props: ConfigMapProps) {
    super(scope, id, props);

    this.binaryData = props.binaryData;
    this.data = props.data;

    new k8s.ConfigMap(this, 'ConfigMap', {
      metadata: (Lazy.anyValue({ produce: () => this.metadata.build() }) as unknown) as k8s.ObjectMeta,
      data: (Lazy.anyValue({ produce: () => this.data }) as unknown) as Record<string, string>,
      binaryData: (Lazy.anyValue({ produce: () => this.binaryData }) as unknown) as Record<string, string>
    })

  }

  public static fromDirectory(scope: Construct, id: string, directory: string): ConfigMap {

    function readDirectory(): Record<string, string> {
      throw new Error('No implemented!');
    }

    function name(): string {
      throw new Error('No implemented!');
    }

    return new ConfigMap(scope, id, {
      data: readDirectory(),
      metadata: new model.ObjectMeta({
        name: name()
      })
    })
  }


}
