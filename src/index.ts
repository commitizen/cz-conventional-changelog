import engine from './engine';
import { Options } from './types';

const options: Options = {
  defaultBody: '',
  defaultSubject: '',
  defaultType: 'feat',
  maxHeaderWidth: 100,
  maxLineWidth: 100,
  types: {
    feat: 'A commit that adds a new feature',
    fix: 'A commit that fixes a bug',
    docs: 'A commit that adds or modifies documentation',
    test: 'A commit that adds or modifies tests',
    perf: 'A commit that aims to improve performance without any functional changes',
    chore: "A commit that doesn't affect project's source code",
    refactor: 'A commit that refactors code'
  }
};

module.exports = engine(options);
