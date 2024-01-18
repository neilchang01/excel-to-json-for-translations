const fs = require('fs');
const path = require('path');

function findMissingKeys(fileAPath, fileBPath, outputPath) {
    // Resolve file paths
    const resolvedFileAPath = path.resolve(__dirname, 'old', fileAPath);
    const resolvedFileBPath = path.resolve(__dirname, 'new', fileBPath);
    const resolvedOutputPath = path.resolve(__dirname, outputPath);

    // Read JSON files
    const jsonA = JSON.parse(fs.readFileSync(resolvedFileAPath, 'utf-8'));
    const jsonB = JSON.parse(fs.readFileSync(resolvedFileBPath, 'utf-8'));

    // Find missing keys in B compared to A
    const missingKeys = {};
    for (const key in jsonA) {
        if (!(key in jsonB)) {
            missingKeys[key] = jsonA[key];
        }
    }

    // Write missing keys to output file
    fs.writeFileSync(resolvedOutputPath, JSON.stringify(missingKeys, null, 2), 'utf-8');

    return missingKeys;
}

const oldFilePath = 'translation.json';
const newFilePath = 'en.json';
const outputPath = 'diff.json';

const result = findMissingKeys(oldFilePath, newFilePath, outputPath);
console.log('Missing Keys:', result);
