import conventionalPrompt from 'cz-conventional-changelog/prompt';
import conventionalFormat from 'cz-conventional-changelog/format';

import PackageUtilities from 'lerna/lib/PackageUtilities';
import Repository from 'lerna/lib/Repository';

module.exports = {
  prompter: function(cz, commit) {
    console.log('\n' + conventionalFormat.help + '\n');

    const packagesLocation = new Repository().packagesLocation;
    const allPackages = PackageUtilities.getPackages(packagesLocation).map((pkg) => pkg.name);

    conventionalPrompt(cz, (conventionalAnswers) => {
      const conventionalChangelogEntry = conventionalFormat.format(conventionalAnswers);

      cz.prompt({
        type: 'checkbox',
        name: 'packages',
        'default': [],
        choices: allPackages,
        message: 'The packages that this commit has affected\n',
        validate: function (input) {
          const type = conventionalAnswers.type;
          const isRequired = ['feat', 'fix'].indexOf(type) > -1;
          const isProvided = input.length > 0;
          return isRequired ? (isProvided ? true : `Commit type "${type}" must affect at least one component`) : true;
        }
      }).then(function (packageAnswers) {
        const messages = [
          conventionalChangelogEntry.head
        ];

        const selectedPackages = packageAnswers.packages;
        if (selectedPackages && selectedPackages.length) {
          messages.push('affects: ' + selectedPackages.join(', '));
        }

        messages.push(conventionalChangelogEntry.body);
        messages.push(conventionalChangelogEntry.footer);

        const commitMessage = messages.join('\n\n');

        console.log(commitMessage);

        commit(commitMessage);
      });
    });
  }
};
