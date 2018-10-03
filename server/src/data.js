const fs = require('fs');
const { promisify } = require('util');

const PATH = `${process.cwd()}/data`;
const FILENAME = `${PATH}/data.txt`;
const existsP = promisify(fs.exists);
const mkdirP = promisify(fs.mkdir);
const appendFileP = promisify(fs.appendFile);
const openP = promisify(fs.open);
const closeP = promisify(fs.close);

async function ensureData() {
    const exists = await existsP(PATH);

    if (!exists) {
        await mkdirP(PATH);
    }

    await openP(FILENAME, 'a').then(closeP);

    return true;
}

async function write(data) {
    return await appendFileP(FILENAME, data);
}

module.exports = {
    ensureData,
    write,
};
