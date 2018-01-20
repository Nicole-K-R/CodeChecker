const express = require('express');
const app = express();
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
var mv = require('mv');
var sleep = require('sleep');
// ******* Variable(s) *******//
var folder = 'uploads/';


// Delete files in a specific folder
var deleteAllFilesInFolder = function(folder){
    fs.readdirSync(folder).forEach(function (file) {
        console.log('Deleting: ' + file);
        fs.unlinkSync(path.join(__dirname, 'python/' + file));
    });
}

// Receives data as a JSON object (should be identical for each language)
    // Called by checkPythonFormatting
var scoring = function(data){
    // ***** Put in code for scoring ******

    return true; // Replace with score
}

// Converts the text files to JSON objects and calculates a score
    // Calls scoring & called by checkPythonFormatting
var textToJSONPython = async function(fileName, extensionValue = '.py'){
    // Retrieve language rules from database
    var extensionObject = await db.Extension.findOne({ extension: extensionValue });
    var langObjectID = extensionObject.language_id;
    var langObject = await db.Language.findOne({ '_id': langObjectID });
    var ruleObjects = await db.StyleRule.find({ 'language_id': langObjectID });

    for(var i = 0; i < ruleObjects.length; i++) {
      console.log(ruleObjects[i].name);
    }

    var file1 = fileName + '1.txt';
    var file2 = fileName + '2.txt';
    // Read first file
    var content1 = read(file1);
    console.log(content1);
    // Read second file
    var content2 = read(file2);
    console.log(content2);

    // Convert to JSON
    data = []; // Replace with JSON object
    

    // return scoring(data); // Send score
    return 0;
}

var walkThroughFiles = function(dir, extension, filelist) {
    var files = fs.readdirSync(dir);
    filelist = filelist || [],
    extension = extension || '';
    var allFilesList = []; //***************//
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkThroughFiles(path.join(dir, file), extension, filelist);
        }
        else {
            allFilesList.push(file);
            if (path.extname(file) === extension){
                filelist.push(file);
            }
        }
    });
    return filelist;
};


// Moves all python files from cctmp folder and moves them to python folder
    // Called by checkPythonFormatting
var movePythonFiles = function (){
    var pythonFiles = walkThroughFiles('cctmp', '.py');
    console.log('Lenght: ' + pythonFiles.length);
    console.log('Files: ' + pythonFiles);
    for (var i = 0; i < pythonFiles.length; i ++){
        cmd.run('mkdir python \n cd cctmp \n mv ' + pythonFiles[i] + ' ../python');
    }
    console.log(pythonFiles);
}

// Check python formatting (checks pep8 on cctmp folder and checks for formatting errors in the .py files and
// stores errors in text files in the uploads directory)
    // Calls textToJSONPython & called by getFiles
var checkPythonFormatting = function(repoDetails){
    // Make directory and clone files from the repo into it
    const mkdir = spawnSync('mkdir', ['./cctmp']);
    const clone = spawnSync('git', ['clone', repoDetails.clone_url, './cctmp']);
    var returnScore = -1;
    movePythonFiles();
    // Delete files from cctmp folder
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
    sleep.msleep(1500);
    console.log('DELAY DONE');
    // Delete python files
    // cmd.run('cd ..')
    deleteAllFilesInFolder('python');
    // Call function to turn error text files to json to send back to front-end
    returnScore = textToJSONPython(repoName); // Send score
    return returnScore;
}

// Gets all GitHub repos under a given username
    // Calls checkPythonFormatting and getAllRepos & called by express route
var getAllRepos = function(username, callback) {
    //request({ url: 'https://api.github.com/users/' + username + '/repos', headers: githubHeaders }, function(error, response, body) {
	//https://api.github.com/search/repositories?q=+user:daniel-e+language:python&sort=stars&order=desc	
      request({ url: 'https://api.github.com/search/repositories?q=+user:' + username + '+language:python&sort=stars&order=desc', headers: githubHeaders }, function(error, response, body) {
		  
      if(!response || response.statusCode != 200) {
        callback(null);
      }
      var reposJson = JSON.parse(body).items;
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
        // console.log('--------------------------------- 5 : ' + repos[4].name + ' ---------------------------------'); 
        // scorePy.push(repos[4].name, checkPythonFormatting(repos[4]));
        for(var i = 0; i < repos.length; i++) {
            console.log('--------------------------------- ' + (i+1) + ' : ' + repos[i].name + ' ---------------------------------');
            scorePy.push(repos[i].name, checkPythonFormatting(repos[i]));
        }
    });
    //Calculate overall score and return
    var score = 0;
    console.log('ScorePy: ' + scorePy);
    for (var i = 0; i < scorePy.length; i ++){
        if (score !== -1){
            score += scorePy[i][1];
        }
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
app.get('/:userName', async function (req, res) {
    var userName = req.params.userName
    var url = 'https://github.com/' + userName;
    // Download files from github repos to uploads folder
    getFiles(userName); 
    res.sendFile('views/index.html' , { root : __dirname});
});

app.use(express.static('public'));

app.listen(7000, function(){
    console.log('Example app listening on port 7000!');
});
