import { IResource, Resource } from './base';
import * as cdk8s from 'cdk8s';
import { Construct } from 'constructs';
import * as k8s from '../imports/k8s';

export interface SecretProps {

}

export interface ISecret extends IResource {

}

export class Secret extends Resource implements ISecret {

  public readonly apiObject: cdk8s.ApiObject;

  public static fromSecretName(name: string): ISecret {
    return { name };
  }

  public constructor(scope: Construct, id: string, props: SecretProps = { }) {
    super(scope, id, props);

    this.apiObject = new k8s.Secret(this, 'Secret', {})
  }

}

