import * as k8s from '../../imports/k8s';
import { Construct, Lazy, Node } from 'constructs';
import * as model from '../model';
import * as spec from '../spec';
import { Service } from './service';
import { Resource, ResourceProps } from './base';

export interface DeploymentProps extends ResourceProps {

  readonly spec?: spec.DeploymentSpec;

}

export interface ExposeOptions {

  readonly port: number;
}

export class Deployment extends Resource {

  public readonly spec: spec.DeploymentSpec;

  constructor(scope: Construct, id: string, props: DeploymentProps = {}) {
    super(scope, id, props);

    this.spec = props.spec ?? new spec.DeploymentSpec();

    new k8s.Deployment(this, 'Deployment', {
      metadata: (Lazy.anyValue({ produce: () => this.metadata.build() }) as unknown) as k8s.ObjectMeta,
      spec: this.spec.build()
    })
  }

  public expose(options: ExposeOptions): Service {

    // just a PoC, we assume the first container is the main one.
    // TODO: figure out what the correct thing to do here.
    const containerPort = this.spec.template.podSpec.containers[0].port;

    // create a label and attach it to the deployment pods
    const labelKey = 'cdk8s.deployment'
    const labelValue = Node.of(this).uniqueId

    this.spec.template.metadata.addLabel(labelKey, labelValue);

    // TODO: what are the implications of using 'this' as the scope? should we accept as argument?
    const service = new Service(this, 'Service', {
      spec: new spec.ServiceSpec({
        port: {
          port: options.port,
          targetPort: containerPort
        }
      })
    })

    service.spec.selectByLabel(labelKey, labelValue);

    return service;
  }

}
