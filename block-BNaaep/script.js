var http = require('http');

var fs = require('fs');
var url = require('url');

var path = require('path');

var qs = require('querystring');
// var userPath = __dirname + '/contacts/';

var imagePath = __dirname + '/assets/';

var server = http.createServer(handleServer);

function handleServer(req, res) {
  var parsedUrl = url.parse(req.url, true);
  var store = '';
  req.on('data', (chunk) => {
    store += chunk;
  });

  req.on('end', () => {
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(201, { 'Content-Type': 'text/html' });
      fs.createReadStream('./index.html').pipe(res);
    } else if (req.method === 'GET' && req.url === '/about') {
      res.writeHead(202, { 'Content-Type': 'text/html' });
      fs.createReadStream('./about.html').pipe(res);
    } else if (req.url.split('.').pop() === 'css') {
      fs.readFile(__dirname + req.url, (err, content) => {
        if (err) console.log(err);
        res.setHeader('Content-Type', 'text/css');
        res.end(content);
      });
    } else if (req.url.split('.').pop() === 'jpg') {
      fs.readFile(__dirname + req.url, (err, content) => {
        if (err) console.log(err);
        res.setHeader('Content-Type', 'image/jpg');
        res.end(content);
      });
    } else if (req.url.split('.').pop() === 'jpeg') {
      fs.readFile(__dirname + req.url, (err, content) => {
        if (err) console.log(err);
        res.setHeader('Content-Type', 'image/jpeg');
        res.end(content);
      });
    } else if (req.url.split('.').pop() === 'png') {
      fs.readFile(__dirname + req.url, (err, content) => {
        if (err) console.log(err);
        res.setHeader('Content-Type', 'image/png');
        res.end(content);
      });
    } else if (req.method === 'GET' && req.url === '/contact') {
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream('./form.html').pipe(res);
    } else if (req.method === 'POST' && req.url === '/form') {
      let parsedData = qs.parse(store);
      // console.log(parsedData);
      let username = parsedData.username;
      let stringyData = JSON.stringify(parsedData);
      let rootPath = __dirname + '/contacts/';
      fs.open(rootPath + username + '.json', 'wx', (err, fd) => {
        // console.log(err, fd);
        if (err) {
          return res.end(`user ${username} is taken`);
        }
        fs.writeFile(fd, stringyData, (err) => {
          if (err) return console.log(err);

          fs.close(fd, (err) => {
            if (err) return console.log(err);
            else {
              return res.end(`contact saved`);
            }
          });
        });
      });
    } else if (req.method === 'GET' && parsedUrl.pathname === '/users') {
      var username = parsedUrl.query.username;
      let path = __dirname + '/contacts/' + username + '.json';
      let rootFolder = __dirname + '/contacts';

      if (username) {
        fs.readFile(path, (err, content) => {
          if (err) return console.log(err);

          let data = JSON.parse(content.toString());
          res.writeHead(200, { 'Content-Type': 'text/html' });
          return res.end(`<h1>${data.name}</h1>
      <h2>${data.email}</h2>
      <h2>${data.username}</h2>
      <h2>${data.age}</h2>
      <h2>${data.bio}</h2>`);
        });
      } else {
        let files = fs.readdirSync(rootFolder);
        console.log(files);
        let contacts = files.map((file) => {
          return JSON.parse(fs.readFileSync(rootFolder + '/' + file));
        });
        console.log(contacts);
        let datas = ' ';
        contacts.forEach((contact) => {
          datas += `<h1>${contact.name}</h1>
              <h2>${contact.email}</h2>
      <h2>${contact.username}</h2>
      <h2>${contact.age}</h2>
      <h2>${contact.bio}</h2>`;
        });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(datas);
      }
    } else {
      res.statusCode = 404;
      res.end(`page not found`);
    }
  });
}

server.listen(5000, () => {
  console.log('server is listening at 5k');
});
