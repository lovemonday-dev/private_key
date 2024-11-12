const ethUtil = require('ethereumjs-util');
const crypto = require('crypto')
const { writeOnJsonFile } = require('./helper')
// Replace this with your private key in hex format (without the "0x" prefix) 
// const privateKey = Buffer.from('0000000000000000000000000000000000000000000000000000000000000002', 'hex');
let privateKeyHome = ""
let counter = 0;
const apikeys = [
    'QUUHRXU5IZ55WZT382MK88B3UJN2Q3ZQDK',
    'ETC2UJAA1R7B3TMCDR6J8D2W79S2W63V2H',
    '72QH66ZTRIJN884QB4SXEZQMPKHY4NJUAN',
    'KPM7HRIZ7UFCTE196JZQ6J6K8KF4BHSBBG',
    '26JCEGCTUPBMUSEMIFKVHG1Z4U29HBV1AD',
    'HHR3G8PD2WKV3NW7IX8VT2HRYM6FVQZJKP',
    'R6PYEPB6YH81IUEXSWF543NCYN1C97MTCK',
    'TJTZRD318NMFPVJFQDCI9QXG14CRR11U34',
    'W2BGB4Q4H8KRHIRGY62E665WF8RYDH8SND',
    'U3QYZUWB4YC5U1DRAAXDUMG4SXKVS2ASUN',
    'PI9PC3NFCA8IT2Y4B5ZC23VEBF6KN6QWWE',
    'FZUGKRRNW659SAAF8ZVZUMIFZ9SJMB355V',
    '6PA53I5AF8D8TDM6S96G3D866GAGPREVQT',
]

function generateURL() {
    let url = `https://api.bscscan.com/api?module=account&action=balancemulti&tag=latest&apikey=${apikeys[counter % apikeys.length]}&address=`
    for (let index = 0; index < 20; index++) {
        const privateKey = crypto.randomBytes(32);
        privateKeyHome += `${privateKey.toString('hex')},`

        // Generate the public key from the private key 
        const publicKey = ethUtil.privateToPublic(privateKey);

        // Generate the address from the public key 
        const address = ethUtil.publicToAddress(publicKey).toString('hex');
        url += `0x${address},`
    }
    // console.log(url)
    return url
}

async function init() {
    while (true) {
        privateKeyHome = ""
        const url = generateURL()
        try {
            const response = await fetch(url).then(res => res.json())
                .catch(err => console.log(err))
            if (response.status == '1') {
                if (response.result.some(item => item.balance * 1 > 1000000)) {
                    console.log(privateKeyHome, response.result)
                    writeOnJsonFile('bsc.json', privateKeyHome, response.result)
                }
            } else console.log(response.result, apikeys[counter % apikeys.length])
        } catch (error) {
            console.log(error)
        }
        counter++
        if (counter % 100 == 0) console.log(counter, new Date().toISOString())

    }
}
init()

