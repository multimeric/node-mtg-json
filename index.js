'use strict';

//Requires
const Promise = require('bluebird');
const request = Promise.promisifyAll(require('request'));
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
var eventToPromise = require('event-to-promise');

//Constants
const BASE_URL = "http://mtgjson.com/json";
const fileNameLookup = {
    'sets': 'AllSets',
    'cards': 'AllCards'
};

/**
 * Returns a promise of an MtG Json file
 * @param type Either 'sets' or 'cards' - the type of file to download.
 * @param filename The location to put the new json file (including .json suffix)
 * @param opts An object with the keys {extras : bool, zip : bool}
 */
function getMtgJson(type, filename, opts) {
    //Setup input and output URIs
    const url = getJsonUrl(type, opts);
    const output = path.resolve(filename);
    const outputStream = fs.createWriteStream(output);

    //Return the json if it already exists
    try {
        const json = require(output);
        return Promise.resolve(json);
    }
    catch (ex) {
        //Pipe the downloaded file into the output file
        request(url)
            .pipe(outputStream);

        //Return a promise that's resolved when the file has downloaded
        return eventToPromise(outputStream, 'close')
            .then(()=> {
                //Return the new json file, parsed
                try {
                    return require(output);
                }
                catch(ex){
                    throw new Error(`Invalid json: ${ex.message}`);
                }
            });
    }
}

function getJsonUrl(type, opts) {
    let fileName = [
        BASE_URL,
        fileNameLookup[type]
    ];

    if (opts && opts.extras)
        fileName.push('-x');

    let suffix = ['.json'];

    if (opts && opts.zip)
        suffix.push('.zip');

    return fileName.join('/') + suffix.join('');
}

module.exports = getMtgJson;
