# cz-conventional-changelog-for-jira

Status:
[![npm version](https://img.shields.io/npm/v/digitalroute/cz-conventional-changelog-for-jira.svg?style=flat-square)](https://www.npmjs.org/package/@digitalroute/cz-conventional-changelog-for-jira)
[![npm downloads](https://img.shields.io/npm/dm/digitalroute/cz-conventional-changelog-for-jira.svg?style=flat-square)](http://npm-stat.com/charts.html?package=@digitalroute/cz-conventional-changelog-for-jira&from=2015-08-01)
[![Build Status](https://img.shields.io/travis/digitalroute/cz-conventional-changelog-for-jira.svg?style=flat-square)](https://travis-ci.org/digitalroute/cz-conventional-changelog-for-jira)

Part of the [commitizen](https://github.com/commitizen/cz-cli) family. Prompts for [conventional changelog](https://github.com/conventional-changelog/conventional-changelog) standard and also prompts for a mandatory JIRA issue.

## Configuration

### package.json

Like commitizen, you specify the configuration of cz-conventional-changelog-for-jira through the package.json's `config.commitizen` key.

```json5
{
// ...  default values
    "config": {
        "commitizen": {
            "path": "./node_modules/@digitalroute/cz-conventional-changelog-for-jira",
            "maxHeaderWidth": 100,
            "maxLineWidth": 100,
            "defaultType": "",
            "defaultScope": "",
            "defaultSubject": "",
            "defaultBody": "",
            "defaultIssues": ""
        }
    }
// ...
}
```

### Environment variables

The following environment varibles can be used to override any default configuration or package.json based configuration.

* CZ_TYPE = defaultType
* CZ_SCOPE = defaultScope
* CZ_SUBJECT = defaultSubject
* CZ_BODY = defaultBody
* CZ_MAX_HEADER_WIDTH = maxHeaderWidth
* CZ_MAX_LINE_WIDTH = maxLineWidth

### Commitlint

If using the [commitlint](https://github.com/conventional-changelog/commitlint) js library, the "maxHeaderWidth" configuration property will default to the configuration of the "header-max-length" rule instead of the hard coded value of 100.  This can be ovewritten by setting the 'maxHeaderWidth' configuration in package.json or the CZ_MAX_HEADER_WIDTH environment variable.
