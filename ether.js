const ethUtil = require('ethereumjs-util');
const crypto = require('crypto')
const { writeOnJsonFile } = require('./helper')
// Replace this with your private key in hex format (without the "0x" prefix) 
// const privateKey = Buffer.from('0000000000000000000000000000000000000000000000000000000000000002', 'hex');
let privateKeyHome = ""
let counter = 0;
const apikeys = [
    '12RU83G1ATVA9V4EMM3U45X8BG4RG9PM6T',
    'DZHWCIEA2WW86CZEC88IGWG1JFB6JN3VHS',
    'TDMPDZU8RD4V9FVB66P5S47QETEJ6R61UY',
    'PYM9U2QD949KZZX23QJ4YZRX3KC3PHAI88',
    'YIDAXPUWHJB21RJVMS1JMXHABMEF67RQWG',
    'EX8K12JY7BCVG8RAUU8X2Z6QT2GCF5EYB4',
    'S9FH9EJC1CI2XMWZGC3Y1GCAH9D1VWP3XC',
    '6X8R6XUA5B3AMRAVFNXI7QKX8VJTE9NZCA',
    'W9IJGXZ96NZUHX6N9FCDM5PKBJD6WV1ZG8',
    '49WPEUX68RKJWTMIUP58T6ZXCKB9BT5BPA',
    'NDKWAZZ3PUCU3SBN4SEVXGDNIQNQRVP15S',
    'DYKXN8MYU4J9IRMGJPTV8VKYDXJX7YFI4R',
    'X6SFK6RS3P43YF5R72B6HCCUMGYW3WQRJE',
    'HK1U4B5VX7KGDI3WNFRFU6877NCAU2HWXZ',
    '64VSZBGFVZVIAFRT9PHWN1VQJCZ7MUH2MB',
    'J62T1EQMUG8J787RV3U9A1QU12BXW7MZYF',
    'RPDSTI6KBB2VTD17CQGDHRYJSS79Q4Q3XD',
    'WRU7TTGNCGDJ7AWFJTYV75S9F1K7X8SBNT',
    'XCBVHWWE9BZYK9C2MQ2EF5TD8W3ZAVD7DU',
    'HQQETAQGJDWFY7WSWW9UZA7QAT4EMRPPI7',
    'V79T6T3X23R59Q2YGD1IISDVJBR4M5PJRF',
    'VCN21SJ4YM7EJDGHBUHRGUF5DT52YIA3FD',
    'WDZSKUSTWCCRHCRZ9BRMPBYDDX8GHT3IAP',
    'CIKIS329G9YT1E9767X8WH4F6YY1BYZWCN',
    'P8P721W4I8IHUMZSPNKJHJ57VWAQY1CX6Q',
    '52VFJXRSN9M67RCKYEXR8KVQJQM1UNXQ1G',
    'RDW9RZC79Y8B7TAKNMYKW6G6P1CBDM2HBQ',
    'J1IC7BIQ6U49314XNBKYABYDPW73FS7XQN',
    'PR77B5SPMGMHK3ZMQC4ANDTUHGYP9W9QSY',
    '53IA53ST7XE2V8SQIIGAESAQSP43JCPP9Y',
    '5CYV3WIT9Z3JE33V6A7317XY5ZMD4QIZEI',
    'SN33AB5X8PZEV8FXXAP26KR4YBQRTH511D',
    '3E6XK19KMQV4JX11ZD6NRHN2YAAHT4KV46',
    '478BXZPVB4AYPPN38PNR3MSRGIEP63XVRQ',
    'I9NUXRIR5KQBN8E92DU87VGVDEBUJ2NUJX',
    'YSDT1DZ9IUFMHNM9YZ235RVGGA2F3VDIGN',
]

function generateURL() {
    let url = `https://api.etherscan.io/api?module=account&action=balancemulti&tag=latest&apikey=${apikeys[counter % apikeys.length]}&address=`
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
                    writeOnJsonFile('ether.json', privateKeyHome, response.result)
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

