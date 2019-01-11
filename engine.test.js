var engine = require('./engine');
var types = require('conventional-commit-types').types;
var chalk = require('chalk');
var chai = require('chai');
var expect = chai.expect;

var defaultOptions = {
  types,
  maxLineWidth: 100,
  maxHeaderWidth: 100
};

var type = 'func';
var scope = 'everything';
var subject = 'testing123';
var subject2 = 'after the fall, I was gone';
var longBody =
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
var longBodySplit =
  longBody.slice(0, defaultOptions.maxLineWidth) +
  '\n' +
  longBody.slice(defaultOptions.maxLineWidth, longBody.length);
var body = 'A quick brown fox jumps over the dog';
var issues = 'a issues is not a person that kicks things';
var longIssues =
  'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' +
  'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' +
  'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
var breakingChange = 'BREAKING CHANGE: ';
var breaking = 'asdhdfkjhbakjdhjkashd adhfajkhs asdhkjdsh ahshd';
var longIssuesSplit =
  longIssues.slice(0, defaultOptions.maxLineWidth) +
  '\n' +
  longIssues.slice(defaultOptions.maxLineWidth, longIssues.length);

describe('commit message', () => {
  it('only header w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject
      })
    ).to.equal(`${type}: ${subject}`);
  });
  it('only header w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject
      })
    ).to.equal(`${type}(${scope}): ${subject}`);
  });
  it('header and body w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body
      })
    ).to.equal(`${type}: ${subject}\n\n${body}`);
  });
  it('header and body w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body
      })
    ).to.equal(`${type}(${scope}): ${subject}\n\n${body}`);
  });
  it('header, body and issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body,
        issues
      })
    ).to.equal(`${type}: ${subject}\n\n${body}\n\n${issues}`);
  });
  it('header, body and issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body,
        issues
      })
    ).to.equal(`${type}(${scope}): ${subject}\n\n${body}\n\n${issues}`);
  });
  it('header, body and long issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body,
        issues: longIssues
      })
    ).to.equal(`${type}: ${subject}\n\n${body}\n\n${longIssuesSplit}`);
  });
  it('header, body and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body,
        issues: longIssues
      })
    ).to.equal(
      `${type}(${scope}): ${subject}\n\n${body}\n\n${longIssuesSplit}`
    );
  });
  it('header and long body w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body: longBody
      })
    ).to.equal(`${type}: ${subject}\n\n${longBodySplit}`);
  });
  it('header and long body w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody
      })
    ).to.equal(`${type}(${scope}): ${subject}\n\n${longBodySplit}`);
  });
  it('header, long body and issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body: longBody,
        issues
      })
    ).to.equal(`${type}: ${subject}\n\n${longBodySplit}\n\n${issues}`);
  });
  it('header, long body and issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        issues
      })
    ).to.equal(
      `${type}(${scope}): ${subject}\n\n${longBodySplit}\n\n${issues}`
    );
  });
  it('header, long body and long issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body: longBody,
        issues: longIssues
      })
    ).to.equal(`${type}: ${subject}\n\n${longBodySplit}\n\n${longIssuesSplit}`);
  });
  it('header, long body and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        issues: longIssues
      })
    ).to.equal(
      `${type}(${scope}): ${subject}\n\n${longBodySplit}\n\n${longIssuesSplit}`
    );
  });
  it('header, long body, breaking change, and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        breaking,
        issues: longIssues
      })
    ).to.equal(
      `${type}(${scope}): ${subject}\n\n${longBodySplit}\n\n${breakingChange}${breaking}\n\n${longIssuesSplit}`
    );
  });
  it('header, long body, breaking change (with prefix entered), and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        breaking: `${breakingChange}${breaking}`,
        issues: longIssues
      })
    ).to.equal(
      `${type}(${scope}): ${subject}\n\n${longBodySplit}\n\n${breakingChange}${breaking}\n\n${longIssuesSplit}`
    );
  });
});

describe('validation', () => {
  it('subject exceeds max length', () => {
    expect(() =>
      commitMessage({
        type,
        scope,
        subject: longBody
      })
    ).to.throw(
      'length must be less than or equal to ' +
        `${defaultOptions.maxLineWidth - type.length - scope.length - 4}`
    );
  });
  it('empty subject', () => {
    expect(() =>
      commitMessage({
        type,
        scope,
        subject: ''
      })
    ).to.throw('subject is required');
  });
});

describe('defaults', () => {
  it('defaultType default', () => {
    expect(questionDefault('type')).to.be.undefined;
  });
  it('defaultType options', () => {
    expect(
      questionDefault('type', customOptions({ defaultType: type }))
    ).to.equal(type);
  });
  it('defaultScope default', () => {
    expect(questionDefault('scope')).to.be.undefined;
  });
  it('defaultScope options', () =>
    expect(
      questionDefault('scope', customOptions({ defaultScope: scope }))
    ).to.equal(scope));

  it('defaultSubject default', () =>
    expect(questionDefault('subject')).to.be.undefined);
  it('defaultSubject options', () => {
    expect(
      questionDefault(
        'subject',
        customOptions({
          defaultSubject: subject
        })
      )
    ).to.equal(subject);
  });
  it('defaultBody default', () => {
    expect(questionDefault('body')).to.be.undefined;
  });
  it('defaultBody options', () => {
    expect(
      questionDefault('body', customOptions({ defaultBody: body }))
    ).to.equal(body);
  });
  it('defaultIssues default', () => {
    expect(questionDefault('issues')).to.be.undefined;
  });
  it('defaultIssues options', () => {
    expect(
      questionDefault(
        'issues',
        customOptions({
          defaultIssues: issues
        })
      )
    ).to.equal(issues);
  });
});

describe('prompts', () => {
  it('commit subject prompt for commit w/ out scope', () => {
    expect(questionPrompt('subject', { type })).to.contain(
      `(max ${defaultOptions.maxHeaderWidth - type.length - 2} chars)`
    );
  });
  it('commit subject prompt for commit w/ scope', () => {
    expect(questionPrompt('subject', { type, scope })).to.contain(
      `(max ${defaultOptions.maxHeaderWidth -
        type.length -
        scope.length -
        4} chars)`
    );
  });
});

describe('transformation', () => {
  it('subject w/ character count', () =>
    expect(
      questionTransformation('subject', {
        type,
        subject
      })
    ).to.equal(chalk.green(`(${subject.length}) ${subject}`)));
  it('long subject w/ character count', () =>
    expect(
      questionTransformation('subject', {
        type,
        subject: longBody
      })
    ).to.equal(chalk.red(`(${longBody.length}) ${longBody}`)));
});

describe('filter', () => {
  it('lowercase scope', () =>
    expect(questionFilter('scope', 'HelloMatt')).to.equal('hellomatt'));
  it('lowerfirst subject trimmed and trailing dots striped', () =>
    expect(questionFilter('subject', '  A subject...  ')).to.equal(
      'a subject'
    ));
});

describe('when', () => {
  it('breaking by default', () =>
    expect(questionWhen('breaking', {})).to.be.undefined);
  it('breaking when isBreaking', () =>
    expect(
      questionWhen('breaking', {
        isBreaking: true
      })
    ).to.be.true);
  it('issues by default', () =>
    expect(questionWhen('issues', {})).to.be.undefined);
  it('issues when isIssueAffected', () =>
    expect(
      questionWhen('issues', {
        isIssueAffected: true
      })
    ).to.be.true);
});

function commitMessage(answers, options) {
  options = options || defaultOptions;
  var result = null;
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
  for (var i in questions) {
    var question = questions[i];
    var answer = answers[question.name];
    var validation =
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

function getQuestions(options) {
  options = options || defaultOptions;
  var result = null;
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

function getQuestion(name, options) {
  options = options || defaultOptions;
  var questions = getQuestions(options);
  for (var i in questions) {
    if (questions[i].name === name) {
      return questions[i];
    }
  }
  return false;
}

function questionPrompt(name, answers, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return question.message && typeof question.message === 'string'
    ? question.message
    : question.message(answers);
}

function questionTransformation(name, answers, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return (
    question.transformer &&
    question.transformer(answers[name], answers, options)
  );
}

function questionFilter(name, answer, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return (
    question.filter &&
    question.filter(typeof answer === 'string' ? answer : answer[name])
  );
}

function questionDefault(name, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return question.default;
}

function questionWhen(name, answers, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return question.when(answers);
}

function customOptions(options) {
  Object.keys(defaultOptions).forEach(key => {
    if (options[key] === undefined) {
      options[key] = defaultOptions[key];
    }
  });
  return options;
}
