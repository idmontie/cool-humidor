const rp = require('request-promise-native');

let wasWatered = false;
let wasDry = false;

async function push(message, accessToken) {
    const url = 'https://api.pushbullet.com/v2/pushes';
    const body = {
        body: message,
        title: 'Cool Humidor Update',
        type: 'note',
    };

    return await rp({
        json: true,
        uri: url,
        method: 'POST',
        headers: {
            'Access-Token': accessToken,
        },
        body,
    });
}

async function test(humidity, humidityThreshold, accessTokens) {
    var nowDry = humidity < humidityThreshold;

    if (wasDry && !nowDry) {
        wasWatered = true;
        accessTokens.forEach(async(accessToken) => {
            await push("You just watered the plants 💦🌱", accessToken);
        });
    } else if (wasWatered && nowDry) {
        wasWatered = false;
        accessTokens.forEach(async(accessToken) => {
            await push("Please water me 🌵", accessToken);
        });
    }

    wasDry = nowDry;
}

module.exports = {
    test,
};
