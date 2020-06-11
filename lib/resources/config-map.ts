import { Construct, Lazy } from 'constructs';
import * as k8s from '../../imports/k8s';
import * as model from '../model';
import { ResourceProps, Resource } from './base';
import * as cdk8s from 'cdk8s';

export interface ConfigMapProps extends ResourceProps {

  readonly binaryData?: { [key: string]: string };

  readonly data?: { [key: string]: string };

}

export class ConfigMap extends Resource {

  public readonly apiObject: cdk8s.ApiObject;

  private readonly binaryData?: { [key: string]: string };
  private readonly data?: { [key: string]: string };

  private constructor(scope: Construct, id: string, props: ConfigMapProps) {
    super(scope, id, props);

    this.binaryData = props.binaryData;
    this.data = props.data;

    this.apiObject = new k8s.ConfigMap(this, 'ConfigMap', {
      metadata: {
        name: this.metadata?.name,
        ...this.metadata?._toKube(),
      },
      data: (Lazy.anyValue({ produce: () => this.data }) as unknown) as Record<string, string>,
      binaryData: (Lazy.anyValue({ produce: () => this.binaryData }) as unknown) as Record<string, string>,
    })

  }

  public static fromDirectory(scope: Construct, id: string, directory: string): ConfigMap {

    function readDirectory(): Record<string, string> {
      throw new Error(`No implemented! (${directory})`);
    }

    function name(): string {
      throw new Error('No implemented!');
    }

    return new ConfigMap(scope, id, {
      data: readDirectory(),
      metadata: new model.ObjectMeta({
        name: name(),
      }),
    })
  }


}
