'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (cz, commit, defaults) {
  console.log('\nLine 1 will be cropped at 100 characters. All other lines will be wrapped after 100 characters.\n');

  // Let's ask some questions of the user
  // so that we can populate our commit
  // template.
  //
  // See inquirer.js docs for specifics.
  // You can also opt to use another input
  // collection library if you prefer.
  cz.prompt([{
    type: 'list',
    name: 'type',
    message: 'Select the type of change that you\'re committing:',
    choices: [{
      name: 'feat:     A new feature',
      value: 'feat'
    }, {
      name: 'fix:      A bug fix',
      value: 'fix'
    }, {
      name: 'docs:     Documentation only changes',
      value: 'docs'
    }, {
      name: 'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)',
      value: 'style'
    }, {
      name: 'refactor: A code change that neither fixes a bug or adds a feature',
      value: 'refactor'
    }, {
      name: 'perf:     A code change that improves performance',
      value: 'perf'
    }, {
      name: 'test:     Adding missing tests',
      value: 'test'
    }, {
      name: 'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation',
      value: 'chore'
    }]
  }, {
    type: 'input',
    name: 'packages',
    message: 'The packages that have been affected by this:',
    'default': defaults.packages
  }, {
    type: 'input',
    name: 'scope',
    message: 'Denote the scope of this change ($location, $browser, $compile, etc.):\n'
  }, {
    type: 'input',
    name: 'subject',
    message: 'Write a short, imperative tense description of the change:\n'
  }, {
    type: 'input',
    name: 'body',
    message: 'Provide a longer description of the change:\n'
  }, {
    type: 'input',
    name: 'footer',
    message: 'List any breaking changes or issues closed by this change:\n'
  }]).then(function (answers) {
    var maxLineWidth = 100;

    var wrapOptions = {
      trim: true,
      newline: '\n',
      indent: '',
      width: maxLineWidth
    };

    // parentheses are only needed when a scope is present
    var scope = answers.scope.trim();
    scope = scope ? '(' + answers.scope.trim() + ')' : '';

    var packages = answers.packages.trim();
    packages = packages ? '[' + packages + ']' : '';

    // Hard limit this line
    var head = (answers.type + scope + '/' + packages + ': ' + answers.subject.trim()).slice(0, maxLineWidth);

    console.log(head);
    // Wrap these lines at 100 characters
    var body = wrap(answers.body, wrapOptions);
    var footer = wrap(answers.footer, wrapOptions);

    commit(head + '\n\n' + body + '\n\n' + footer);
  });
};