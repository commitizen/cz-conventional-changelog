import { execSync } from 'child_process';
import { Answers } from 'inquirer';
import { Options } from './types';

export const getGitBranch = () => {
  return execSync('git branch --show-current')
    .toString()
    .trim();
};

export const getHeaderLength = (answers: Answers) => {
  const requiredTypeSpace = answers.type.length + 3; // e.g. "[feat] " (brackets, type name, space)
  const requiredGitBranchSpace = getGitBranch().length + 2; // e.g. "SOME-BRANCH: " (branch name, colon, space)

  return requiredTypeSpace + requiredGitBranchSpace;
};

export const getLongestStringInArray = (array: Array<any>) => {
  const sortedArray = array.slice().sort((a, b) => {
    return b.toString().length - a.toString().length;
  });

  if (sortedArray.length > 0) {
    return sortedArray[0];
  }

  return undefined;
};

export const getMaxSummaryLength = (options: Options, answers: Answers) => {
  return options.maxHeaderWidth - getHeaderLength(answers);
};

export const transformSubject = (subject: string) => {
  let transformedSubject = subject.trim();

  // Ensure subject starts with capital character
  if (subject.charAt(0) !== subject.charAt(0).toUpperCase()) {
    transformedSubject = transformedSubject.charAt(0).toUpperCase() + transformedSubject.slice(1);
  }

  // Ensure subject doesn't end in a period
  while (subject.endsWith('.')) {
    transformedSubject = transformedSubject.slice(0, subject.length - 1);
  }

  return transformedSubject;
};
