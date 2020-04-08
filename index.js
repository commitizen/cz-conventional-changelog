'format cjs';

var engine = require('./engine');
var conventionalCommitTypes = require('conventional-commit-types');
var configLoader = require('commitizen').configLoader;

var config = configLoader.load() || {};
var options = {
  types: config.types || conventionalCommitTypes.types,
  defaultType: process.env.CZ_TYPE || config.defaultType,
  defaultScope: process.env.CZ_SCOPE || config.defaultScope,
  defaultSubject: process.env.CZ_SUBJECT || config.defaultSubject,
  defaultBody: process.env.CZ_BODY || config.defaultBody,
  defaultIssues: process.env.CZ_ISSUES || config.defaultIssues,
  disableScopeLowerCase:
    process.env.DISABLE_SCOPE_LOWERCASE || config.disableScopeLowerCase,
  disableSubjectLowerCase:
    process.env.DISABLE_SUBJECT_LOWERCASE || config.disableSubjectLowerCase,
  maxHeaderWidth:
    (process.env.CZ_MAX_HEADER_WIDTH &&
      parseInt(process.env.CZ_MAX_HEADER_WIDTH)) ||
    config.maxHeaderWidth ||
    100,
  maxLineWidth:
    (process.env.CZ_MAX_LINE_WIDTH &&
      parseInt(process.env.CZ_MAX_LINE_WIDTH)) ||
    config.maxLineWidth ||
    100,
  allowedScopes:
    (process.env.CZ_ALLOWED_SCOPES && process.env.CZ_ALLOWED_SCOPES.split(',')) ||
    config.allowedScopes ||
    []
};

(function(options) {
  try {
    var commitlintLoad = require('@commitlint/load');
    commitlintLoad().then(function(clConfig) {
      if (clConfig.rules) {
        var maxHeaderLengthRule = clConfig.rules['header-max-length'];
        var scopeEnumRule = clConfig.rules['scope-enum'];

        if (
          typeof maxHeaderLengthRule === 'object' &&
          maxHeaderLengthRule.length >= 3 &&
          !process.env.CZ_MAX_HEADER_WIDTH &&
          !config.maxHeaderWidth
        ) {
          options.maxHeaderWidth = maxHeaderLengthRule[2];
        }

        if (
          typeof scopeEnumRule === 'object' &&
          scopeEnumRule.length >= 3 &&
          !process.env.CZ_ALLOWED_SCOPES &&
          !(config.allowedScopes && config.allowedScopes.length)
        ) {
          options.allowedScopes = scopeEnumRule[2];
        }
      }
    });
  } catch (err) {}
})(options);

module.exports = engine(options);
