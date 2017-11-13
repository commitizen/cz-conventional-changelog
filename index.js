"format cjs";

var engine = require('./engine');
var conventionalCommitTypes = require('conventional-commit-types');

var findConfig = require('find-config');
var get = require('lodash.get');

var maxLineWidths = get(
  findConfig.require('package.json', { home: false }),
  'config.cz-conventional-changelog.maxLineWidths',
  { head: 100, body: 100 });

module.exports = engine({
  types: conventionalCommitTypes.types,
  maxLineWidths: maxLineWidths
});
