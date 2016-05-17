'use strict';

var _prompt = require('cz-conventional-changelog/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _UpdatedCommand = require('lerna/lib/commands/UpdatedCommand');

var _UpdatedCommand2 = _interopRequireDefault(_UpdatedCommand);

var _PackageUtilities = require('lerna/lib/PackageUtilities');

var _PackageUtilities2 = _interopRequireDefault(_PackageUtilities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  prompter: function prompter(cz, commit) {
    var updatedCommand = new _UpdatedCommand2.default([], {});

    // We can't use updatedCommand.run() as this will exit TODO: PR to add an option to run specifying whether it'd exit
    updatedCommand.runValidations();
    updatedCommand.runPreparations();
    updatedCommand.initialize(function () {
      updatedCommand.execute(function () {
        var updatedPackages = updatedCommand.updates.map(function (update) {
          return update.package.name;
        });
        var defaults = {
          packages: updatedPackages.join(',')
        };

        //var packages = answers.packages.trim();
        //packages = packages ? '[' + packages + ']' : '';

        (0, _prompt2.default)(cz, function (head, body, footer) {
          var packages = answers.packages.trim();
          packages = packages ? '[' + packages + ']' : '';

          commit(head + '\n\n' + body + '\n\n' + footer);
        });
      });
    });
  }
};