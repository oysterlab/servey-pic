const path = require('path')
const json2xls = require('json2xls')
const fs = require('fs')

function readAllSurveyAsJson(startPath){
    const filter = '.json'
    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    const rawJsons = []
    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);

        if (filename.indexOf(filter)>=0) {
          console.log('-- found: ',filename);
          const rawJson = JSON.parse(fs.readFileSync(filename, 'utf8'));

          rawJsons.push(rawJson)
        }
    }

    return rawJsons
};

const rawJsons = readAllSurveyAsJson('./result/raw')
var xls = json2xls(rawJsons);

const date = new Date()
fs.writeFileSync(`result/result_${date.getTime()}.xlsx`, xls, 'binary');
