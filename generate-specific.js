const readline = require('readline');
const xlsx = require('xlsx');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getUserInput(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            resolve(answer);
        });
    });
}

function excelToJSON(worksheet, keyColumn, enColumn, zhCnColumn, zhTwColumn) {
    const languages = {
        en: {},
        zh_CN: {},
        zh_TW: {}
    };

    const range = xlsx.utils.decode_range(worksheet['!ref']);
    
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
        const keyCell = xlsx.utils.encode_cell({ r: row, c: keyColumn });
        const enCell = xlsx.utils.encode_cell({ r: row, c: enColumn });
        const zhCnCell = xlsx.utils.encode_cell({ r: row, c: zhCnColumn });
        const zhTwCell = xlsx.utils.encode_cell({ r: row, c: zhTwColumn });

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

    return languages;
}

async function processExcelFile(excelFilePath, outputDirectory) {
    const workbook = xlsx.readFile(excelFilePath);

    const generateAllSheets = await getUserInput('Generate from all sheets? (yes/no): ');

    if (generateAllSheets.toLowerCase() === 'yes') {
        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const languages = excelToJSON(worksheet, keyColumnIndex, enColumnIndex, zhCnColumnIndex, zhTwColumnIndex);

            Object.keys(languages).forEach(lang => {
                const outputJSONFilePath = `${outputDirectory}/${lang}_${sheetName}.json`;
                fs.writeFileSync(outputJSONFilePath, JSON.stringify(languages[lang], null, 4));
                console.log(`JSON conversion completed for ${lang}_${sheetName}.`);
            });
        });
    } else if (generateAllSheets.toLowerCase() === 'no') {
        const sheetName = await getUserInput('Enter the sheet name: ');
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
            console.log(`Sheet "${sheetName}" not found.`);
            return;
        }
        const languages = excelToJSON(worksheet, keyColumnIndex, enColumnIndex, zhCnColumnIndex, zhTwColumnIndex);

        Object.keys(languages).forEach(lang => {
            const outputJSONFilePath = `${outputDirectory}/${lang}_${sheetName}.json`;
            fs.writeFileSync(outputJSONFilePath, JSON.stringify(languages[lang], null, 4));
            console.log(`JSON conversion completed for ${lang}_${sheetName}.`);
        });
    }

    rl.close();
}

// CONFIGURATION
const excelFilePath = './input/input.xlsx';
const outputDirectory = 'output';
const keyColumnIndex = 4;
const enColumnIndex = 5;
const zhCnColumnIndex = 6;
const zhTwColumnIndex = 7;

processExcelFile(excelFilePath, outputDirectory).catch((error) => {
    console.error('An error occurred:', error);
    rl.close();
});
