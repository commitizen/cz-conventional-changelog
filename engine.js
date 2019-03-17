"format cjs";

var wrap = require('word-wrap');
var map = require('lodash.map');
var longest = require('longest');
var rightPad = require('right-pad');

var filter = function(array) {
  return array.filter(function(x) {
    return x;
  });
};

// 这可以是任何类型的SystemJS兼容模块。
// 我们在这里使用Commonjs，但ES6或AMD也兼容。
module.exports = function (options) {

  var types = options.types;

  var length = longest(Object.keys(types)).length + 1;
  var choices = map(types, function (type, key) {
    return {
      name: rightPad(key + ':', length) + ' ' + type.description,
      value: key
    };
  });

  return {
    // 当用户运行`git cz`时，将执行提示符。我们传递给你cz，
    // 使用此功能，您可以提出问题并获得答案。
    // 当您准备好将提交模板发送回git时，应该执行提交回调。
    // 默认情况下，我们将取消缩进您的提交模板并保留空行。
    prompter: function(cz, commit) {
      console.log('\n第1行将被裁剪为100个字符，所有其他行将在100个字符后换行。\n');


      // 让我们问一下用户的一些问题，这样我们就可以填充我们的提交模板。
      // 您也可以选择使用其他输入，如果你愿意，可以收集库。
      cz.prompt([
        {
          type: 'list',
          name: 'type',
          message: '选择您要提交的更改类型：',
          choices: choices,
          default: options.defaultType
        }, {
          type: 'input',
          name: 'scope',
          message: '此代码提交的范围是什么（例如组件或文件名）？（按enter键跳过）\n',
          default: options.defaultScope
        }, {
          type: 'input',
          name: 'subject',
          message: '写一个简短的，命令式的代码提交描述：\n',
          default: options.defaultSubject
        }, {
          type: 'input',
          name: 'body',
          message: '请提供更长的更改提交描述：(按enter键跳过）\n',
          default: options.defaultBody
        }, {
          type: 'confirm',
          name: 'isBreaking',
          message: '有没有不兼容性的更新？',
          default: false
        }, {
          type: 'input',
          name: 'breaking',
          message: '描述不兼容更新：\n',
          when: function(answers) {
            return answers.isBreaking;
          }
        }, {
          type: 'confirm',
          name: 'isIssueAffected',
          message: '本次代码提交是否与任何问题关联？',
          default: options.defaultIssues ? true : false
        }, {
          type: 'input',
          name: 'issues',
          message: '添加问题编号参考 (例如："fix #123", "re #123".):\n',
          when: function(answers) {
            return answers.isIssueAffected;
          },
          default: options.defaultIssues ? options.defaultIssues : undefined
        }
      ]).then(function(answers) {

        var maxLineWidth = 100;

        var wrapOptions = {
          trim: true,
          newline: '\n',
          indent:'',
          width: maxLineWidth
        };

        // 仅在存在范围时才需要括号
        var scope = answers.scope.trim();
        scope = scope ? '(' + answers.scope.trim() + ')' : '';

        // 硬限制这条线
        var head = (answers.type + scope + ': ' + answers.subject.trim()).slice(0, maxLineWidth);

        // 将这些行换行为100个字符
        var body = wrap(answers.body, wrapOptions);

        // 应用中断更改前缀，如果已存在则将其删除
        var breaking = answers.breaking ? answers.breaking.trim() : '';
        breaking = breaking ? '不兼容更新: ' + breaking.replace(/^BREAKING CHANGE: /, '') : '';
        breaking = wrap(breaking, wrapOptions);

        var issues = answers.issues ? wrap(answers.issues, wrapOptions) : '';

        var footer = filter([ breaking, issues ]).join('\n\n');

        commit(head + '\n\n' + body + '\n\n' + footer);
      });
    }
  };
};
