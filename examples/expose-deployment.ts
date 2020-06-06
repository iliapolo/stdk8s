import * as stdk8s from '../lib';
import * as cdk8s from 'cdk8s';


const app = new cdk8s.App();
const chart = new cdk8s.Chart(app, 'ExposeDeployment');

const container = new stdk8s.Container({
  image: 'elasticsearch:1.6.5',
  name: 'elastisearch',
  port: 9200
});

const deployment = new stdk8s.Deployment(chart, 'ElasticSearchDeployment')

deployment.spec.template.podSpec.addContainer(container);

// this will create and return a service that selects the pods in the deployment
// and maps port 80 to the container port.
// Note that we don't need to specify the container port, nor do we need to apply any selectors!
// See https://kubernetes.io/docs/concepts/services-networking/connect-applications-service/#exposing-pods-to-the-cluster
deployment.expose({port: 80});
