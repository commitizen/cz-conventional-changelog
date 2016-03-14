"format cjs";

var wrap = require('word-wrap');

// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = {

    // When a user runs `git cz`, prompter will
    // be executed. We pass you cz, which currently
    // is just an instance of inquirer.js. Using
    // this you can ask questions and get answers.
    //
    // The commit callback should be executed when
    // you're ready to send back a commit template
    // to git.
    //
    // By default, we'll de-indent your commit
    // template and will keep empty lines.
    prompter: function(cz, commit) {

        console.log('Line 1 will be cropped at 100 characters. All other lines will be wrapped after 100 characters.\n');

        // Let's ask some questions of the user
        // so that we can populate our commit
        // template.
        //
        // See inquirer.js docs for specifics.
        // You can also opt to use another input
        // collection library if you prefer.
        cz.prompt([
            {
                type: 'input',
                name: 'jira',
                message: 'JIRA ID: '
            }, {
                type: 'list',
                name: 'type',
                message: 'Select the type of change that you\'re committing:',
                choices: [
                    {
                        name: 'feat:\t\tA new feature',
                        value: 'feat'
                    }, {
                        name: 'fix:\t\tA bug fix',
                        value: 'fix'
                    }, {
                        name: 'docs:\t\tDocumentation only changes',
                        value: 'docs'
                    }, {
                        name: 'style:\tChanges that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
                        value: 'style'
                    }, {
                        name: 'refactor:\tA code change that neither fixes a bug or adds a feature',
                        value: 'refactor'
                    }, {
                        name: 'perf:\t\tA code change that improves performance',
                        value: 'perf'
                    }, {
                        name: 'test:\t\tAdding missing tests',
                        value: 'test'
                    }, {
                        name: 'chore:\tChanges to the build process or auxiliary tools and libraries such as documentation generation',
                        value: 'chore'
                    }]
            }, {
                type: 'input',
                name: 'scope',
                message: 'Denote the scope of this change ($location, $browser, $compile, etc.): '
            }, {
                type: 'input',
                name: 'subject',
                message: 'Write a short, imperative tense description of the change: '
            }, {
                type: 'input',
                name: 'body',
                message: 'Provide a longer description of the change: '
            }, {
                type: 'input',
                name: 'footer',
                message: 'List any breaking changes or issues closed by this change: '
            }
        ], function(answers) {

            var maxLineWidth = 100;

            var wrapOptions = {
                trim: true,
                newline: '\n',
                indent: '',
                width: maxLineWidth
            };

            var products = 'CCNEW|FE|SVEAC|SM|SP|SPIL|FAPI|ELNEW|ESNEW|BO';
            var pattern = new RegExp('(\b' + products + '\b)+-{1}\\d{1,}');

            if (pattern.test(answers.jira) === false) {
                console.log('\nError: JIRA ID must begin with %s\n', products);
                return;
            }

            // parentheses are only needed when a scope is present
            var scope = answers.scope.trim();
            scope = scope ? '(' + answers.scope.trim() + ')' : '';

            // Hard limit this line
            var head = answers.jira.trim() + ' ' + (answers.type + scope + ': ' + answers.subject.trim()).slice(0, maxLineWidth);

            // Wrap these lines at 100 characters
            var body = wrap(answers.body, wrapOptions);
            var footer = wrap(answers.footer, wrapOptions);

            commit(head + '\n\n' + body + '\n\n' + footer);
        });
    }
}
