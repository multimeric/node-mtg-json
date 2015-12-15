const assert = require('assert');
const getMtgJson = require('./index');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const OUTPUT = 'test.json';

describe('get cards', ()=> {
    //Gets the card file and test that Abandon Hope is in it
    function runTest(done){
        //Request the file
        getMtgJson('cards', OUTPUT)
            //Test the file
            .then(json => {
                if ('Abandon Hope' in json)
                    done();
                else done(new Error("Incorrect json file produced"));
            })
            .catch(ex => {
                done(ex);
            })
    }

    after(done => {
        fs.unlink(OUTPUT, err => {
           done(err);
        });
    });

    it("should work", function (done) {
        //This could take ages, it's a huge file
        this.timeout(0);

        runTest(done);
    });

    it("should re-use an existing file", function (done) {
        //This should be short - the file exists and should be cached
        this.timeout(10);

        runTest(done);
    });

    //it("should with extras", function (done) {
    //    //This could take ages, it's a huge file
    //    this.timeout(0);
    //
    //    runTest(done);
    //});
});

describe('get sets', ()=> {
    //Gets the card file and test that Limited Edition Alpha is in it
    function runTest(done){
        //Request the file
        getMtgJson('sets', OUTPUT)
        //Test the file
            .then(json => {
                if ('LEA' in json)
                    done();
                else done(new Error("Incorrect json file produced"));
            })
            .catch(ex => {
                done(ex);
            })
    }

    after(done => {
        fs.unlink(OUTPUT, err => {
            done(err);
        });
    });

    it("should work", function (done) {
        //This could take ages, it's a huge file
        this.timeout(0);

        runTest(done);
    });

    it("should re-use an existing file", function (done) {
        //This should be short - the file exists and should be cached
        this.timeout(10);

        runTest(done);
    });
});
