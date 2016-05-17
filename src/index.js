import prompt from 'cz-conventional-changelog/prompt';

import UpdatedCommand from 'lerna/lib/commands/UpdatedCommand';
import PackageUtilities from 'lerna/lib/PackageUtilities';

module.exports = {
  prompter: function(cz, commit) {
    const updatedCommand = new UpdatedCommand([], {});

    // We can't use updatedCommand.run() as this will exit TODO: PR to add an option to run specifying whether it'd exit
    updatedCommand.runValidations();
    updatedCommand.runPreparations();
    updatedCommand.initialize(() => {
      updatedCommand.execute(() => {
        const updatedPackages = updatedCommand.updates.map((update) => update.package.name);
        const defaults = {
          packages: updatedPackages.join(',')
        };

        //var packages = answers.packages.trim();
        //packages = packages ? '[' + packages + ']' : '';

        prompt(cz, (head, body, footer) => {
          var packages = answers.packages.trim();
          packages = packages ? '[' + packages + ']' : '';

          commit(head + '\n\n' + body + '\n\n' + footer);

        });
      });
    });
  }
};
