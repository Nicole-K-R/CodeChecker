const db = require('./db');
const fs = require('fs');

var weightScale = 250;

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
};

var getCategoryName = function(line, categoryObjects) {
  for(var i = 0; i < categoryObjects.length; i++) {
    var regex = new RegExp(categoryObjects[i].regex_match);
    if(line.match(regex) != null) {
      return categoryObjects[i].name;
    }
  }
  return null;
};

var getMostFrequentLines = function(all_lines) {
  var messageFrequency = []; // map number to message
  var regex = new RegExp('(\\d*)\\s+[A-Z]\\d*\\s+(.*)');
  
  for(var i = 0; i < all_lines.length; i++) {
    var line = all_lines[i];
    var matches = regex.exec(line);
    if(matches != null && matches.length >= 3) {
      messageFrequency.push([ parseInt(matches[1]), matches[2] ]);
    }
  }
  messageFrequency.sort(function(a, b) {
    return b[0] - a[0];
  });
  if(messageFrequency.length >= 5) {
    return messageFrequency.slice(0, 5);
  } else {
    return messageFrequency; //returns array of 'tuple'-type arrays [ [22, "message"], ...]
  }
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
    var numLines = lines.length;

    
    // iterate over each line, deduct weighted amounts based on the style rule
    for(var i = 0; i < lines.length; i++) {
      var lineWeight = regexWeight(lines[i], ruleObjects);
      score -= lineWeight / numLines;
      var categoryName = getCategoryName(lines[i], categoryObjects);
      if(categoryName != null) {
        if(!categories[categoryName]) {
          categories[categoryName] = lineWeight;
        } else {
          categories[categoryName] += lineWeight;
        }
      }

    }

    score = Number((score).toFixed(0));
    var messageFrequency = getMostFrequentLines(lines);
    var result = { 'score': score, 'categories': categories, 'frequent': messageFrequency };
    return result;
};
exports.scoreRepo = scoreRepo;
