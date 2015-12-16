"use strict";

const assert = require('assert');
const getMtgJson = require('./index');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const AdmZip = require('adm-zip');

describe('get cards', ()=> {

    let deletePath;

    //The JSON requests are done first so they're deleted later. Don't change the order!

    it('should work with Storm Crow', function (done) {
        this.timeout(0);

        //Request AllCards.json and store it in the current directory
        getMtgJson('cards', __dirname)

        //Use the json data
            .then(json => {
                let stormCrow = json['Storm Crow'];
                assert(stormCrow.types[0] == 'Creature');
                done();
            });
    });

    it('should return json by default', function (done) {
        this.timeout(0);

        //Request the file
        getMtgJson('cards', __dirname, {returnFile: false})
        //Test the file
            .then(json => {
                assert(typeof json == 'object');
                done();
            })
            .catch(ex => {
                done(ex);
            });
    });

    it('should download a correct AllCards.json', function (done) {
        this.timeout(0);

        //Request the file
        getMtgJson('cards', __dirname, {returnFile: true})
        //Test the file
            .then(filename => {
                deletePath = filename;
                const json = require(filename);
                if ('Abandon Hope' in json)
                    done();
                else done(new Error("Incorrect json file produced"));
            })
            .catch(ex => {
                done(ex);
            });
    });

    it('should download a correct AllSets.json', function (done) {
        this.timeout(0);

        //Request the file
        getMtgJson('sets', __dirname, {returnFile: true})
        //Test the file
            .then(filename => {
                deletePath = filename;
                const json = require(filename);
                if ('LEA' in json)
                    done();
                else done(new Error("Incorrect json file produced"));
            })
            .catch(ex => {
                done(ex);
            });
    });

    it('should download a correct AllCards-x.json', function (done) {
        this.timeout(0);

        //Request the file
        getMtgJson('cards', __dirname, {returnFile: true, extras: true})
        //Test the file
            .then(filename => {
                deletePath = filename;
                const json = require(filename);
                if ('Animate Dead' in json && 'rulings' in json['Animate Dead'])
                    done();
                else throw new Error("Incorrect json file produced");
            })
            .catch(ex => {
                done(ex);
            });
    });

    it('should download a correct AllSets.json.zip', function (done) {
        this.timeout(0);

        //Request the file
        getMtgJson('sets', __dirname, {returnFile: true, zip: true})
        //Test the file
            .then(filename => {
                deletePath = filename;
                var zip = new AdmZip(filename);
                assert(zip.getEntries().length > 0);
            })
            .then(()=> {
                done();
            })
            .catch(ex => {
                done(ex);
            });
    });

    afterEach(done => {
        if (typeof deletePath == 'string' && deletePath.length > 0)
            fs.unlink(deletePath, err => {
                done(err);
            });
        else
            done();
    });
});

