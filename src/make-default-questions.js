import Promise from 'promise';

module.exports = (allPackages, changedPackages) => ([
  {
    type: 'autocomplete',
    name: 'type',
    message: 'Select the type of change that you\'re committing:',
    choices: [
      {value: 'feat',     name: 'feat:     ✨  A new feature (note: this will indicate a release)'},
      {value: 'fix',      name: 'fix:      🛠  A bug fix (note: this will indicate a release)'},
      {value: 'docs',     name: 'docs:     Documentation only changes'},
      {value: 'style',    name: 'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)'},
      {value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature'},
      {value: 'perf',     name: 'perf:     A code change that improves performance'},
      {value: 'test',     name: 'test:     Adding missing tests'},
      {value: 'chore',    name: 'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation'},
      {value: 'revert',   name: 'revert:   Revert to a commit'},
      {value: 'WIP',      name: 'WIP:      Work in progress'}
    ],
  },
  {
    type: 'input',
    name: 'scope',
    message: 'Denote the scope of this change:',
  },
  {
    type: 'input',
    name: 'subject',
    message: 'Write a short, imperative tense description of the change:\n',
    filter: function(value) {
      return value.charAt(0).toLowerCase() + value.slice(1);
    },
    validate: function(value) {
      return !!value;
    },
  },
  {
    type: 'input',
    name: 'body',
    message: 'Provide a longer description of the change (optional). Use "|" to break new line:\n'
  },
  {
    type: 'input',
    name: 'breaking',
    message: 'List any BREAKING CHANGES (if none, leave blank):\n',
  },
  {
    type: 'input',
    name: 'footer',
    message: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
  },
  {
    type: 'checkbox',
    name: 'packages',
    'default': changedPackages,
    choices: allPackages,
    message: `The packages that this commit has affected (${changedPackages.length} detected)\n`,
    // validate: function (input) {
    //   const type = commitMessage.type;
    //   const isRequired = ['feat', 'fix'].some((type) => messageHead.indexOf(type) === 0);
    //   const isProvided = input.length > 0;
    //   return isRequired ? (isProvided ? true : `Commit type "${type}" must affect at least one component`) : true;
    // }
  },
]);
