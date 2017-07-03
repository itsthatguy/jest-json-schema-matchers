# jest-json-schema-matchers


### Example usage

```
# __tests__/data/data.json

{
  "base": {
    "referenced": {
      "name": "Referenced data schema"
    }
  }
}


# __tests__/schemas/base.json

{
  "type": "object",
  "required": ["base"],

  "properties": {
    "base": {
      "type": "object",
      "required": ["referenced"],

      "properties": {
        "referenced": {
          "$ref": "descriptions/referenced.json"
        }
      }
    }
  }
}

# __tests__/schemas/descriptions/referenced.json

{
  "type": "object",
  "required": ["name"],

  "properties": {
    "name": {
      "type": "string"
    }
  }
}

# __tests__/index.spec.js

const matchers = require('jest-json-schema-matchers');
expect.extend(matchers({
  schemaDir: '__tests__/schemas/',
  refDir: '__tests__/schemas/'
}));

describe('jest-json-schema-matchers', () => {
  it('matches json schema and resolves references', () => {
    const data = require('./data/data.json');

    expect(data).toMatchSchema('base.json');
  });
})
```
