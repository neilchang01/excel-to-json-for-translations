# Excel to JSON Converter

This script converts data from an Excel file to JSON format. It reads data from specified columns in the Excel file and generates JSON files for different languages.

## Installation

Clone this repository to your local machine:
```bash
git clone <repository_url>
cd excel_to_json
```

Install the required dependencies using npm:
```bash
npm install
```
## Usage

1. Download the translation excel and name it `input.xlsx`
2. Place your input Excel file named input.xlsx in the `./input` directory.
3. Create an `output` directory if it doesn't exist.
4. Run `npm run generate` and it should give you everything you need in `output`

### Generate JSON Files

To generate JSON language files from the Excel data, run the following command:
```bash
npm run generate
```

### You can also generate JSON files for a specific sheet using:
```bash
npm run generate:specific
```

### Clean JSON files
If you need to manually clean the JSON files by removing any `\r\n` line endings, use:
```bash
npm run fix
```

### Remove duplicate keys
To remove duplicate keys from the JSON files, use:
```bash
npm run remove-duplicates
```