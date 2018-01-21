const db = require('./db');
const fs = require('fs');

var weightScale = 1;

var regexWeight = function(line, ruleObjects) {
  for(var i = 0; i < ruleObjects.length; i++) {
    var regex = new RegExp(ruleObjects[i].regex_match);
    if(line.match(regex) != null) {
      var regex_count = new RegExp(ruleObjects[i].regex_match_count);
      var count_match = regex_count.exec(line);
      if(count_match.length == 1) {
        var count = parseInt(count_match[0]);
     
        return ruleObjects[i].weight * count * weightScale;
      }
      return ruleObjects[i].weight * weightScale;
    }
  }
  return 0; //no matching regex found, 0 weight
}

var getCategoryName = function(line, categoryObjects) {
  for(var i = 0; i < categoryObjects.length; i++) {
    var regex = new RegExp(categoryObjects[i].regex_match);
    if(line.match(regex) != null) {
      return categoryObjects.name;
    }
  }
  return null;
};

var scoreRepo = async function(filepath, extensionValue = '.py') {
    // Retrieve language rules from database
    var extensionObject = await db.Extension.findOne({ extension: extensionValue });
    var langObjectID = extensionObject.language_id;
    var langObject = await db.Language.findOne({ '_id': langObjectID });
    var ruleObjects = await db.StyleRule.find({ 'language_id': langObjectID });
    var categoryObjects = await db.StyleCategory.find({ 'language_id': langObjectID });
    var categories = {}; // map category name to category score

    // set initial repo score to 100
    var score = 100.0;
    var lines = fs.readFileSync(filepath).toString().split('\n');
    // iterate over each line, deduct weighted amounts based on the style rule
    for(var i = 0; i < lines.length; i++) {
      var lineWeight = regexWeight(lines[i], ruleObjects);
      score -= lineWeight;
      var categoryName = getCategoryName(lines[i], categoryObjects);
      if(!categories[categoryName]) {
        categories[categoryName] = lineWeight;
      } else {
        categories[categoryName] += lineWeight;
      }

    }
    return score;
};
exports.scoreRepo = scoreRepo;
/*
var scoreProfile = async function(all_filepaths, extensionValue = '.py') {
  var profileScore = 0;
  var numRepos = 0;
  for(var i = 0; i < all_filepaths.length; i++) {
    var repoScore = await scoreRepo(all_filepaths[i], extensionValue);
    profileScore += repoScore;
    numRepos++;
  }
  // average all repos together to compute profileScore
  if(numRepos == 0) {
    return 0;
  } else {
    profileScore = profileScore / numRepos;
  }
  return profileScore;
}
exports.scoreProfile = scoreProfile;

*/