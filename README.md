# cz-simple

[![npm version](https://img.shields.io/npm/v/cz-conventional-changelog.svg?style=flat-square)](https://www.npmjs.org/package/cz-simple)
[![npm downloads](https://img.shields.io/npm/dm/cz-conventional-changelog.svg?style=flat-square)](http://npm-stat.com/charts.html?package=cz-simple&from=2015-08-01)
[![Build Status](https://img.shields.io/travis/commitizen/cz-conventional-changelog.svg?style=flat-square)](https://travis-ci.org/commitizen/cz-simple)

Prompts for a very simple standard:

```
[branch_name]: `[type]` subject message
```

becomes

```
BRANCH-123: `feat` Created a super cool new feature
```

## Configuration

There is no configuration, this fork is super opinionated. 🙆

Please submit a PR if you wish to make any changes.

## How to use

1. [Install
   commitizen](https://github.com/commitizen/cz-cli#installing-the-command-line-tool)

2. Install `cz-simple`

```
npm i -g cz-simple
```

3. Tell `commitizen` to use `cz-simple` as its adapter

Either run:

```
npx commitizen init cz-simple --save-dev
```

Or run:

```sh
echo '{ "path": "cz-simple" }' > ~/.czrc
```
