import { Construct, Lazy } from 'constructs';
import * as k8s from '../imports/k8s';
import { ResourceProps, Resource, IResource } from './base';
import * as cdk8s from 'cdk8s';
import * as fs from 'fs';
import * as path from 'path';
import * as minimatch from 'minimatch';

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

  public addDirectory(localDir: string, options: AddDirectoryOptions = { }) {
    if (options.recursive) {
      throw new Error("'recursive' is not supported (see https://github.com/kubernetes/kubernetes/pull/63362)");
    }

    const exclude = options.exclude ?? [];
    const shouldInclude = (file: string) => {
      for (const pattern of exclude) {
        if (minimatch(file, pattern)) {
          return false;
        }
      }
      return true;
    };

    const keyPrefix = options.keyPrefix ?? '';
    for (const file of fs.readdirSync(localDir)) {
      if (!shouldInclude(file)) {
        continue;
      }

      const filePath = path.join(localDir, file);
      const relativeFilePath = keyPrefix + file;
      if (options.recursive && fs.statSync(filePath).isDirectory()) {
        this.addDirectory(filePath, {
          keyPrefix: relativeFilePath + '/',
        });
      } else {
        this.addFile(filePath, relativeFilePath);
      }
    }
  }
}

export interface AddDirectoryOptions {
  /**
   * A prefix to add to all keys in the config map.
   * @default ""
   */
  readonly keyPrefix?: string;

  /**
   * Glob patterns to exclude when adding files.
   * @default - include all files
   */
  readonly exclude?: string[];

  /**
   * Whether to descend to subdirectories (not supported yet).
   * @default false
   */
  readonly recursive?: boolean;
}
