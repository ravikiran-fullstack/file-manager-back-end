const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.listen(3500);

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

app.post("/fm", async (req, res) => {
  console.log(req.body);
  const address = req.body.address;
  const data = await readDirectory(address);
  res.json({ filesInfo: data, path: __dirname });
})

function readDirectory(address) {
  return new Promise(resolve => {
    const fileNames = fs.readdirSync(address);

    filesObjArr = fileNames.map((file) => {
      let fileObj = {};
      fileObj.name = file;
      
      console.log(file, path.extname(file) === '');
      const statsObj = fs.statSync(path.join(address, file));

      fileObj.extension = statsObj.isFile()? path.extname(file): "directory";
      return fileObj;
    });
    resolve(filesObjArr);
  });
}
