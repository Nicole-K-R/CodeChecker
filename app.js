const express = require('express');
const app = express();
// ******* GitHub API Requirements *******//
var request = require('request');
var path = require('path');
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
// ******* Call score.js *******//
var score = require('./score');

// // Receives data as a JSON object (should be identical for each language)
//     // Called by checkPythonFormatting
// var scoring = function(data){
//     // ***** Put in code for scoring ******
//     return true; // Replace with score
// }

// Delete files in a specific folder
var deleteAllFilesInFolder = function(){
    fs.readdirSync('python').forEach(function (file) {
        fs.unlinkSync(path.join(__dirname, 'python/' + file));
    });
}

// Converts the text files to JSON objects and calculates a score
    // Called by checkPythonFormatting
var getScores = async function(repoName){
    var scoreRepo = 0;
    scoreRepo = await score.scoreRepo(repoName + '2.txt');
    console.log('Hello: ' + scoreRepo);
    return scoreRepo; // Number between -inifinity and 100
}
getScores('keller-mark');

// Walks through files and directories and makes a list of all files with a certain extension
    // Called by movePythonFiles and itself
var walkThroughFiles = function(dir, extension, filelist) {
    var files = fs.readdirSync(dir);
    filelist = filelist || [],
    extension = extension || '';
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkThroughFiles(path.join(dir, file), extension, filelist);
        }
        else {
            if (path.extname(file) === extension){
                filelist.push(file);
            }
        }
    });
    return filelist;
};


// Moves all python files from cctmp folder and moves them to python folder
    // Called by checkPythonFormatting (***** WORKS *****)
var movePythonFiles = function (){
    var pythonFiles = walkThroughFiles('cctmp', '.py');
    for (var i = 0; i < pythonFiles.length; i ++){
        cmd.run('mkdir python \n cd cctmp \n mv ' + pythonFiles[i] + ' ../python');
    }
}

// Check python formatting (checks pep8 on cctmp folder and checks for formatting errors in the .py files and
// stores errors in text files in the uploads directory)
    // Calls textToJSONPython & called by getFiles
var checkPythonFormatting = async function(repoDetails){
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
    // Delete python files
    deleteAllFilesInFolder('python');
    // Call function to turn error text files to json to send back to front-end
    var scores = getScores('./uploads/' + repoName); // Send score
    return scores; // Format number
}

// checkPythonFormatting();
// console.log('* was called');

// Gets all GitHub repos under a given username
    // Calls checkPythonFormatting and getAllRepos & called by express route
var getAllRepos = async function(username, callback) {
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
var getFiles = async function(userName){
    var scorePy =[];
    getAllRepos(userName, function(repos) {
        for(var i = 0; i < repos.length; i++) {
            scorePy.push([repos[i].name, checkPythonFormatting(repos[i])]);
        }
    });
    //Calculate overall score and return
    var score = 0;
    var obj = {};
    console.log('ScorePy: ' + scorePy);
    for (var i = 0; i < scorePy.length; i ++){
        score += scorePy[i][1];
        if (i !== 0){
            obj[scorePy[i][0]] = obj[scorePy[i][1]];
        }
    }
    obj[scorePy[0][0]] = score;
    return JSON.stringify(obj);
}

getFiles('keller-mark');

// // ------------------------------------------ Express Routing ------------------------------------------ //
// // View engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'html');

// // GET method route
// app.get('/', function (req, res) {
//     // res.send('Get root route');
//     res.sendFile('views/index.html' , { root : __dirname});});
  
// // POST method route (sendurl)
// //app.post('/sendurl', function (req, res) {
// app.get('/:userName', async function (req, res) {
//     var userName = req.params.userName
//     var url = 'https://github.com/' + userName;
//     // Download files from github repos to uploads folder
//     res.send(getFiles(userName)); 
// });

// app.use(express.static('public'));

// app.listen(7000, function(){
//     console.log('Example app listening on port 7000!');
// });
