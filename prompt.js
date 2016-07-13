"format cjs";

/**
 * Prompt the user for information about a commit
 * @param cz commitizen object that can prompt the user for input
 * @param {Object} options [{}] – options to control what is prompted
 * @param {Object} options.questions – override the questions prompted with. Each key is a name, and each value is the object for the question
 * @param callback a function called with the answers from the prompt (an object containing `scope`, `type`, `subject`,
 *        `body` and `footer`)
 */
function prompt (cz, options, callback) {
  if (typeof options === 'function') {
    options = {};
    callback = options;
  }
  // Let's ask some questions of the user
  // so that we can populate our commit
  // template.
  //
  // See inquirer.js docs for specifics.
  // You can also opt to use another input
  // collection library if you prefer.
  var defaultQuestions = [
    {
      type: 'list',
      name: 'type',
      message: 'Select the type of change that you\'re committing:',
      choices: [
        {
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
    }
  ];

  var questions = defaultQuestions.map(function (defaultQuestion) {
    return Object.assign(defaultQuestion, (options.questions && options.questions[defaultQuestion.name]) || {});
  });

  cz.prompt(questions).then(callback);
}

module.exports = prompt;
