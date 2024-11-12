const { generateBitcoinAddress } = require('./bitcoinAddress')
const crypto = require('crypto');
const { writeOnJsonFile, sleep } = require('./helper');

var counter = 0;
let privateKeyHome = ''
let error_counter = 0
const error_limit = 10
const sleep_time = 20

async function init() {
    while (true) {
        privateKeyHome = ""
        const url = generateURL();
        try {
            const response = await fetch(url)
                .then(res => res.json())
                .catch(err => { })
            if (response) {
                if (Object.values(response).some(item => item.final_balance !== 0 || item.total_received !== 0)) {
                    console.log(privateKeyHome, response)
                    writeOnJsonFile('bitcoin.json', privateKeyHome, response)
                }
                error_counter = 0
            } else {
                if (error_counter < error_limit) error_counter++
                else {
                    console.log(`Fetch error ${error_limit} times. Sleep for ${sleep_time} mins.`, new Date().toISOString())
                    await sleep(60000 * sleep_time)
                    error_counter = 0
                    console.log('Wake up', new Date().toISOString())
                }
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

