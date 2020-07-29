'format cjs';

var engine = require('./engine');
var conventionalCommitTypes = require('conventional-commit-types');
var configLoader = require('commitizen').configLoader;

var IS_VALID_SCOPE_REGEX = /^[a-zA-Z0-9]+$/;

function isValidCommitlintRule(rule) {
  return Array.isArray(rule) && rule.length >= 3;
}

function loadOptions(params) {
  params = params || {};

  var env = params.env || {};
  var config = params.config || {};

  // maxHeaderWidth can come from environment, commitizen config, commitlint config, or default;
  // If the environment variable isn't an integer, then we fall through to
  // commitizen config, then to the default. Commitlint config is detected later.
  var CZ_MAX_HEADER_WIDTH =
    env.CZ_MAX_HEADER_WIDTH && parseInt(env.CZ_MAX_HEADER_WIDTH, 10);
  var maxHeaderWidth = CZ_MAX_HEADER_WIDTH || config.maxHeaderWidth || 100;

  // maxLineWidth can come from environment, commitizen config or default:
  // If the environment variable isn't an integer, then we fall through to
  // commitizen config, then to the default:
  var CZ_MAX_LINE_WIDTH =
    env.CZ_MAX_LINE_WIDTH && parseInt(env.CZ_MAX_LINE_WIDTH, 10);
  var maxLineWidth = CZ_MAX_LINE_WIDTH || config.maxLineWidth || 100;

  // scopes can come from environment, commitizen config, commitlint config or the default of free choice:
  var scopes = config.scopes || [];
  if (env.CZ_SCOPES) {
    scopes = env.CZ_SCOPES.split(',').filter(function(scope) {
      return IS_VALID_SCOPE_REGEX.test(scope);
    });
  }

  var options = {
    scopes: scopes,
    types: config.types || conventionalCommitTypes.types,
    defaultType: env.CZ_TYPE || config.defaultType,
    defaultScope: env.CZ_SCOPE || config.defaultScope,
    defaultSubject: env.CZ_SUBJECT || config.defaultSubject,
    defaultBody: env.CZ_BODY || config.defaultBody,
    defaultIssues: env.CZ_ISSUES || config.defaultIssues,
    disableScopeLowerCase:
      env.DISABLE_SCOPE_LOWERCASE || config.disableScopeLowerCase,
    maxHeaderWidth: maxHeaderWidth,
    maxLineWidth: maxLineWidth
  };

  try {
    var commitlintLoad = require('@commitlint/load');
    return commitlintLoad().then(function(clConfig) {
      if (clConfig.rules) {
        var maxHeaderLengthRule = clConfig.rules['header-max-length'];
        if (
          isValidCommitlintRule(maxHeaderLengthRule) &&
          !env.CZ_MAX_HEADER_WIDTH &&
          !config.maxHeaderWidth
        ) {
          options.maxHeaderWidth = maxHeaderLengthRule[2];
        }

        var scopesEnumRule = clConfig.rules['scope-enum'];
        if (
          isValidCommitlintRule(scopesEnumRule) &&
          Array.isArray(scopesEnumRule[2])
        ) {
          options.scopes = scopes.concat(scopesEnumRule[2]);
        }

        return options;
      }
    });
  } catch (err) {
    return Promise.resolve(options);
  }
}

module.exports = {
  internals: {
    loadOptions: loadOptions
  },

  prompter: function czConventionalChangelogAdapter(inquirer, commit) {
    loadOptions({
      env: process.env,
      config: configLoader.load()
    }).then(options => {
      engine(options, inquirer).prompter(commit);
    });
  }
};
