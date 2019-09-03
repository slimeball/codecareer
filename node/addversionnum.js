// add version number to static file include
const fs = require('fs');
const file = './xxxxxx';

fs.readFile(file, 'utf-8', (err, data)=>{
  if(err) return console.error(err);
  let result = data.replace(/.js>/g, '.js?v=' + (+new Date()) + '>');
  fs.writeFile(file, 'utf-8', err => {
    if(err) return console.error(err);
  })
})
