import { Construct } from 'constructs';
import * as cdk8s from 'cdk8s';
import { ObjectMeta } from './object-meta';

export interface ResourceProps {

  readonly metadata?: ObjectMeta

}

export interface IResource {
  readonly name: string;
}

export abstract class Resource extends Construct implements IResource {

  protected metadata?: ObjectMeta;

  constructor(scope: Construct, id: string, props: ResourceProps) {
    super(scope, id);

    this.metadata = props.metadata;
  }

  public abstract readonly apiObject: cdk8s.ApiObject;

  public get name(): string {
    return this.apiObject.name;
  }
}