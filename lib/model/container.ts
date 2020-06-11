import * as model from '../model';
import { IConfigMap } from '../resources';
import * as k8s from '../../imports/k8s';

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

  readonly env?: { [name: string]: EnvValue }
}

export interface EnvValueFromConfigMapOptions {
  /**
   * Specify whether the ConfigMap or its key must be defined
   * @default false
   */
  readonly optional?: boolean;
}

export class EnvValue {
  public static of(value: string) {
    return {
      value
    };
  }

  public static fromConfigMap(configMap: IConfigMap, key: string, options: EnvValueFromConfigMapOptions = { }): EnvValue {
    return {
      valueFrom: {
        configMapKeyRef: {
          name: configMap.name,
          key,
          optional: options.optional
        }
      } as k8s.EnvVarSource
    };
  }

  private constructor(public readonly value?: any, public readonly valueFrom?: any) {

  }
}

export class Container {
  public readonly volumeMounts: model.VolumeMount[] = [];
  public readonly name: string;
  public readonly image: string;
  public readonly port?: number;
  public readonly command?: string[];
  public readonly env: { [name: string]: EnvValue };

  constructor(props: ContainerProps) {
    this.name = props.name ?? 'main';
    this.image = props.image;
    this.port = props.port;
    this.command = props.command;
    this.env = props.env ?? { };
  }

  public addEnv(name: string, value: EnvValue) {
    this.env[name] = value;
  }

  public mount(options: model.VolumeMount) {
    this.volumeMounts.push(options);
  }
}