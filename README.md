# cz-conventional-changelog для kt.team
## Добавляен номер задачи к описанию коммита
```
feat(scope):[001] add new commit example
```
[![Greenkeeper badge](https://badges.greenkeeper.io/commitizen/cz-conventional-changelog.svg)](https://greenkeeper.io/)

Status:
[![npm version](https://img.shields.io/npm/v/cz-conventional-changelog.svg?style=flat-square)](https://www.npmjs.org/package/cz-conventional-changelog)
[![npm downloads](https://img.shields.io/npm/dm/cz-conventional-changelog.svg?style=flat-square)](http://npm-stat.com/charts.html?package=cz-conventional-changelog&from=2015-08-01)
[![Build Status](https://img.shields.io/travis/commitizen/cz-conventional-changelog.svg?style=flat-square)](https://travis-ci.org/commitizen/cz-conventional-changelog)

Part of the [commitizen](https://github.com/commitizen/cz-cli) family. Prompts for [conventional changelog](https://github.com/conventional-changelog/conventional-changelog) standard.

###install and use:
```
$ npm install -g commitizen

$ git clone https://github.com/evgeniizab/cz-conventional-changelog-kt.git

$ npm install -g cz-conventional-changelog-kt

$ echo '{ "path": "cz-conventional-changelog-kt" }' > ~/.czrc
```

```
$ cz
? Select the type of change that you're committing: (Use arrow keys)
❯ feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  refactor: A code change that neither fixes a bug nor adds a feature
  perf:     A code change that improves performance
  test:     Adding missing tests or correcting existing tests
(Move up and down to reveal more choices)
```

## Standart version
[link to official rep.](https://github.com/conventional-changelog/standard-version)

**Lifecycle Scripts**

standard-version supports lifecycle scripts. These allow you to execute your own supplementary commands during the release. The following hooks are available and execute in the order documented:
    prerelease: executed before anything happens. If the prerelease script returns a non-zero exit code, versioning will be aborted, but it has no other effect on the process.

    prebump/postbump: executed before and after the version is bumped. If the prebump script returns a version #, it will be used rather than the version calculated by standard-version.

    prechangelog/postchangelog: executes before and after the CHANGELOG is generated.

    precommit/postcommit: called before and after the commit step.

    pretag/posttag: called before and after the tagging step.
### install and use:
```bash
$ npm i -g standard-version
cd project_dir
$ standard-version
```
