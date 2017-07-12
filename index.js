const ZSchema = require('z-schema');
const path = require('path');
const fs = require('fs');
const util = require('util');
const APP_ROOT = require('app-root-path').toString();
const { matcherHint } = require('jest-matcher-utils');

ZSchema.registerFormat('uuid', (string) => {
  const uuidRegExp = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[34][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/;
  return uuidRegExp.test(string);
})

function setSchemaReader (cwd) {
  ZSchema.setSchemaReader(function (uri) {
    const schemaRefPath = path.resolve(cwd, uri);
    const file = JSON.parse(fs.readFileSync(schemaRefPath, 'utf8'));
    return file;
  });
}

module.exports = function (options = {}) {
  const schemaRoot = require('app-root-path').resolve(options.schemaRoot || '');


  return {
    toMatchSchema: (received, expected) => {
      const validator = new ZSchema();
      const schemaPath = path.resolve(schemaRoot, expected);
      const expectedDir = path.dirname(schemaPath);
      setSchemaReader(expectedDir);

      const schema = require(schemaPath);
      const pass = validator.validate(received, schema);

      const message = (pass)
        ? () => matcherHint('.not.toMatchSchema')
        : () => {
          let errors = '';
          validator.getLastErrors().forEach((error) => {
            errors += `${util.inspect(error, false, null)}\n`;
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
