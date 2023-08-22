const fs = require('fs');
const path = require('path');

const folderPath = './output';

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(folderPath, file);

    fs.readFile(filePath, 'utf8', (readErr, data) => {
      if (readErr) {
        console.error('Error reading file:', readErr);
        return;
      }

      try {
        const jsonData = JSON.parse(data);

        // Remove duplicate keys
        const uniqueData = removeDuplicateKeys(jsonData);

        // Write the modified data back to the file
        fs.writeFile(filePath, JSON.stringify(uniqueData, null, 4), 'utf8', writeErr => {
          if (writeErr) {
            console.error('Error writing file:', writeErr);
            return;
          }
          console.log(`Processed: ${file}`);
        });
      } catch (jsonParseErr) {
        console.error('Error parsing JSON:', jsonParseErr);
      }
    });
  });
});

function removeDuplicateKeys(jsonData) {
  const uniqueData = {};
  const encounteredKeys = new Set();

  for (const key in jsonData) {
    if (!encounteredKeys.has(key)) {
      uniqueData[key] = jsonData[key];
      encounteredKeys.add(key);
    }
  }

  return uniqueData;
}
