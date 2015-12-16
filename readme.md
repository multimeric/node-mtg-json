# MtG JSON

## Introduction

This module is designed for interacting with the [MtG JSON website](http://mtgjson.com/), a site providing
 a series of JSON files that act as a database for Magic the Gathering Cards.

 You might be interested in this module if you're making any kind of node app involved with Magic the Gathering,
 for example a database, simulator, etc.

 The scope of this module can include anything to do with the website, and currently is able to download and
 read all 8 files stored in the website.

## Compatibility

This module uses some features from ES6, so requires node version 4.0 and greater.

## Usage

### Quickstart

* First install the module:
   `npm install mtg-json --save`

* Then require the module and call it:
    ```javascript
        //Require the module
        const getMtgJson = require('mtg-json');

        //Request AllCards.json and store it in the current directory
        getMtgJson('cards', __dirname)

        //Use the json data
          .then(json => {
              let stormCrow = json['stormCrow'];
              console.log(stormCrow.types) // Logs ['Creature']
          });
    ```

### API

The module consists of one function with the following signature: `getMtgJson(type, directory, opts)`

* `type` (string): Required. Either `'cards'` or `'sets'`, to determine if you want a file organized by card or by set. See the [MtG JSON website](http://mtgjson.com/) for details.

* `directory` (string): Required. The directory in which to place or look for the JSON file. This may often be `__dirname`, the current directory constant, but you must set this yourself, `__dirname` is not the default.

* `opts` (object): Options. An object with three optional keys:
	* 	`extras` (boolean): True if you want the file to include extras (rulings, printings, foreign language names etc.). Again, see the MtG JSON website for details.
	* 	`zip` (boolean): True if you want the file to be downloaded as a zip file. If this is true, the promise return value will be a filepath, and not JSON.
	* 	`returnFile` (boolean): True if you want the promise to resolve with the json filename, rather than the JSON data itself. True by default if `zip` is true.

## Tests
The module is quite comprehensively tested. Simply run `npm test` or `mocha test.js` twith Mocha globally installed to run the tests. Note that these can take a while (about a minute) because they actually involve downloading the large JSON files from the website a number of times.