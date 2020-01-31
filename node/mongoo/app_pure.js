const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/playground', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('success')
  })
  .catch(() => {
    console.log('fail')
  })

const UserScheme = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 20
  },
  age: {
    type: Number,
    min: 1,
    max: 120
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  hobbies: [String]
})
const User = mongoose.model('User',UserScheme);

http.createServer((req, res) => {
  const method = req.method;
  const { pathname } = url.parse(req.url);
  if (method === 'GET') {
    switch (pathname) {
      case '/add':
        fs.readFile('./views/add.html', (err, data) => {
          if (err) throw err;
          res.writeHead(200, { 'Content-type': 'text/html;charset=UTF8' });
          res.end(data);
        })
        break;
    }
  }
  if (method === 'POST') {
    switch (pathname) {
      case '/add':
        let formdata = '';
        req.on('data', data => {
          formdata += data;
        })
        req.on('end', async() => {
          let userdata = querystring.parse(formdata);
          console.log(userdata)
          await User.create(userdata);
          res.writeHead(301, {
            Location: '/list'
          })
        })
        res.end();
        break;
    }
  }
}).listen(3000)