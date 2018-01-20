var db = require('./db');
const assert = require('assert');

var onError = function(err) {
  if(err) {
    console.log(err);
  }
};

var dbInit = function() {
  db.Language.find({}, function(err, items) {
    for(var i = 0; i < items.length; i++) {
      items[i].remove();
    }
  });
  var pythonLang = new db.Language({
    name: 'Python', 
    extensions: [
      { extension: 'py' }
    ],
    checker_command: 'pycodestyle --first <filename>'
  });
  pythonLang.save(onError);
  
  db.Extension.find({}, function(err, items) {
    for(var i = 0; i < items.length; i++) {
      items[i].remove();
    }
  });
  var pythonExt = new db.Extension({
    extension: '.py',
    language_id: pythonLang
  });
  pythonExt.save(onError);

  db.StyleRule.find({}, function(err, items) {
    for(var i = 0; i < items.length; i++) {
      items[i].remove();
    }
  });
  var whitespaceAfterCurlyBraceRule = new db.StyleRule({
    name: 'whitespace after curly brace',
    language_id: pythonLang,
    regex_match: 'whitespace after \\\'\\{\\\'',
    weight: 1
  });
  whitespaceAfterCurlyBraceRule.save(onError);
};

var dbTest = function() {
  var query = db.Language.findOne({ 'name': 'Python' });

  query.select('name checker_command');
  query.exec(function(err, lang) {
    onError(err);
    assert.equal('pycodestyle --first <filename>', lang.checker_command);
  });

  query = db.StyleRule.findOne();

  query.select('name language_id regex_match weight');
  query.exec(function(err, rule) {
    onError(err);
    assert.equal(1, rule.weight);
  });

};
dbInit();
dbTest();


