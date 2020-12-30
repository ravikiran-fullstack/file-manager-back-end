const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer( async (req, res) => {
  const url = req.url;
  const method = req.method;
  
  if (url === '/fm' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.appendFileSync('message.txt', message);        
    });
   
   const data = await readDirectory();
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader('Content-Type', 'application/json');
   
   return res.end(JSON.stringify({filesInfo: data, path: __dirname}));
  }
});

server.listen(3000);

function readDirectory() {
  return new Promise(resolve => {
    const fileNames = fs.readdirSync(__dirname);

    filesObjArr = fileNames.map((file) => {
      let fileObj = {};
      fileObj.name = file;
      
      const statsObj = fs.statSync(file);

      fileObj.extension = statsObj.isFile()? path.extname(file): "directory";
      return fileObj;
    });
    resolve(filesObjArr);
  });
}
