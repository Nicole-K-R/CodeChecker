const express = require('express');
const app = express();
// ******* MongoDB Requirements *******//
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
// ******* GitHub API Requirements *******//
var request = require('request');
var path = require('path');
var db = require('./db');
var githubHeaders = { 'User-Agent': 'request' };
const { spawnSync } = require('child_process');
// ******* Command Line Requirement *******//
var cmd = require('node-cmd');
// ******* File Reader Requirement *******//
var read = require('file-reader');
// ******* Other Requirements *******//
const assert = require('assert');
const fs = require('fs');
// ******* Variable(s) *******//
var folder = 'uploads/';


// Receives data as a JSON object (should be identical for each language)
    // Called by checkPythonFormatting
var scoring = function(data){
    // ***** Put in code for scoring ******

    return true; // Replace with score
}


// Converts the text files to JSON objects and calculates a score
    // Calls scoring & called by checkPythonFormatting
var textToJSONPython = function(fileName){
    var file1 = fileName + '1.txt';
    var file2 = fileName + '2.txt';
    console.log('File1: ' + file1);
    // Read first file
    var content1 = read(file1);
    console.log(content1);
    // Read second file
    var content2 = read(file2);
    console.log(content2);

    // Convert to JSON
    data = true; // Replace with JSON object

    return scoring(data); // Send score
}

// Moves all python files from cctmp folder and moves them to python folder
    // Called by checkPythonFormatting
var movePythonFiles = function (){
    console.log('In movePythonFiles');
    fs.readdirSync('cctmp').forEach(function(file) {
        if (path.extname('.py')){
            console.log('Moving: ' + file.name);
            file.path = __dirname + './python';
            console.log(file.path);
        }
    });
}


// Check python formatting (checks pep8 on cctmp folder and checks for formatting errors in the .py files and
// stores errors in text files in the uploads directory)
    // Calls textToJSONPython & called by getFiles
var checkPythonFormatting = function(repoDetails){
    // Make directory and clone files from the repo into it
    const mkdir = spawnSync('mkdir', ['./cctmp']);
    const clone = spawnSync('git', ['clone', repoDetails.clone_url, './cctmp']);
    movePythonFiles();
    // Delete files from cctmp folder
    // fs.readdirSync('cctmp').forEach(function(file) {
    //     console.log('Deleting: ' + file);
    //     fs.unlinkSync(file);
    // });
    const rmdir = spawnSync('rm', ['-r', './cctmp']);
    var repoName = repoDetails.name;
    
    // Install pycodestyle and change directory to uploads folder
    cmd.run('pip install pycodestyle');
    cmd.run('cd python');
        // Run pycodestyle on the python files and save it to <repoName>.txt 
        // (first displays errors and solutions, second displays number of each errors)
        // pycodestyle --show-source --show-pep8 <folder> > uploads/test.txt (1)
        // pycodestyle --statistics -qq <folder> > uploads/test.txt (2)
    cmd.run('pycodestyle --show-source --show-pep8 python > ./uploads/' + repoName + '1.txt');
    cmd.run('pycodestyle --statistics -qq  python > ./uploads/' + repoName + '2.txt');
    // Call function to turn error text files to json to send back to front-end
    return textToJSONPython(repoName); // Send score
}

// Gets all GitHub repos under a given username
    // Calls checkPythonFormatting and getAllRepos & called by express route
var getAllRepos = function(username, callback) {
    request({ url: 'https://api.github.com/users/' + username + '/repos', headers: githubHeaders }, function(error, response, body) {
      if(!response || response.statusCode != 200) {
        callback(null);
      }
      var reposJson = JSON.parse(body);
      var repos = [];
      for(var i = 0; i < reposJson.length; i++) {
        repos.push({
          'name': reposJson[i].name,
          'url': reposJson[i].url,
          'clone_url': reposJson[i].clone_url
        });
      }
      callback(repos);
    });
  };

// Gets repos from GitHub API
    // Calls checkPythonFormatting and getAllRepos & called by express route
var getFiles = function(userName){
    var scorePy =[];
    getAllRepos(userName, function(repos) {
        for(var i = 0; i < repos.length; i++) {
            scorePy.push(repos[i].name, checkPythonFormatting(repos[i]));
        }
    });
    //Calculate overall score and return
    var score = 0;
    console.log('ScorePy: ' + scorePy);
    for (var i = 0; i < scorePy.length; i ++){
        score += scorePy[i][1];
    }
    return score;
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
ç
    // Download files from github repos to uploads folder
    getFiles(userName); 
    res.sendFile('views/index.html' , { root : __dirname});
});

app.use(express.static('public'));

app.listen(7000, function(){
    console.log('Example app listening on port 7000!');
});
