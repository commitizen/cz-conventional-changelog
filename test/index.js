import assert from 'assert';
import shell from 'shelljs';
import PackageUtilities from 'lerna/lib/PackageUtilities';

import stub from './_stub';
import { prompter } from '../src/index';


const createMockCommitizenCli = (answers) => ({
  prompt(questions) {
    let qs = questions;

    if (!Array.isArray(qs)) {
      qs = [qs];
    }

    return Promise.resolve(
      qs.reduce((acc, question) => {
        acc[question.name] = answers[question.message];

        return acc;
      }, {})
    );
  },
  registerPrompt: () => {},
});


describe('cz-lerna-changelog', () => {
  it('should generate correct commit message from prompt answers', (done) => {
    stub(shell, 'exec', () => ({ stdout: '' }));
    stub(PackageUtilities, 'getPackages', () => ([{
      name: 'test-package',
      location: 'packages/test-package'
    }]));

    const answers = {
      'Select the type of change that you\'re committing:':                         'feat',
      'Denote the scope of this change:':                                           'Fake scope',
      'Write a short, imperative tense description of the change:\n':               'Test commit',
      'Provide a longer description of the change (optional). Use "|" to break new line:\n': 'This commit is a fake one',
      'List any BREAKING CHANGES (optional):\n':                                    '',
      'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n':        '',
      'The packages that this commit has affected (0 detected)\n':                  ['test-package']
    };

    prompter(createMockCommitizenCli(answers), (commitMessage) => {
      try {
        assert.equal(
          commitMessage.trim(),
          'feat(Fake scope): Test commit\n\naffects: test-package\n\nThis commit is a fake one'
        );
        done();
      } catch (e) {
        done(e);
      }
    })
  });
});
