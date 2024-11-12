const fs = require('fs');
function writeOnJsonFile(filename, privateKeyHome, response) {
    fs.readFile(filename, 'utf8', (err, data) => {
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
        const updatedData = { ...existingData, [privateKeyHome]: response };

        // Convert the updated data back to JSON format
        const jsonData = JSON.stringify(updatedData, null, 2);

        // Write the updated JSON back to the file
        fs.writeFile(filename, jsonData, (writeErr) => {
            if (writeErr) {
                console.error("Error writing to file:", writeErr);
            } else {
                console.log(privateKeyHome, response);
            }
        });
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
    writeOnJsonFile,
    sleep
}