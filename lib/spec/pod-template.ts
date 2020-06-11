import * as model from '../model';
import * as spec from '../spec';
import * as k8s from '../../imports/k8s';
import { onSynth } from '../utils';

export interface PodTemplateSpecProps {

  readonly metadata?: model.ObjectMeta;

  readonly podSpec?: spec.PodSpec;

}

export class PodTemplateSpec {

  public readonly metadata: model.ObjectMeta;
  public readonly podSpec: spec.PodSpec;

  constructor(props: PodTemplateSpecProps = {}) {
    this.metadata = props.metadata ?? new model.ObjectMeta();
    this.podSpec = props.podSpec ?? new spec.PodSpec();
  }

  /**
   * @internal
   */
  public _toKube(): k8s.PodTemplateSpec {
    return onSynth(() => ({
      metadata: this.metadata._toKube(),
      spec: this.podSpec._toKube(),
    }));
  }

}