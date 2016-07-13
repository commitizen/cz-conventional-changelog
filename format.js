"format cjs";
var wrap = require('word-wrap');

/**
 * Format answers from prompt into a commit message
 * @param promptAnswers answers from a CLI prompt, containing `scope`, `type`, `subject`, `body` and `footer`.
 * @returns {{head: string, body: string, footer: string}}
 */
function format (promptAnswers) {
  var maxLineWidth = 100;

  var wrapOptions = {
    trim: true,
    newline: '\n',
    indent: '',
    width: maxLineWidth
  };

  // parentheses are only needed when a scope is present
  var scope = promptAnswers.scope.trim();
  scope = scope ? '(' + promptAnswers.scope.trim() + ')' : '';

  // Hard limit this line
  var head = (promptAnswers.type + scope + ': ' + promptAnswers.subject.trim()).slice(0, maxLineWidth);

  // Wrap these lines at 100 characters
  var body = wrap(promptAnswers.body, wrapOptions);
  var footer = wrap(promptAnswers.footer, wrapOptions);

  return {
    head: head,
    body: body,
    footer: footer
  }
}

module.exports = {
  format: format,
  help: 'Line 1 will be cropped at 100 characters. All other lines will be wrapped after 100 characters.'
};