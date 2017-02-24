import shell from 'shelljs';
import path from 'path';
import commitAnalyzer from '@semantic-release/commit-analyzer';
import chalk from 'chalk';
import buildCommit from 'cz-customizable/buildCommit';
import autocomplete from 'inquirer-autocomplete-prompt';
import Repository from 'lerna/lib/Repository';
import PackageUtilities from 'lerna/lib/PackageUtilities';

import questions from './questions';
import autocompleteQuestions from './autocomplete-questions';

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

function makeAffectsLine (answers) {
  const selectedPackages = answers.packages;
  if (selectedPackages && selectedPackages.length) {
    return `affects: ${selectedPackages.join(', ')}`;
  }
}

function getCommitTypeMessage (type) {
  if (!type) {
    return 'This commit does not indicate any release'
  }
  return {
    patch: '🛠  This commit indicates a patch release (0.0.X)',
    minor: '✨  This commit indiates a minor release (0.X.0)',
    major: '💥  This commit indicates a major release (X.0.0)',
  }[type];
}

module.exports = {
  prompter: function(cz, commit) {
    const allPackages = getAllPackages().map((pkg) => pkg.name);
    const changedPackages = getChangedPackages();
    const rawQuestions = questions(allPackages, changedPackages);

    cz.registerPrompt('autocomplete', autocomplete);
    console.log('\n\nLine 1 will be cropped at 100 characters. All other lines will be wrapped after 100 characters.\n');

    cz.prompt(
      autocompleteQuestions(rawQuestions)
    ).then((answers) => {
      const affectsLine = makeAffectsLine(answers);
      if (affectsLine) {
        answers.body = `${affectsLine}\n` + answers.body;
      }
      const message = buildCommit(answers);
      const type = commitAnalyzer({}, {
        commits: [{
          hash: '',
          message,
        }],
      }, (err, type) => {
        console.log(chalk.green(`\n${getCommitTypeMessage(type)}\n`));
        console.log('\n\nCommit message:');
        console.log(chalk.blue(`\n\n${message}\n`));
        commit(message)
      });
    });
  }
};
