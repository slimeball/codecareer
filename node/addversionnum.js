// add version number to static file include
// pakage.json 脚本 node addversionnum && 原命令  用来串联执行
const fs = require('fs');
const file = './public/index.html';  // the file need modify

fs.readFile(file, 'utf-8', (err, data)=>{
  if(err) return console.error(err);
  let result = data.replace(/config.js\?v=.*"/g, 'config.js?v=' + (+new Date())+'"');
  fs.writeFile(file, result, err => {
    if(err) return console.error(err);
  })
})
