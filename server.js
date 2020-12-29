const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer( async (req, res) => {
  const url = req.url;
  const method = req.method;
  
  if (url === '/fm' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.appendFileSync('message.txt', message);        
    });
   
   const data = await readDirectory();
   console.log(data);
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
      fileObj.extension =
        path.extname(file) === "" ? "directory" : path.extname(file);
      return fileObj;
    });
    resolve(filesObjArr);
  });
}
