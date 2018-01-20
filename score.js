const db = require('./db');
const fs = require('fs');

var regexWeight = function(line, ruleObjects) {
  for(var i = 0; i < ruleObjects.length; i++) {
    if(reg)
  }
}

var scoreRepo = async function(filepath = './uploads/test2.txt', extensionValue = '.py') {
    // Retrieve language rules from database
    var extensionObject = await db.Extension.findOne({ extension: extensionValue });
    var langObjectID = extensionObject.language_id;
    var langObject = await db.Language.findOne({ '_id': langObjectID });
    var ruleObjects = await db.StyleRule.find({ 'language_id': langObjectID });

    for(var i = 0; i < ruleObjects.length; i++) {
      console.log(ruleObjects[i].name);
    }

    var lines = fs.readFileSync(filepath).toString().split('\n');
    console.log(lines);
};
scoreRepo();

