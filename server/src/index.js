const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const yaml = require('js-yaml');

const { ensureData, write } = require('./data');
const { test } = require('./tracker');

const app = express();
const PORT = '8080' || process.env.PORT;

async function writeData({ temp, humidity }, options) {
    console.log('*-*-*-*-*');
    console.log(`Temp: ${temp}, Humidity: ${humidity}`);

    const timestamp = +new Date();

    if (process.env.DEBUG) {
        await write(`${timestamp}|${temp}|${humidity}\n`);
    }

    await test(humidity, options.humidityThreshold, options.accessTokens);
}

async function startServer() {
    await ensureData();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // TODO add middleware to only allow our network
    app.post('/thermo/actions/push', async (req, res) => {
        const { temp, humidity } = req.body;

        try {
            const doc = yaml.safeLoad(fs.readFileSync('.env.yml', 'utf8'));
            await writeData({ temp, humidity }, doc);
            res.status(200).send('OK');
        } catch (e) {
            console.error(e);
            res.status(500).send(e.message);
        }

    });

    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}

startServer();
