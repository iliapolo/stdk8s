import { Construct } from "constructs";
import { ObjectMeta } from "../model";
import * as cdk8s from 'cdk8s';

export interface ResourceProps {

  readonly metadata?: ObjectMeta

}

export abstract class Resource extends Construct {

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