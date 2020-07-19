'use strict';

import assert from 'assert';
import os from 'os';
import {promises as fs} from 'fs';
import getMtgJson from './index.mjs';
import { sep } from 'path';


describe('get cards', function(){
    // Disable timeouts, since each test has to download the JSON files
    this.timeout(0);

    // Create a new temp. directory for each test
    let tempdir;
    beforeEach(async () => {
        tempdir = await fs.mkdtemp(os.tmpdir() + sep);
    });
    afterEach(async () => {
        await fs.rmdir(tempdir, {recursive: true});
    });

    it('should return AtomicCards', async () => {
        // Request AllCards.json and store it in the current directory
        // Do it twice, to test the caching
        for (let i of [0, 1]) {
            const json = await getMtgJson({type: 'AtomicCards', dir: tempdir});
            let stormCrow = json.data['Storm Crow'][0];
            assert(stormCrow.types[0] === 'Creature');
        }
    });
    
    it('should return AllPrintings', async () => {
        // Request AllCards.json and store it in the current directory
        // Do it twice, to test the caching
        for (let i of [0, 1]) {
            const json = await getMtgJson({type: 'AllPrintings', dir: tempdir});
            let firstIko = json.data['IKO'].cards[0];
            assert(firstIko.name === 'Adaptive Shimmerer');
        }
    });
});

