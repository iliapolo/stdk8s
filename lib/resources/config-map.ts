import { Construct, Lazy } from 'constructs';
import * as k8s from '../../imports/k8s';
import { ResourceProps, Resource, IResource } from './base';
import * as cdk8s from 'cdk8s';
import * as fs from 'fs';
import * as path from 'path';

export interface ConfigMapProps extends ResourceProps {

  readonly binaryData?: { [key: string]: string };

  readonly data?: { [key: string]: string };

}

export interface IConfigMap extends IResource {

}

export class ConfigMap extends Resource implements IConfigMap {
  public static fromConfigMapName(name: string): IConfigMap {
    return { name };
  }

  public readonly apiObject: cdk8s.ApiObject;

  private readonly binaryData: { [key: string]: string };
  private readonly data: { [key: string]: string };

  public constructor(scope: Construct, id: string, props: ConfigMapProps = { }) {
    super(scope, id, props);

    this.binaryData = props.binaryData ?? { };
    this.data = props.data ?? { };

    this.apiObject = new k8s.ConfigMap(this, 'ConfigMap', {
      metadata: {
        name: this.metadata?.name,
        ...this.metadata?._toKube(),
      },
      data: (Lazy.anyValue({ produce: () => this.data }) as unknown) as Record<string, string>,
      binaryData: (Lazy.anyValue({ produce: () => this.binaryData }) as unknown) as Record<string, string>,
    })
  }

  public addFile(localFile: string, key?: string) {
    key = key ?? path.basename(localFile);
    const value = fs.readFileSync(localFile, 'utf-8');
    this.data[key] = value;
  }

  public addDirectory(localDir: string, keyPrefix: string = '') {
    for (const file of fs.readdirSync(localDir)) {
      const localFile = path.join(localDir, file);
      if (fs.statSync(localFile).isDirectory()) {
        this.addDirectory(localFile, file + '/');
      } else {
        this.addFile(localFile, `${keyPrefix}${localFile}`);
      }
    }
  }
}
