const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var path = require('path');


// // Set up mongoose
// mongoose.connect("mongodb+srv://PennApps18:code_checker@code-checker-ala2x.mongodb.net/test");
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log('Connected to DB');
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// GET method route
app.get('/', function (req, res) {
    // res.send('Get root route');
    console.log('/');
    res.sendFile('views/index.html' , { root : __dirname});});
  
  // POST method route (sendurl)
app.post('/sendurl', function (req, res) {
    console.log('/sendurl');
    res.send('Post Request received');
});

app.listen(7000, function(){
    console.log('Example app listening on port 7000!');
});