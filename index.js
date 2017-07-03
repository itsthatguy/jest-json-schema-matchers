const ZSchema = require('z-schema');
const path = require('path');
const pkgDir = require('pkg-dir');
const { matcherHint } = require('jest-matcher-utils');

const APP_ROOT = pkgDir.sync(__dirname);

module.exports = function (options = {}) {
  const refDir = path.resolve(APP_ROOT, options.refDir || '');
  const schemaDir = path.resolve(APP_ROOT, options.schemaDir || '');

  ZSchema.setSchemaReader(function (uri) {
    return require(path.resolve(refDir, uri));
  });

  return {
    toMatchSchema: (received, expected) => {
      const validator = new ZSchema();
      const schema = require(path.resolve(schemaDir, expected));
      const pass = validator.validate(received, schema);

      const message = (pass)
        ? () => matcherHint('.not.toMatchSchema')
        : () => {
          let errors = '';
          validator.getLastErrors().forEach((error) => {
            errors += `${error.message}\n`;
          });

          return `${matcherHint('.toMatchSchema')}\n\n${errors}`;
        };

      return {
        actual: received,
        message: message,
        name: 'toMatchSchema',
        pass: pass,
      };
    },
  }
}
