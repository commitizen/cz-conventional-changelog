'format cjs';

var engine = require('./engine');
var conventionalCommitTypes = require('conventional-commit-types');
var configLoader = require('commitizen').configLoader;

var config = configLoader.load();

module.exports = engine({
  types: conventionalCommitTypes.types,
  defaultType: process.env.CZ_TYPE || config.defaultType,
  defaultScope: process.env.CZ_SCOPE || config.defaultScope,
  defaultSubject: process.env.CZ_SUBJECT || config.defaultSubject,
  defaultBody: process.env.CZ_BODY || config.defaultBody,
  defaultIssues: process.env.CZ_ISSUES || config.defaultIssues,
  maxHeaderWidth: process.env.CZ_MAX_LINE_WIDTH || config.maxHeaderWidth || 100,
  maxLineWidth: process.env.CZ_MAX_BODY_WIDTH || config.maxLineWidth || 100
});
