import conventionalChangelog from 'cz-conventional-changelog';

import PackageUtilities from 'lerna/lib/PackageUtilities';
import Repository from 'lerna/lib/Repository';

import shell from 'shelljs';
import path from 'path';

function getAllPackages () {
  return PackageUtilities.getPackages(new Repository());
}

function getChangedPackages () {
  const changedFiles = shell.exec('git diff --cached --name-only', {silent: true})
    .stdout
    .split('\n');

  return getAllPackages()
    .filter(function (pkg) {
      const packagePrefix = path.relative('.', pkg.location) + path.sep;
      for (let changedFile of changedFiles) {
        if (changedFile.indexOf(packagePrefix) === 0) {
          return true;
        }
      }
    })
    .map(function (pkg) {
      return pkg.name
    });
}

module.exports = {
  prompter: function(cz, commit) {

    const allPackages = getAllPackages().map((pkg) => pkg.name);

    conventionalChangelog.prompter(cz, (commitMessage) => {
      const [messageHead, ...restOfMessageParts] = commitMessage.split('\n\n');

      cz.prompt({
        type: 'checkbox',
        name: 'packages',
        'default': getChangedPackages(),
        choices: allPackages,
        message: `The packages that this commit has affected (${getChangedPackages().length} detected)\n`,
        validate: function (input) {
          const type = commitMessage.type;
          const isRequired = ['feat', 'fix'].some((type) => messageHead.indexOf(type) === 0);
          const isProvided = input.length > 0;
          return isRequired ? (isProvided ? true : `Commit type "${type}" must affect at least one component`) : true;
        }
      }).then(function (packageAnswers) {
        const messages = [
          messageHead
        ];

        const selectedPackages = packageAnswers.packages;
        if (selectedPackages && selectedPackages.length) {
          messages.push('affects: ' + selectedPackages.join(', '));
        }

        messages.push(...restOfMessageParts);

        const modifiedCommitMessage = messages.join('\n\n');

        console.log(modifiedCommitMessage);

        commit(modifiedCommitMessage);
      });
    });
  }
};
