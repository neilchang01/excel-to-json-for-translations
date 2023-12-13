const xlsx = require('xlsx');
const fs = require('fs');

async function processExcelFile(excelFilePath, outputDirectory) {
    const workbook = xlsx.readFile(excelFilePath);

    const languages = {
        en: {},
        zh_CN: {},
        zh_TW: {}
    };

    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];

        if (skipSheets.includes(sheetName)) {
            return;
        }
        
        const range = xlsx.utils.decode_range(worksheet['!ref']);
        
        for (let row = range.s.r + 1; row <= range.e.r; row++) {
            const keyCell = xlsx.utils.encode_cell({ r: row, c: keyColumnIndex });
            const enCell = xlsx.utils.encode_cell({ r: row, c: enColumnIndex });
            const zhCnCell = xlsx.utils.encode_cell({ r: row, c: zhCnColumnIndex });
            const zhTwCell = xlsx.utils.encode_cell({ r: row, c: zhTwColumnIndex });

            const key = worksheet[keyCell]?.v;
            const enValue = worksheet[enCell]?.v;
            const zhCnValue = worksheet[zhCnCell]?.v;
            const zhTwValue = worksheet[zhTwCell]?.v;

            if (key !== undefined) {
                languages.en[key] = enValue || '';
                languages.zh_CN[key] = zhCnValue || '';
                languages.zh_TW[key] = zhTwValue || '';
            }
        }
    });

    Object.keys(languages).forEach(lang => {
        const outputJSONFilePath = `${outputDirectory}/${lang}.json`;
        fs.writeFileSync(outputJSONFilePath, JSON.stringify(languages[lang], null, 4));
        console.log(`JSON conversion completed for ${lang}.`);
    });
}

// CONFIGURATION
const excelFilePath = './input/input.xlsx';
const outputDirectory = 'output';
const skipSheets = ['Version Tracking'];
const keyColumnIndex = 3;
const enColumnIndex = 5;
const zhCnColumnIndex = 6;
const zhTwColumnIndex = 7;

processExcelFile(excelFilePath, outputDirectory).catch((error) => {
    console.error('An error occurred:', error);
});
