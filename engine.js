'format cjs';

var wrap = require('word-wrap');
var map = require('lodash.map');
var longest = require('longest');
var chalk = require('chalk');

var filter = function(array) {
  return array.filter(function(x) {
    return x;
  });
};

var headerLength = function(answers) {
  return (
    answers.type.length + 2 + (answers.scope ? answers.scope.length + 2 : 0)
  );
};

var maxSummaryLength = function(options, answers) {
  return options.maxHeaderWidth - headerLength(answers);
};

var filterSubject = function(subject) {
  subject = subject.trim();
  if (subject.charAt(0).toLowerCase() !== subject.charAt(0)) {
    subject =
      subject.charAt(0).toLowerCase() + subject.slice(1, subject.length);
  }
  while (subject.endsWith('.')) {
    subject = subject.slice(0, subject.length - 1);
  }
  return subject;
};

// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = function(options, inquirer) {
  var types = options.types;
  var longestTypeChoice = longest(Object.keys(types)).length + 1;
  var typeChoices = map(types, function(type, key) {
    return {
      name: (key + ':').padEnd(longestTypeChoice) + ' ' + type.description,
      value: key
    };
  });

  var predefinedScopes = options.scopes || [];
  var hasPredefinedScopes = predefinedScopes.length > 0;

  var otherScopeChoice = 'something else...';
  var scopeChoices = [{ name: chalk.dim(chalk.white('(skip)')), value: '' }]
    .concat(
      map(predefinedScopes, function(scope) {
        return {
          name: scope,
          value: scope
        };
      })
    )
    .concat([
      new inquirer.Separator(''),
      { name: otherScopeChoice, value: otherScopeChoice }
    ]);

  var defaultScopeChoice;

  if (options.defaultScope) {
    var foundDefault = scopeChoices.findIndex(function(choice) {
      if (choice.type === 'separator') {
        return false;
      }
      return (
        choice.value === options.defaultScope ||
        choice.name === options.defaultScope
      );
    });

    defaultScopeChoice =
      foundDefault === -1 ? scopeChoices.length - 1 : foundDefault;
  }

  return {
    // When a user runs `git cz`, prompter will
    // be executed.
    //
    // The commit callback should be executed when
    // you're ready to send back a commit template
    // to git.
    //
    // By default, we'll de-indent your commit
    // template and will keep empty lines.
    prompter: function(commit) {
      // Let's ask some questions of the user
      // so that we can populate our commit
      // template.

      // FIXME: Avoid changing the entire file because of the longer variable of inquirer vs cz
      var cz = inquirer;

      cz.prompt([
        {
          type: 'list',
          name: 'type',
          message: "Select the type of change that you're committing:",
          choices: typeChoices,
          default: options.defaultType
        },
        {
          type: 'list',
          name: 'scopeChoices',
          message:
            'What is the scope of this change' +
            (defaultScopeChoice > 0 ? '' : ' (press enter to skip)') +
            ':',
          choices: scopeChoices,
          default: function() {
            return (
              scopeChoices[defaultScopeChoice] &&
              scopeChoices[defaultScopeChoice].value
            );
          },
          filter: function(value) {
            return options.disableScopeLowerCase
              ? value.trim()
              : value.trim().toLowerCase();
          },
          when: function() {
            return hasPredefinedScopes;
          }
        },
        {
          type: 'input',
          name: 'scope',
          message:
            'What is the scope of this change (e.g. component or file name): ' +
            chalk.grey('(press enter to skip)') +
            '\n> ',
          default: options.defaultScope,
          filter: function(value) {
            return options.disableScopeLowerCase
              ? value.trim()
              : value.trim().toLowerCase();
          },
          when: function(answers) {
            return (
              (answers.scopeChoices &&
                answers.scopeChoices === otherScopeChoice) ||
              !hasPredefinedScopes
            );
          }
        },
        {
          type: 'input',
          name: 'subject',
          message: function(answers) {
            return (
              'Write a short, imperative tense description of the change (max ' +
              maxSummaryLength(options, answers) +
              ' chars):\n'
            );
          },
          default: options.defaultSubject,
          validate: function(subject, answers) {
            var filteredSubject = filterSubject(subject);
            return filteredSubject.length == 0
              ? 'subject is required'
              : filteredSubject.length <= maxSummaryLength(options, answers)
              ? true
              : 'Subject length must be less than or equal to ' +
                maxSummaryLength(options, answers) +
                ' characters. Current length is ' +
                filteredSubject.length +
                ' characters.';
          },
          transformer: function(subject, answers) {
            var filteredSubject = filterSubject(subject);
            var color =
              filteredSubject.length <= maxSummaryLength(options, answers)
                ? chalk.green
                : chalk.red;
            return color('(' + filteredSubject.length + ') ' + subject);
          },
          filter: function(subject) {
            return filterSubject(subject);
          }
        },
        {
          type: 'input',
          name: 'body',
          message:
            'Provide a longer description of the change: (press enter to skip)\n',
          default: options.defaultBody
        },
        {
          type: 'confirm',
          name: 'isBreaking',
          message: 'Are there any breaking changes?',
          default: false
        },
        {
          type: 'input',
          name: 'breakingBody',
          default: '-',
          message:
            'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself:\n',
          when: function(answers) {
            return answers.isBreaking && !answers.body;
          },
          validate: function(breakingBody, answers) {
            return (
              breakingBody.trim().length > 0 ||
              'Body is required for BREAKING CHANGE'
            );
          }
        },
        {
          type: 'input',
          name: 'breaking',
          message: 'Describe the breaking changes:\n',
          when: function(answers) {
            return answers.isBreaking;
          }
        },

        {
          type: 'confirm',
          name: 'isIssueAffected',
          message: 'Does this change affect any open issues?',
          default: options.defaultIssues ? true : false
        },
        {
          type: 'input',
          name: 'issuesBody',
          default: '-',
          message:
            'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself:\n',
          when: function(answers) {
            return (
              answers.isIssueAffected && !answers.body && !answers.breakingBody
            );
          }
        },
        {
          type: 'input',
          name: 'issues',
          message: 'Add issue references (e.g. "fix #123", "re #123".):\n',
          when: function(answers) {
            return answers.isIssueAffected;
          },
          default: options.defaultIssues ? options.defaultIssues : undefined
        }
      ]).then(function(answers) {
        var wrapOptions = {
          trim: true,
          cut: false,
          newline: '\n',
          indent: '',
          width: options.maxLineWidth
        };

        // parentheses are only needed when a scope is present
        var scope;
        if (answers.scopeChoices && answers.scopeChoices !== otherScopeChoice) {
          scope = '(' + answers.scopeChoices + ')';
        } else {
          scope = answers.scope ? '(' + answers.scope + ')' : '';
        }

        // Hard limit this line in the validate
        var head = answers.type + scope + ': ' + answers.subject;

        // Wrap these lines at options.maxLineWidth characters
        var body = answers.body ? wrap(answers.body, wrapOptions) : false;

        // Apply breaking change prefix, removing it if already present
        var breaking = answers.breaking ? answers.breaking.trim() : '';
        breaking = breaking
          ? 'BREAKING CHANGE: ' + breaking.replace(/^BREAKING CHANGE: /, '')
          : '';
        breaking = breaking ? wrap(breaking, wrapOptions) : false;

        var issues = answers.issues ? wrap(answers.issues, wrapOptions) : false;

        commit(filter([head, body, breaking, issues]).join('\n\n'));
      });
    }
  };
};
