const fs = require("fs");

function generateEnumFile() {
    const enFilePath = "./output/en.json";
    const enFileExists = fs.existsSync(enFilePath);

    if (!enFileExists) {
        throw new Error("File doesn't exist");
    }

    const enFile = fs.readFileSync(enFilePath, "utf8");
    const enFileJSON = JSON.parse(enFile);

    const keys = Object.keys(enFileJSON);
    const keysWithUnderscores = keys.map((key) =>
        key.replace(
            /(\s|-|\.|,|&|\/|\(\)|\(|\)|\[|\]|}|{)/g,
            "_"
        )
    );
    const enumFileContent = `export enum TranslationKeys {
    ${keys
        .map(
            (key, index) => {
                if (keysWithUnderscores[index] === "") {
                    // Skip this key
                    return `OBSOLETE = ''`
                }
                return `${keysWithUnderscores[index].toUpperCase()} = '${key}'`
            }
        )
        .join(",\n    ")}
}`;

    fs.writeFileSync("./output/translation-keys.ts", enumFileContent);
}

generateEnumFile();
