const { JsiiProject, Semver } = require('projen');

const constructsDependency = Semver.pinned('2.0.1')

const project = new JsiiProject({
  name: 'stdk8s',
  commitPackageJson: true,
  jsiiVersion: Semver.caret('1.5.0'),
  description: 'High level abstractions on top of cdk8s',
  repository: 'https://github.com/iliapolo/stdk8s.git',
  authorName: 'Eli Polonsky',
  authorEmail: 'epolon@amazon.com',
  dependencies: {
    constructs: constructsDependency,
  },
  peerDependencies: {
    constructs: constructsDependency,
  },
  devDependencies: {
    'cdk8s-cli': Semver.caret('0.21.0')
  },
  stability: 'experimental',
  workflowBootstrapSteps: [
    { run: `yarn bootstrap` }
  ],
});

project.addScripts({
  bootstrap: 'yarn install && yarn compile && yarn projen'
});

project.gitignore.exclude('/.vscode/', '/package-lock.json')

project.synth();