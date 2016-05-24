'use strict';

var _prompt = require('cz-conventional-changelog/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _format = require('cz-conventional-changelog/format');

var _format2 = _interopRequireDefault(_format);

var _PackageUtilities = require('lerna/lib/PackageUtilities');

var _PackageUtilities2 = _interopRequireDefault(_PackageUtilities);

var _Repository = require('lerna/lib/Repository');

var _Repository2 = _interopRequireDefault(_Repository);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  prompter: function prompter(cz, commit) {
    console.log('\n' + _format2.default.help + '\n');

    var packagesLocation = new _Repository2.default().packagesLocation;
    var allPackages = _PackageUtilities2.default.getPackages(packagesLocation).map(function (pkg) {
      return pkg.name;
    });

    (0, _prompt2.default)(cz, function (conventionalAnswers) {
      var conventionalChangelogEntry = _format2.default.format(conventionalAnswers);

      cz.prompt({
        type: 'checkbox',
        name: 'packages',
        'default': [],
        choices: allPackages,
        message: 'The packages that this commit has affected\n',
        validate: function validate(input) {
          var type = conventionalAnswers.type;
          var isRequired = ['feat', 'fix'].indexOf(type) > -1;
          var isProvided = input.length > 0;
          return isRequired ? isProvided ? true : 'Commit type ' + type + ' must affect at least one component' : true;
        }
      }).then(function (packageAnswers) {
        var messages = [conventionalChangelogEntry.head];

        var selectedPackages = packageAnswers.packages;
        if (selectedPackages && selectedPackages.length) {
          messages.push('affects: ' + selectedPackages.join(', '));
        }

        messages.push(conventionalChangelogEntry.body);
        messages.push(conventionalChangelogEntry.footer);

        var commitMessage = messages.join('\n\n');

        console.log(commitMessage);

        commit(commitMessage);
      });
    });
  }
};