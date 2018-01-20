const mongoose = require('mongoose');
const assert = require('assert');

const mongoPassword = process.env.PENNAPPS_MONGO_PASSWORD;
mongoose.connect('mongodb://PennApps18:' + mongoPassword + '@code-checker-shard-00-00-ala2x.mongodb.net:27017,code-checker-shard-00-01-ala2x.mongodb.net:27017,code-checker-shard-00-02-ala2x.mongodb.net:27017/codechecker?ssl=true&replicaSet=code-checker-shard-0&authSource=admin');

var Schema = mongoose.Schema;

var onError = function(err) {
  if(err) {
    console.log(err);
  }
};

var languageSchema = new Schema({
  name: String,
  checker_command: String
});
var Language = mongoose.model('Language', languageSchema);

var styleRuleSchema = new Schema({
  name: String,
  language_id: {type: Schema.Types.ObjectId, ref: 'Language'},
  regex_match: String,
  weight: Number
});
var StyleRule = mongoose.model('StyleRule', styleRuleSchema);


var dbInit = function() {
  var pythonLang = new Language({name: 'Python', checker_command: 'pycodestyle --first <filename>'});
  pythonLang.save(onError);

  var whitespaceAfterCurlyBraceRule = new StyleRule({
    name: 'whitespace after curly brace',
    language_id: pythonLang,
    regex_match: 'whitespace after \\\'\\{\\\'',
    weight: 1
  });
  whitespaceAfterCurlyBraceRule.save(onError);
};

var dbTest = function() {
  var query = Language.findOne({ 'name': 'Python' });

  query.select('name checker_command');
  query.exec(function(err, lang) {
    onError(err);
    assert.equal('pycodestyle --first <filename>', lang.checker_command);
  });

  query = StyleRule.findOne();

  query.select('name language_id regex_match weight');
  query.exec(function(err, rule) {
    onError(err);
    assert.equal(1, rule.weight);
  });

};
dbTest();


