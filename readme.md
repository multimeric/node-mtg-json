# MtG JSON

## Introduction

This module is designed for interacting with the [MtG JSON website](http://mtgjson.com/), a site providing
a series of JSON files that act as a database for Magic the Gathering Cards.

You might be interested in this module if you're making any kind of Node app involved with Magic the Gathering,
for example a database, simulator, etc.

## Compatibility

This module uses some recent Node features, so requires Node version 12.0 and greater. If you have an older version of
Node, you may be able to use the `1.x` versions of this module, which are compatible with Node 4.0+

## Usage

### Quickstart

- First install the module:
  `npm install mtg-json --save`

- Then import the module and call it:

  ```javascript
  import { getMtgJson } from "mtg-json";

  // Request AllCards.json and store it in the current directory
  const json = await getMtgJson({ type: "AtomicCards", dir: __dirname });
  let stormCrow = json.data["Storm Crow"][0];
  console.log(stormCrow.type);
  ```

  Will return:

  ```
  Creature — Bird
  ```

  Note, this particular example will only work in Node 14+, using `--harmony-top-level-await`, but if you're not using
  it in a top-level function, you can use Node 12+

### API

The module consists of one function with the following signature: `getMtgJson({type, dir, version})`

- `type` (string): Required. The name of the MTGJSON file, e.g. "AllPrintings". See the [MtG JSON website](http://mtgjson.com/) for details.
- `dir` (string): Required. The directory in which to place or look for the JSON file. This may often be `.`, the current directory constant, but you must set this yourself, `__dirname` is not the default.
- `version` (string): Optional. The MTGJSON API version to query. Defaults to `v5`.

## Tests

- Install the dev dependencies using `npm install`
- Run `npm test` to run the tests. Note that these can take a while (about a minute) because they actually involve downloading the large JSON files from the website a number of times.
