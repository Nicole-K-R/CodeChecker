const express = require('express');
const app = express();
const mongoose = require('mongoose');

// GET method route
app.get('/', function (req, res) {
    // res.send('Get root route');
    res.sendFile('views/index.html' , { root : __dirname});});
  
  // POST method route
app.post('/', function (req, res) {
    res.send('POST root route')
});

app.listen(7000, function(){
    console.log('Example app listening on port 7000!');
});