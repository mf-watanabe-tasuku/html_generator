const csv = require('csvtojson');
const fs = require('fs');

const importPath = 'src/import.csv';
const baseCodePath = 'src/base.txt';

(async function() {
  try {
    // 置換対象のコードを読み込み
    const baseCode = fs.readFileSync(baseCodePath, 'utf8');

    // データをまとめたCSVを読み込んでArray<object>に変換
    const jsonList = await csv().fromFile(importPath);

    jsonList.map((row, i) => {
      let newCode = baseCode;

      // base.txt内の{{[objectプロパティ]}}部分を、objectの値で置換
      Object.keys(row).map(key => {
        const replaceRegex = new RegExp(`{{${key}}}`, 'g');
        newCode = newCode.replace(replaceRegex, row[key]);
      });

      // 置換後のコードをファイルに書き出し
      fs.writeFileSync(`export/code_${++i}.txt`, newCode);
    });

    console.log('Export done!');
  } catch(error) {
    console.log(error);
  }
})();
