const { JsiiProject, Semver } = require('projen');

const project = new JsiiProject({
  name: 'stdk8s',
  commitPackageJson: true,
  jsiiVersion: Semver.caret('1.5.0'),
  description: 'High level abstractions on top of cdk8s',
  repository: 'https://github.com/iliapolo/stdk8s.git',
  authorName: 'Eli Polonsky',
  authorEmail: 'epolon@amazon.com',
  stability: 'experimental',
  workflowBootstrapSteps: [
    { run: `yarn bootstrap` }
  ]
});

project.addScripts({
  bootstrap: 'yarn install && yarn compile && yarn projen'
});

project.synth();