const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer( async (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter Message</title><head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
    res.write('</html>');
    return res.end();
  }
  if (url === '/message' && method === 'POST') {
    const body = [];
    let filesObjArr = [];
    req.on('data', (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.appendFileSync('message.txt', message);        
    });
   // res.statusCode = 302;
   // res.setHeader('Location', '/');
   const data = await readDirectory();
   console.log(req.url);
   console.log(data);
   res.setHeader('Content-Type', 'application/json');
   return res.end(JSON.stringify(data));
  }
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title><head>');
  res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
  res.write('</html>');
  res.end();
});

server.listen(3000);

function readDirectory() {
  return new Promise(resolve => {
      // setTimeout(() => {
      //     resolve({data: 1});
      // }, 1000);

      const fileNames = fs.readdirSync(__dirname);

    filesObjArr = fileNames.map((file) => {
      let fileObj = {};
      fileObj.name = file;
      fileObj.extension =
        path.extname(file) === "" ? "directory" : path.extname(file);
      return fileObj;
    });

    console.log("after", fileNames);
    console.log("after", filesObjArr);
    resolve(filesObjArr);
  });
}
