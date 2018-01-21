const mongoose = require('mongoose');

const mongoPassword = 'code_checker';
mongoose.connect('mongodb://PennApps18:' + mongoPassword + '@code-checker-shard-00-00-ala2x.mongodb.net:27017,code-checker-shard-00-01-ala2x.mongodb.net:27017,code-checker-shard-00-02-ala2x.mongodb.net:27017/codechecker?ssl=true&replicaSet=code-checker-shard-0&authSource=admin');

var Schema = mongoose.Schema;


var languageSchema = new Schema({
  name: String,
  extensions: [{ extension: String }],
  checker_command: String
});
var Language = mongoose.model('Language', languageSchema);
exports.Language = Language;

var styleRuleSchema = new Schema({
  name: String,
  language_id: {type: Schema.Types.ObjectId, ref: 'Language'},
  regex_match: String,
  regex_match_count: String,
  weight: Number
});
var StyleRule = mongoose.model('StyleRule', styleRuleSchema);
exports.StyleRule = StyleRule;

var styleCategorySchema = new Schema({
  name: String,
  language_id: {type: Schema.Types.ObjectId, ref: 'Language'},
  regex_match: String
});
var StyleCategory = mongoose.model('StyleCategory', styleCategorySchema);
exports.StyleCategory = StyleCategory;

var extSchema = new Schema({
  extension: String,
  language_id: {type: Schema.Types.ObjectId, ref: 'Language'}
});
var Extension = mongoose.model('Extension', extSchema);
exports.Extension = Extension;
