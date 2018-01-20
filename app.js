const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fs = require('fs');
var path = require('path');
var cmd = require('node-cmd');
var read = require('file-reader');
var folder = 'uploads/';

// Check python formatting (checks pep8 on cctmp folder and checks for formatting errors in the .py files and
// stores errors in text files in the uploads directory)
var checkPythonFormatting = function(fileName){
    // Install pycodestyle and change directory to uploads folder
    cmd.run('pip install pycodestyle');
    cmd.run('cd cctmp');
        // Run pycodestyle on the python file and save it to <pythonFileName>.txt 
        // (first displays errors and solutions, second displays number of each errors)
        // pycodestyle --show-source --show-pep8 test.py > uploads/test.txt (1)
        // pycodestyle --statistics -qq test.py > uploads/test.txt (2)
    cmd.run('pycodestyle --show-source --show-pep8 cctmp > ./uploads/' + fileName + '1.txt');
    cmd.run('pycodestyle --statistics -qq  cctmp > ./uploads/' + fileName + '2.txt');
    // Delete files from cctmp folder
    fs.readdirSync(folder).forEach(function(file) {
        console.log('Deleting: ' + file);
        fs.unlinkSync(file);
    });
    // Call function to turn error text files to json to send back to front-end
    var errors = textToJSON(fileName);
    return errors;
}


var getFiles = function(){
    getAllRepos('keller-mark', function(repos) {
        console.log(repos);
        for(var i = 0; i < repos.length; i++) {
          var fileScore = scoreRepo(repos[i]);
          
          // console.log(fileScore);
        }
    });
}


var textToJSON = function(fileName){
    var file1 = fileName + '1.txt';
    var file2 = fileName + '2.txt';
    console.log('File1: ' + file1);
    console.log('File2: ' + file2);
    // Read first file
    var content1 = read(file1);
    console.log('Content1: ' + content1);
    // Read second file
    var content2 = read(file2);
    console.log('Content2: ' + content2);
    return true; // Replace with json object of both files
}




// ------------------------------------------ Express Routing ------------------------------------------ //
// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// GET method route
app.get('/', function (req, res) {
    // res.send('Get root route');
    console.log('/');
    res.sendFile('views/index.html' , { root : __dirname});});
  
// POST method route (sendurl)
//app.post('/sendurl', function (req, res) {
app.get('/:userName', function (req, res) {
    var userName = req.params.userName
    var url = 'https://github.com/' + userName;
    console.log('You entered: ' + userName);
    console.log('URL: ' + url);

    // Download files from github repos to uploads folder
    getFiles(); 

    // Run python file to check for errors
    var fileName = userName; // Replace with actual file name
    var errors = checkPythonFormatting(fileName);
});

app.listen(7000, function(){
    console.log('Example app listening on port 7000!');
});