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

      const modifiedData = data.split('\\r\\n').join('');

      fs.writeFile(filePath, modifiedData, 'utf8', writeErr => {
        if (writeErr) {
          console.error('Error writing file:', writeErr);
          return;
        }
        console.log(`Processed: ${file}`);
      });
    });
  });
});
