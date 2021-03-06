# jest-json-schema-matchers [![CircleCI](https://circleci.com/gh/itsthatguy/jest-json-schema-matchers/tree/master.svg?style=svg)](https://circleci.com/gh/itsthatguy/jest-json-schema-matchers/tree/master)[![npm version](https://badge.fury.io/js/jest-json-schema-matchers.svg)](https://badge.fury.io/js/jest-json-schema-matchers)

### Install

```
npm install jest-json-schema-matchers
```


### Example usage

```javascript
// __tests__/data/data.json

{
  "base": {
    "referenced": {
      "name": "Referenced data schema"
    }
  }
}


// __tests__/schemas/base.json

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

// __tests__/schemas/descriptions/referenced.json

{
  "type": "object",
  "required": ["name"],

  "properties": {
    "name": {
      "type": "string"
    }
  }
}

// __tests__/index.spec.js

const matchers = require('jest-json-schema-matchers');
expect.extend(matchers({
  schemaRoot: '__tests__/schemas/',
}));

describe('jest-json-schema-matchers', () => {
  it('matches json schema and resolves references', () => {
    const data = require('./data/data.json');

    expect(data).toMatchSchema('base.json');
  });
})
```
