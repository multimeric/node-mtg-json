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
 * @param directory The location to put the new json file (the filename is decided by the request)
 * @param opts An object with the keys {extras : bool, zip : bool, returnFile: bool}
 */
function getMtgJson(type, directory, opts) {

    //Setup input and output URIs
    const outFileName = getJsonFilename(type, opts);
    const url = `${BASE_URL}/${outFileName}`;
    const output = path.resolve(`${directory}/${outFileName}`);
    const outputStream = fs.createWriteStream(output);
    //Return a file path if they requested it, or it's a zip file
    const returnFile = !!(opts && (opts.returnFile || opts.zip));

    //Return the json if it already exists
    try {
        //If it's a ZIP, it can't be json, throw an error to ensure we don't try require
        if (opts && opts.zip)
            throw new Error();

        const json = require(output);
        return returnFile ? Promise.resolve(output) : Promise.resolve(json);
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
                    return returnFile ? Promise.resolve(output) : require(output);
                }
                catch (ex) {
                    throw new Error(`Invalid json: ${ex.message}`);
                }
            });
    }
}

function getJsonFilename(type, opts) {
    if (!type in fileNameLookup)
        throw new Error('Invalid type parameter recieved! Must be either "sets" or "cards". See the readme for details.');

    let fileName = [
        fileNameLookup[type]
    ];

    if (opts && opts.extras)
        fileName.push('-x');

    fileName.push('.json');

    if (opts && opts.zip)
        fileName.push('.zip');

    return fileName.join('');
}

module.exports = getMtgJson;
