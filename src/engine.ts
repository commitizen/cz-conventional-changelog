import chalk from 'chalk';
import { Answers, PromptFunction } from 'inquirer';
import wrap from 'word-wrap';

import { Options } from './types';
import * as engineUtils from './utils';

/**
 * This can be any kind of SystemJS compatible module. We use ES6 here, but
 * Commonjs or AMD would do just fine.
 */
const engine = (options: Options) => {
  const { types } = options;
  const typeNames = Object.keys(types);
  const length = engineUtils.getLongestStringInArray(typeNames).length + 1;

  const choices = typeNames.map(typeName => {
    const description = types[typeName];

    return { 
      name: `${typeName}:`.padEnd(length) + ` ${description}`,
      value: typeName
    };
  });

  return {
    /**
     * When a user runs `git cz`, prompter will be executed. We pass you cz,
     * which currently is just an instance of inquirer.js. Using this you can
     * ask questions and get answers.
     *
     * The commit callback should be executed when you're ready to send back a
     * commit template to git.
     *
     * By default, we'll de-indent your commit template and will keep empty
     * lines.
     */
    prompter: function(cz: { prompt: PromptFunction }, commit: (commitMessage: string) => void) {
      /**
       * Let's ask some questions of the user so that we can populate our commit
       * template.
       *
       * See inquirer.js docs for specifics. You can also opt to use another
       * input collection library if you prefer.
       */
      cz.prompt([
        // 1. Type of commit, e.g. `feat`, `chore`, etc.
        {
          type: 'list',
          name: 'type',
          message: "Select the type of change that you're committing:",
          choices,
          default: options.defaultType
        },

        // 2. Short commit description
        {
          type: 'input',
          name: 'subject',
          message: (answers: Answers) => {
            const maxSummaryLength = engineUtils.getMaxSummaryLength(options, answers);

            return `Write a short, imperative tense description of the change (max ${maxSummaryLength} chars):\n`;
          },
          default: options.defaultSubject,
          validate: (subject: string, answers: Answers) => {
            const filteredSubject = engineUtils.transformSubject(subject);

            if (filteredSubject.length === 0) {
              return 'Subject is required.';
            }

            const maxSummaryLength = engineUtils.getMaxSummaryLength(options, answers);

            if (filteredSubject.length <= maxSummaryLength) {
              return true;
            }

            return (
              `Subject length must be less than or equal to ${maxSummaryLength}` +
              ` characters. Current length is ${filteredSubject.length} characters.`
            );
          },
          transformer: (subject: string, answers: Answers) => {
            const filteredSubject = engineUtils.transformSubject(subject);
            const maxSummaryLength = engineUtils.getMaxSummaryLength(options, answers);
            const color = filteredSubject.length <= maxSummaryLength ? chalk.green : chalk.red;

            return color(`(${filteredSubject.length}) ${subject}`);
          },
          filter: (subject: string) => {
            return engineUtils.transformSubject(subject);
          }
        },

        // 3. Long commit description
        {
          type: 'input',
          name: 'body',
          message: 'Provide a longer description of the change: (press enter to skip)\n',
          default: options.defaultBody
        }
      ])

        // After getting all the answers
        .then((answers: Answers) => {
          const wrapOptions = {
            trim: false,
            cut: false,
            newline: '\n',
            indent: '',
            width: options.maxLineWidth
          };

          // Hard limit this line in the validate
          const head = `${engineUtils.getGitBranch()}: \u0060${answers.type}\u0060 ${answers.subject}`;

          // Wrap these lines at options.maxLineWidth characters
          const body = answers.body ? wrap(answers.body, wrapOptions) : false;

          commit([head, body].filter(text => text).join('\n\n'));
        });
    }
  };
};

export default engine;
