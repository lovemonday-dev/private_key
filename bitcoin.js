const { generateBitcoinAddress } = require('./bitcoinAddress')
const crypto = require('crypto');
const { writeOnJsonFile } = require('./helper');

var counter = 0;
let privateKeyHome = ''

async function init() {
    while (true) {
        privateKeyHome = ""
        const url = generateURL();
        try {
            const response = await fetch(url)
                .then(res => res.json())
                .catch(err => { })
            if (Object.values(response).some(item => item.final_balance !== 0 || item.total_received !== 0)) {
                console.log(privateKeyHome, response)
                writeOnJsonFile('bitcoin.json', privateKeyHome, response)
            }
        } catch (error) {
            console.log(error)
        }

        counter++;
        if (counter % 100 == 0) console.log(counter, new Date().toISOString())
    }
}
init()

function generateURL() {
    let url = 'https://blockchain.info/balance?active='
    for (let index = 0; index < 20; index++) {
        const privateKey = crypto.randomBytes(32);
        privateKeyHome += `${privateKey.toString('hex')},`
        const address = generateBitcoinAddress(privateKey)
        url += address
    }
    return url
}
