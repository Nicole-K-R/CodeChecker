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


// Delete files in a specific folder
var deleteAllFilesInFolder = function(folder){
    fs.readdirSync(folder).forEach(function (file) {
        fs.unlinkSync(path.join(__dirname, 'python/' + file));
    });
}

// Delete files in a specific folder (uploads)
var deleteAllFilesInUploads = function(folder = './uploads/'){
    fs.readdirSync(folder).forEach(function (file) {
        fs.unlinkSync(path.join(__dirname, `/uploads/${file}`));
    });
}

// Converts the text files to JSON objects and calculates a score
    // Called by checkPythonFormatting
var textToJSONPython = async function(repoName, resultFilename, extensionValue = '.py'){
    var scoreDetails = await score.scoreRepo(resultFilename, extensionValue);
    scoreDetails['name'] = repoName;
    return scoreDetails;
}

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
    // Called by checkPythonFormatting
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
    // Delete python files
    deleteAllFilesInFolder('python');
    // Make directory and clone files from the repo into it
    const mkdir = spawnSync('mkdir', ['./cctmp']);
    const clone = spawnSync('git', ['clone', repoDetails.clone_url, './cctmp']);
    movePythonFiles();
    // Delete files from cctmp folder
    const rmdir = spawnSync('rm', ['-r', './cctmp']);
    var repoName = repoDetails.name;
    // Install pycodestyle and change directory to uploads folder
    //cmd.run('pip install pycodestyle');
    //cmd.run('cd python');
        // Run pycodestyle on the python files and save it to <repoName>.txt 
        // (first displays errors and solutions, second displays number of each errors)
        // pycodestyle --show-source --show-pep8 <folder> > uploads/test.txt (1)
        // pycodestyle --statistics -qq <folder> > uploads/test.txt (2)
    
    //cmd.run('pycodestyle --show-source --show-pep8 python > ./uploads/' + repoName + '1.txt');

    var resultFilename = path.join('uploads', repoName + '2.txt');
    var temp = await cmd.run('pycodestyle --statistics -qq  python > ' + resultFilename);
    
    // Call function to turn error text files to json to send back to front-end
    var result = await textToJSONPython(repoName, resultFilename, '.py'); // Send score
    return result;
}

// Gets all GitHub repos under a given username
    // Calls checkPythonFormatting and getAllRepos & called by express route
var getAllRepos = async function(username) {
    //request({ url: 'https://api.github.com/users/' + username + '/repos', headers: githubHeaders }, function(error, response, body) {
	//https://api.github.com/search/repositories?q=+user:daniel-e+language:python&sort=stars&order=desc	
      return new Promise(function (resolve, reject) {
          request({ url: 'https://api.github.com/search/repositories?q=+user:' + username + '+language:python&sort=stars&order=desc', headers: githubHeaders }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            } else {
                console.log("Error retrieveing github repos");
                reject(error);
            }
        });
    });
};

var getTopMessages = function(repoScoreDetails) {
    var allMessages = [];
    for(var i = 0; i < repoScoreDetails.length; i++) {
        allMessages = allMessages.concat(repoScoreDetails[i]['frequent']);
    }
    
    allMessages.sort(function(a, b) {
        return b[0] - a[0];
    });
    var mainSuggestions = [];
    for(var i = 0; i < allMessages.length; i++) {
        var message = allMessages[i];
        var inMain = false;
        for(var j = 0; j < mainSuggestions.length; j++) {
            if(mainSuggestions[j][2] === message[2]) {
                inMain = true;
            }
        }
        if(!inMain) {
            mainSuggestions.push(message);
        }
    }
        
    if(mainSuggestions.length >= 3) {
        return mainSuggestions.slice(0, 3);
    } else {
        return mainSuggestions; //returns array of 'tuple'-type arrays [ [22, "message"], ...]
    }
};

// Gets repos from GitHub API
    // Calls checkPythonFormatting and getAllRepos & called by express route
var getFiles = async function(userName) {
    var scorePy = [];
    let body = await getAllRepos(userName);
    var reposJson = JSON.parse(body).items;
    var repos = [];
    for(var i = 0; i < reposJson.length; i++) {
      repos.push({
        'name': reposJson[i].name,
        'url': reposJson[i].url,
        'clone_url': reposJson[i].clone_url
      });
    }

    

    var averageTotal = 0;
    var averageNum = 0;
    for(var i = 0; i < repos.length; i++) {
        // Number((6.688689).toFixed(0)); // 7
        var check;
        try {
            check = await checkPythonFormatting(repos[i]);
        } catch(err) {
            console.log(err);
        }
        scorePy.push(check);
        averageTotal += check['score'];
        averageNum++;
    }

    var averageScore;
    if(averageNum != 0) {
        averageScore = Number((averageTotal / averageNum).toFixed(0));
    } else {
        averageScore = 0;
    }

    var obj = { 'average': averageScore, 'repos': scorePy, 'messages': getTopMessages(scorePy) };
    return obj;
};

// ------------------------------------------ Express Routing ------------------------------------------ //
// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// GET method route
app.get('/', function (req, res) {
    // res.send('Get root route');
    res.sendFile('views/index.html' , { root : __dirname});});
  
// POST method route (sendurl)
//app.post('/sendurl', function (req, res) {
app.post('/:userName', async function (req, res) {
    // Delete files in uploads folder
    deleteAllFilesInUploads();
    var userName = req.params.userName
    var url = 'https://github.com/' + userName;
    // Download files from github repos to uploads folder
    var variable;
    try {
        variable = await getFiles(userName);
    } catch(err) {
        console.log(err);
    }
    var sendVal = JSON.stringify(variable);
    console.log(sendVal);
    // var sendVal = getFiles(userName)
    res.send(sendVal); 
});

app.use(express.static('public'));

app.listen(7000, function(){
    console.log('Example app listening on port 7000!');
});
