const express = require('express');
const app = express();
const url = require('url');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const mongoose = require('mongoose');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
const User = mongoose.model('Users', UserScheme);
app.use((err, req, res, next) => {
  if (err) throw err;
  res.render()
})
