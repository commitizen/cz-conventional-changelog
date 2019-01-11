const engine = require('./engine');
const types = require('conventional-commit-types').types;
const chalk = require('chalk');

const defaultOptions = {
  types,
  maxLineWidth: 100,
  maxHeaderWidth: 100
};

const type = 'func';
const scope = 'everything';
const subject = 'testing123';
const subject2 = 'after the fall, I was gone';
const longBody =
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const longBodySplit =
  longBody.slice(0, defaultOptions.maxLineWidth) +
  '\n' +
  longBody.slice(defaultOptions.maxLineWidth, longBody.length);
const body = 'A quick brown fox jumps over the dog';
const issues = 'a issues is not a person that kicks things';
const longIssues =
  'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' +
  'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' +
  'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
const breakingChange = 'BREAKING CHANGE: ';
const breaking = 'asdhdfkjhbakjdhjkashd adhfajkhs asdhkjdsh ahshd';
const longIssuesSplit =
  longIssues.slice(0, defaultOptions.maxLineWidth) +
  '\n' +
  longIssues.slice(defaultOptions.maxLineWidth, longIssues.length);

describe('commit message', () => {
  test('only header w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject
      })
    ).toEqual(`${type}: ${subject}`);
  });
  test('only header w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject
      })
    ).toEqual(`${type}(${scope}): ${subject}`);
  });
  test('header and body w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body
      })
    ).toEqual(`${type}: ${subject}\n\n${body}`);
  });
  test('header and body w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body
      })
    ).toEqual(`${type}(${scope}): ${subject}\n\n${body}`);
  });
  test('header, body and issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body,
        issues
      })
    ).toEqual(`${type}: ${subject}\n\n${body}\n\n${issues}`);
  });
  test('header, body and issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body,
        issues
      })
    ).toEqual(`${type}(${scope}): ${subject}\n\n${body}\n\n${issues}`);
  });
  test('header, body and long issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body,
        issues: longIssues
      })
    ).toEqual(`${type}: ${subject}\n\n${body}\n\n${longIssuesSplit}`);
  });
  test('header, body and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body,
        issues: longIssues
      })
    ).toEqual(`${type}(${scope}): ${subject}\n\n${body}\n\n${longIssuesSplit}`);
  });
  test('header and long body w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body: longBody
      })
    ).toEqual(`${type}: ${subject}\n\n${longBodySplit}`);
  });
  test('header and long body w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody
      })
    ).toEqual(`${type}(${scope}): ${subject}\n\n${longBodySplit}`);
  });
  test('header, long body and issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body: longBody,
        issues
      })
    ).toEqual(`${type}: ${subject}\n\n${longBodySplit}\n\n${issues}`);
  });
  test('header, long body and issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        issues
      })
    ).toEqual(`${type}(${scope}): ${subject}\n\n${longBodySplit}\n\n${issues}`);
  });
  test('header, long body and long issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body: longBody,
        issues: longIssues
      })
    ).toEqual(`${type}: ${subject}\n\n${longBodySplit}\n\n${longIssuesSplit}`);
  });
  test('header, long body and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        issues: longIssues
      })
    ).toEqual(
      `${type}(${scope}): ${subject}\n\n${longBodySplit}\n\n${longIssuesSplit}`
    );
  });
  test('header, long body, breaking change, and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        breaking,
        issues: longIssues
      })
    ).toEqual(
      `${type}(${scope}): ${subject}\n\n${longBodySplit}\n\n${breakingChange}${breaking}\n\n${longIssuesSplit}`
    );
  });
  test('header, long body, breaking change (with prefix entered), and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        breaking: `${breakingChange}${breaking}`,
        issues: longIssues
      })
    ).toEqual(
      `${type}(${scope}): ${subject}\n\n${longBodySplit}\n\n${breakingChange}${breaking}\n\n${longIssuesSplit}`
    );
  });
});

describe('validation', () => {
  test('subject exceeds max length', () => {
    expect(() =>
      commitMessage({
        type,
        scope,
        subject: longBody
      })
    ).toThrow(
      'length must be less than or equal to ' +
        `${defaultOptions.maxLineWidth - type.length - scope.length - 4}`
    );
  });
  test('empty subject', () => {
    expect(() =>
      commitMessage({
        type,
        scope,
        subject: ''
      })
    ).toThrow('subject is required');
  });
});

describe('defaults', () => {
  test('defaultType default', () => {
    expect(questionDefault('type')).toBeFalsy();
  });
  test('defaultType options', () => {
    expect(
      questionDefault('type', { ...defaultOptions, defaultType: type })
    ).toEqual(type);
  });
  test('defaultScope default', () => {
    expect(questionDefault('scope')).toBeFalsy();
  });
  test('defaultScope options', () => {
    expect(
      questionDefault('scope', {
        ...defaultOptions,
        defaultScope: scope
      })
    ).toEqual(scope);
  });
  test('defaultSubject default', () => {
    expect(questionDefault('subject')).toBeFalsy();
  });
  test('defaultSubject options', () => {
    expect(
      questionDefault('subject', {
        ...defaultOptions,
        defaultSubject: subject
      })
    ).toEqual(subject);
  });
  test('defaultBody default', () => {
    expect(questionDefault('body')).toBeFalsy();
  });
  test('defaultBody options', () => {
    expect(
      questionDefault('body', { ...defaultOptions, defaultBody: body })
    ).toEqual(body);
  });
  test('defaultIssues default', () => {
    expect(questionDefault('issues')).toBeFalsy();
  });
  test('defaultIssues options', () => {
    expect(
      questionDefault('issues', {
        ...defaultOptions,
        defaultIssues: issues
      })
    ).toEqual(issues);
  });
});

describe('prompts', () => {
  test('commit subject prompt for commit w/ out scope', () => {
    expect(questionPrompt('subject', { type })).toEqual(
      expect.stringContaining(
        `(max ${defaultOptions.maxHeaderWidth - type.length - 2} chars)`
      )
    );
  });
  test('commit subject prompt for commit w/ scope', () => {
    expect(questionPrompt('subject', { type, scope })).toEqual(
      expect.stringContaining(
        `(max ${defaultOptions.maxHeaderWidth -
          type.length -
          scope.length -
          4} chars)`
      )
    );
  });
});

describe('transformation', () => {
  test('subject w/ character count', () =>
    expect(
      questionTransformation('subject', {
        type,
        subject
      })
    ).toEqual(chalk.green(`(${subject.length}) ${subject}`)));
  test('long subject w/ character count', () =>
    expect(
      questionTransformation('subject', {
        type,
        subject: longBody
      })
    ).toEqual(chalk.red(`(${longBody.length}) ${longBody}`)));
});

describe('filter', () => {
  test('lowercase scope', () =>
    expect(questionFilter('scope', 'HelloMatt')).toEqual('hellomatt'));
  test('lowerfirst subject trimmed and trailing dots striped', () =>
    expect(questionFilter('subject', '  A subject...  ')).toEqual('a subject'));
});

describe('when', () => {
  test('breaking by default', () =>
    expect(questionWhen('breaking', {})).toBeFalsy());
  test('breaking when isBreaking', () =>
    expect(
      questionWhen('breaking', {
        isBreaking: true
      })
    ).toBeTruthy());
  test('issues by default', () =>
    expect(questionWhen('issues', {})).toBeFalsy());
  test('issues when isIssueAffected', () =>
    expect(
      questionWhen('issues', {
        isIssueAffected: true
      })
    ).toBeTruthy());
});

function commitMessage(answers, options = defaultOptions) {
  let result = null;
  engine(options).prompter(
    {
      prompt: function(questions) {
        return {
          then: function(finalizer) {
            processQuestions(questions, answers, options);
            finalizer(answers);
          }
        };
      }
    },
    function(message) {
      result = message;
    }
  );
  return result;
}

function processQuestions(questions, answers, options) {
  for (let i in questions) {
    const question = questions[i];
    const answer = answers[question.name];
    const validation =
      answer === undefined || !question.validate
        ? true
        : question.validate(answer, answers);
    if (validation !== true) {
      throw new Error(
        validation ||
          `Answer '${answer}' to question '${question.name}' was invalid`
      );
    }
    if (question.filter && answer) {
      answers[question.name] = question.filter(answer);
    }
  }
}

function getQuestions(options = defaultOptions) {
  let result = null;
  engine(options).prompter({
    prompt: function(questions) {
      result = questions;
      return {
        then: function() {}
      };
    }
  });
  return result;
}

function getQuestion(name, options = defaultOptions) {
  const questions = getQuestions(options);
  for (const i in questions) {
    if (questions[i].name === name) {
      return questions[i];
    }
  }
  return false;
}

function questionPrompt(name, answers, options = defaultOptions) {
  const question = getQuestion(name, options);
  return question.message && typeof question.message === 'string'
    ? question.message
    : question.message(answers);
}

function questionTransformation(name, answers, options = defaultOptions) {
  const question = getQuestion(name, options);
  return (
    question.transformer &&
    question.transformer(answers[name], answers, options)
  );
}

function questionFilter(name, answer, options = defaultOptions) {
  const question = getQuestion(name, options);
  return (
    question.filter &&
    question.filter(typeof answer === 'string' ? answer : answer[name])
  );
}

function questionDefault(name, options = defaultOptions) {
  const question = getQuestion(name, options);
  return question.default;
}

function questionWhen(name, answers, options = defaultOptions) {
  const question = getQuestion(name, options);
  return question.when(answers);
}
