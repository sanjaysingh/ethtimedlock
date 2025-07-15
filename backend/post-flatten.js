const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'verification', 'TimedLockerV5_flattened.sol');

try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const startIndex = content.indexOf('// SPDX-License-Identifier: MIT');

    if (startIndex !== -1) {
        content = content.substring(startIndex);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Flattened file cleaned successfully.');
    } else {
        console.error('Could not find the start of the Solidity code in the flattened file. Cleaning aborted.');
        process.exit(1);
    }
} catch (error) {
    console.error(`An error occurred: ${error.message}`);
    process.exit(1);
} 