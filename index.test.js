var chai = require('chai');
var proxyquire = require('proxyquire');

var conventionalCommitTypes = require('conventional-commit-types');

var expect = chai.expect;
chai.should();

var defaultConfig = {
  scopes: [],
  types: conventionalCommitTypes.types,
  defaultType: undefined,
  defaultScope: undefined,
  defaultSubject: undefined,
  defaultBody: undefined,
  defaultIssues: undefined,
  disableScopeLowerCase: undefined,
  maxHeaderWidth: 100,
  maxLineWidth: 100
};

var invalidCommitlintConfig = {
  rules: {
    // [ level, applicability, ...options ]
    'header-max-length': []
  }
};

var validCommitlintConfig = {
  rules: {
    // [ level, applicability, ...options ]
    'header-max-length': [0, 'always', 123]
  }
};

var loadOptions;

function setupCommitlintStub(stub) {
  var entrypoint = proxyquire('./index.js', {
    '@commitlint/load': stub
  });

  loadOptions = entrypoint.internals.loadOptions;
}

describe('loading of options', function() {
  describe('when commitlint is not installed', function() {
    before(function() {
      setupCommitlintStub(null);
    });

    it('should correctly use the defaults when not passed any arguments', async function() {
      const options = await loadOptions();
      expect(options).to.deep.equal(defaultConfig);
    });

    it('should correctly use the defaults when not passed an environment', async function() {
      const options = await loadOptions({});
      expect(options).to.deep.equal(defaultConfig);
    });

    describe('maxHeaderWidth option', function() {
      it('should use the CZ_MAX_HEADER_WIDTH environment variable if parseable as an integer', async function() {
        const options = await loadOptions({
          env: {
            CZ_MAX_HEADER_WIDTH: '60'
          }
        });
        expect(options).to.have.property('maxHeaderWidth', 60);
      });

      it('should not use the CZ_MAX_HEADER_WIDTH environment variable if not parseable as an integer', async function() {
        const options = await loadOptions({
          env: {
            CZ_MAX_HEADER_WIDTH: 'not-a-number'
          }
        });

        expect(options).to.have.property('maxHeaderWidth', 100);
      });
    });

    describe('maxLineWidth option', function() {
      it('should use the CZ_MAX_LINE_WIDTH environment variable if parseable as an integer', async function() {
        const options = await loadOptions({
          env: {
            CZ_MAX_LINE_WIDTH: '60'
          }
        });
        expect(options).to.have.property('maxLineWidth', 60);
      });

      it('should not use the CZ_MAX_LINE_WIDTH environment variable if not parseable as an integer', async function() {
        const options = await loadOptions({
          env: {
            CZ_MAX_LINE_WIDTH: 'not-a-number'
          }
        });

        expect(options).to.have.property('maxLineWidth', 100);
      });
    });
  });

  describe('when commitlint is installed', function() {
    before(function() {
      setupCommitlintStub(function() {
        return Promise.resolve(validCommitlintConfig);
      });
    });

    it('should override max-header-width if not otherwise set', async function() {
      const options = await loadOptions();
      expect(options).to.deep.equal({ ...defaultConfig, maxHeaderWidth: 123 });
    });

    it('should not override max-header-width if set by environment', async function() {
      const options = await loadOptions({
        env: {
          CZ_MAX_HEADER_WIDTH: 60
        }
      });
      expect(options).to.deep.equal({ ...defaultConfig, maxHeaderWidth: 60 });
    });

    it('should not override max-header-width if set by commitizen configuration', async function() {
      // by passing config, we're setting commitizen config
      const options = await loadOptions({
        config: {
          maxHeaderWidth: 70
        }
      });
      expect(options).to.deep.equal({ ...defaultConfig, maxHeaderWidth: 70 });
    });

    describe('and the commitlint configuration is invalid', function() {
      before(function() {
        setupCommitlintStub(function() {
          return Promise.resolve(invalidCommitlintConfig);
        });
      });

      it('should not override max-header-width', async function() {
        const options = await loadOptions({});
        expect(options).to.deep.equal({
          ...defaultConfig,
          maxHeaderWidth: 100
        });
      });
    });
  });
});

describe('initialization of prompter', function() {
  // The loadOptions tests above assume that commitizen configuration is passed in,
  // in order to test the loading of commitizen configuration, we would need to mock
  // cosmicconfig and the filesystem.
  //
  // We should be able to assume that `require('commitizen').configLoader.load()`
  // works as expected, though there was previously a test that mocked the
  // commitizen module in order to provide testing, we may not need that due to
  // the clearer separation of concerns now present.
  //
  // For details of the prior test, see: https://github.com/commitizen/cz-conventional-changelog/blob/e7bd5462966d00acb03aca394836b5427513681c/engine.test.js#L391-L406
  it('should correctly load configuration from commitizen');
});
