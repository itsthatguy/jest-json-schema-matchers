const ZSchema = require('z-schema');
const path = require('path');
const APP_ROOT = require('app-root-path').toString();
const { matcherHint } = require('jest-matcher-utils');

module.exports = function (options = {}) {
  const schemaRoot = path.resolve(APP_ROOT, options.schemaRoot || '');

  ZSchema.setSchemaReader(function (uri) {
    return require(path.resolve(schemaRoot, uri));
  });

  return {
    toMatchSchema: (received, expected) => {
      const validator = new ZSchema();
      const schema = require(path.resolve(schemaRoot, expected));
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
