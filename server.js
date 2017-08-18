const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const resultDir = './result';
const rawDir = path.resolve(resultDir, './raw')

if (!fs.existsSync(resultDir)){
    fs.mkdirSync(resultDir);
}

if(!fs.existsSync(rawDir)) {
  fs.mkdirSync(rawDir)
}

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index.html')
})

app.post('/receive-survey', (req, res) => {
  const { survey } = req.body
  const date = new Date()
  survey.date = date.getTime()
  survey.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

  const rawFilePath = path.resolve(rawDir, `${date.getTime()}.json`)
  const surveyStr = JSON.stringify(survey)
  fs.writeFile(rawFilePath, surveyStr, 'utf8', () => {
    console.log(`writed to ${rawFilePath}`)
  })
})

const server = app.listen(3000, '0.0.0.0');
