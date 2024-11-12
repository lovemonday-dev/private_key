const fetch = require('node-fetch');

async function getBalances(addresses) {
    const response = await fetch('https://api.helius.xyz/v0/addresses/balances', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer CckxW6C1CjsxYcXSiDbk7NYfPLhfqAm3kSB5LEZunnSE`
        },
        body: JSON.stringify({ addresses })
    });
    const balances = await response.json();
    return balances;
}

const addresses = ['6ASf5EcmmEHTgDJ4X4ZT5vT6iHVJBXPg5AN5YoTCpGWt', '8pM1DN3RiT8vbom5u1sNryaNT1nyL8CTTW3b5PwWXRBH', 'HPYVwAQmskwT1qEEeRzhoomyfyupJGASQQtCXSNG8XS2'];
getBalances(addresses).then(console.log);
