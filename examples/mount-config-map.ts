import * as stdk8s from '../lib';
import * as cdk8s from 'cdk8s';
import { Volume } from '../lib';

const app = new cdk8s.App();
const chart = new cdk8s.Chart(app, 'MountConfigMap');

const configMap = stdk8s.ConfigMap.fromDirectory(chart, 'Config', '/path/to/config/dir')

const container = new stdk8s.Container({
  image: 'elasticsearch:1.6.5',
  name: 'elastisearch',
  port: 9200
});

const volume = Volume.fromConfigMap(configMap);

// give this container access to the config directory
container.mount({
  volume: volume,
  path: '/etc/elasticsearch/config'
})

const pod = new stdk8s.Pod(chart, 'ElasticSearchPod');

// use the container in a pod
pod.spec.addVolume(volume);
pod.spec.addContainer(container);

const statefulSet = new stdk8s.StatefulSet(chart, 'ElasticSearchStatefulSet')

// use the same container in a stateful set
statefulSet.spec.podTemplateSpec.podSpec.addVolume(volume);
statefulSet.spec.podTemplateSpec.podSpec.addContainer(container);

// alternatively, you can create the pod spec once
const podSpec = new stdk8s.PodSpec();

// add the container and volume to the spec
podSpec.addContainer(container);
podSpec.addVolume(volume);

// and pass the spec around
new stdk8s.Pod(chart, 'ElasticSearchPod', { spec: podSpec })
new stdk8s.StatefulSet(chart, 'ElasticSearchStatefulSet', {
  spec: new stdk8s.StatefulSetSpec({
    podTemplateSpec: new stdk8s.PodTemplateSpec({
      podSpec: podSpec,
    })
  })
})

/**
 * Ideas/Concerns for better ergonomics:
 * -------------------------------------
 *
 * - Add sugaring: `resource.addContainer()` and `resource.addVolume()`.
 * - Remove the need to explicitly add the volume --> `resource.addContainer()` should be enough.
 * - Create an interface for `addContainer/addVolume` (IPod?) that will be implemented by resources who accept a pod spec.
 * - Passing the pod spec to the StatefulSet initializer is super cumbersome.
 *
 */