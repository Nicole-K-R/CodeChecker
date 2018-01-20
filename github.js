var request = require('request');
var githubHeaders = { 'User-Agent': 'request' };

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

getAllRepos('keller-mark', function(repos) {
  console.log(repos);
  for(var i = 0; i < repos.length; i++) {
    var fileScore = scoreRepo(repos[i]);
    // console.log(fileScore);
  }
});

var walkSync = function(dir, filelist) {
  var path = path || require('path');
  var fs = fs || require('fs'),
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    } else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

const { spawnSync } = require('child_process');
var scoreRepo = function(repoDetails) {
  const mkdir = spawnSync('mkdir', ['./cctmp']);
  const clone = spawnSync('git', ['clone', repoDetails.clone_url, './cctmp']);
  // console.log(clone.status);
  var allFiles = walkSync('./cctmp');
  // console.log(allFiles);
  //const rmdir = spawnSync('rm', ['-r', './cctmp']);
  return 0;
};
