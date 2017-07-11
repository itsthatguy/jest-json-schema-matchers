const matchers = require('../index');

describe('jest-json-schema-matchers', () => {
  it('matches json schema and resolves references', () => {
    expect.extend(matchers({
      schemaRoot: '__tests__/schemas/',
    }));

    const data = require('./data/data.json');

    expect(data).toMatchSchema('base.json');
  });
})
