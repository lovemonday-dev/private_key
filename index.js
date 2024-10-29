const { generateBitcoinAddress } = require('./bitcoinAddress')
const crypto = require('crypto');
const fs = require('fs');

var counter = 0;
async function init() {
    while (true) {
        const privateKey = crypto.randomBytes(32);
        const address = generateURL(privateKey);
        const response = await fetch(address)
            .then(res => res.json())
        if (Object.values(response).some(item => item.final_balance !== 0))
            fs.readFile('output.json', 'utf8', (err, data) => {
                if (err) {
                    console.error("Error reading file:", err);
                    return;
                }

                // Parse the existing JSON data
                let existingData = {};
                try {
                    existingData = JSON.parse(data);
                } catch (parseErr) {
                    console.error("Error parsing JSON:", parseErr);
                    return;
                }

                // Add new data to the existing data
                const updatedData = { ...existingData, [privateKey.toString('hex')]: response };

                // Convert the updated data back to JSON format
                const jsonData = JSON.stringify(updatedData, null, 2);

                // Write the updated JSON back to the file
                fs.writeFile('output.json', jsonData, (writeErr) => {
                    if (writeErr) {
                        console.error("Error writing to file:", writeErr);
                    } else {
                        console.log("New JSON data has been added.");
                    }
                });
            });
        counter++;
        if (counter % 100 == 0) console.log(counter, new Date().toISOString())
    }
}
init()

function generateURL(privateKey) {
    const bitcoinAddress = generateBitcoinAddress(privateKey)
    function generateEthereumAddress() {
        return 'ethereum'
    }
    return `https://blockchain.info/balance?active=${bitcoinAddress}`
    return `https://blockchain.info/balance?active=${bitcoinAddress}|${generateEthereumAddress()}`
}
