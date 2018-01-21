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

  db.StyleCategory.find({}, function(err, items) {
    for(var i = 0; i < items.length; i++) {
      items[i].remove();
    }
  });




  var category = new db.StyleCategory({
    name: 'Indentation',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E1.*'
  });
  category.save(onError);
  var rule = new db.StyleRule({
    name: 'indentation contains mixed spaces and tabs',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E101.*',
    regex_match_count: '(\\d*)\\t*E101.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'indentation is not a multiple of four',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E111.*',
    regex_match_count: '(\\d*)\\t*E111.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'expected an indented block',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E112.*',
    regex_match_count: '(\\d*)\\t*E112.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'unexpected indentation',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E113.*',
    regex_match_count: '(\\d*)\\t*E113.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'indentation is not a multiple of four (comment)',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E114.*',
    regex_match_count: '(\\d*)\\t*E114.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'expected an indented block (comment)',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E115.*',
    regex_match_count: '(\\d*)\\t*E115.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'unexpected indentation (comment)',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E116.*',
    regex_match_count: '(\\d*)\\t*E116.*',
    weight: 0.1
  });   
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(*^)	continuation line under-indented for hanging indent',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E121.*',
    regex_match_count: '(\\d*)\\t*E121.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(^)	continuation line missing indentation or outdented',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E122.*',
    regex_match_count: '(\\d*)\\t*E122.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(*)	closing bracket does not match indentation of opening bracket’s line',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E123.*',
    regex_match_count: '(\\d*)\\t*E123.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(^)	closing bracket does not match visual indentation',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E124.*',
    regex_match_count: '(\\d*)\\t*E124.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(^)	continuation line with same indent as next logical line',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E125.*',
    regex_match_count: '(\\d*)\\t*E125.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(*^)	continuation line over-indented for hanging indent',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E126.*',
    regex_match_count: '(\\d*)\\t*E126.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(^)	continuation line over-indented for visual indent',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E127.*',
    regex_match_count: '(\\d*)\\t*E127.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(^)	continuation line under-indented for visual indent',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E128.*',
    regex_match_count: '(\\d*)\\t*E128.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(^)	visually indented line with same indent as next logical line',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E129.*',
    regex_match_count: '(\\d*)\\t*E129.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(^)	continuation line unaligned for hanging indent',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E131.*',
    regex_match_count: '(\\d*)\\t*E131.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(*)	closing bracket is missing indentation',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E133.*',
    regex_match_count: '(\\d*)\\t*E133.*',
    weight: 0.1
  });
  rule.save(onError);
  category = new db.StyleCategory({
    name: 'Whitespace',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E2.*'
  });
  category.save(onError);
  rule = new db.StyleRule({
    name: 'whitespace after ‘(‘',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E201.*',
    regex_match_count: '(\\d*)\\t*E201.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'whitespace before ‘)’',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E202.*',
    regex_match_count: '(\\d*)\\t*E202.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'whitespace before ‘:’',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E203.*',
    regex_match_count: '(\\d*)\\t*E203.*',
    weight: 0.1
  }); 
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'whitespace before ‘(‘',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E211.*',
    regex_match_count: '(\\d*)\\t*E211.*',
    weight: 0.1
  }); 
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'multiple spaces before operator',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E221.*',
    regex_match_count: '(\\d*)\\t*E221.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'multiple spaces after operator',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E222.*',
    regex_match_count: '(\\d*)\\t*E222.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'tab before operator',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E223.*',
    regex_match_count: '(\\d*)\\t*E223.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'tab after operator',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E224.*',
    regex_match_count: '(\\d*)\\t*E224.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'missing whitespace around operator',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E225.*',
    regex_match_count: '(\\d*)\\t*E225.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(*)	missing whitespace around arithmetic operator',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E226.*',
    regex_match_count: '(\\d*)\\t*E226.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'missing whitespace around bitwise or shift operator',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E227.*',
    regex_match_count: '(\\d*)\\t*E227.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'missing whitespace around modulo operator',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E228.*',
    regex_match_count: '(\\d*)\\t*E228.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'missing whitespace after ‘,’, ‘;’, or ‘:’',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E231.*',
    regex_match_count: '(\\d*)\\t*E231.*',
    weight: 0.1
  });   
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(*)	multiple spaces after ‘,’',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E241.*',
    regex_match_count: '(\\d*)\\t*E241.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(*)	tab after ‘,’',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E242.*',
    regex_match_count: '(\\d*)\\t*E242.*',
    weight: 0.1
  });  
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'unexpected spaces around keyword / parameter equals',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E251.*',
    regex_match_count: '(\\d*)\\t*E251.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'at least two spaces before inline comment',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E261.*',
    regex_match_count: '(\\d*)\\t*E261.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'inline comment should start with ‘# ‘',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E262.*',
    regex_match_count: '(\\d*)\\t*E262.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'block comment should start with ‘# ‘',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E265.*',
    regex_match_count: '(\\d*)\\t*E265.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'too many leading ‘#’ for block comment',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E266.*',
    regex_match_count: '(\\d*)\\t*E266.*',
    weight: 0.1
  }); 
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'multiple spaces after keyword',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E271.*',
    regex_match_count: '(\\d*)\\t*E271.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'multiple spaces before keyword',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E272.*',
    regex_match_count: '(\\d*)\\t*E272.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'tab after keyword',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E273.*',
    regex_match_count: '(\\d*)\\t*E273.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'tab before keyword',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E274.*',
    regex_match_count: '(\\d*)\\t*E274.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'missing whitespace after keyword',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E275.*',
    regex_match_count: '(\\d*)\\t*E275.*',
    weight: 0.1
  }); 
  rule.save(onError);
  category = new db.StyleCategory({
    name: 'Blank line',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E3.*'
  });
  category.save(onError);
  rule = new db.StyleRule({
    name: 'expected 1 blank line, found 0',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E301.*',
    regex_match_count: '(\\d*)\\t*E301.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'expected 2 blank lines, found 0',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E302.*',
    regex_match_count: '(\\d*)\\t*E302.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'too many blank lines (3)',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E303.*',
    regex_match_count: '(\\d*)\\t*E303.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'blank lines found after function decorator',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E304.*',
    regex_match_count: '(\\d*)\\t*E304.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'expected 2 blank lines after end of function or class',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E305.*',
    regex_match_count: '(\\d*)\\t*E305.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'expected 1 blank line before a nested definition',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E306.*',
    regex_match_count: '(\\d*)\\t*E306.*',
    weight: 0.1
  });
  rule.save(onError);
  category = new db.StyleCategory({
    name: 'Import',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E4.*'
  });
  category.save(onError);
  rule = new db.StyleRule({
    name: 'multiple imports on one line',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E401.*',
    regex_match_count: '(\\d*)\\t*E401.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'module level import not at top of file',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E402.*',
    regex_match_count: '(\\d*)\\t*E402.*',
    weight: 0.1
  }); 
  rule.save(onError);
  category = new db.StyleCategory({
    name: 'Line length',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E5.*'
  });
  category.save(onError);
  rule = new db.StyleRule({
    name: '(^)	line too long (82 > 79 characters)',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E501.*',
    regex_match_count: '(\\d*)\\t*E501.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'the backslash is redundant between brackets',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E502.*',
    regex_match_count: '(\\d*)\\t*E502.*',
    weight: 0.1
  });
  rule.save(onError);
  category = new db.StyleCategory({
    name: 'Statement',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E7.*'
  });
  category.save(onError);
  rule = new db.StyleRule({
    name: 'multiple statements on one line (colon)',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E701.*',
    regex_match_count: '(\\d*)\\t*E701.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'multiple statements on one line (semicolon)',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E702.*',
    regex_match_count: '(\\d*)\\t*E702.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'statement ends with a semicolon',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E703.*',
    regex_match_count: '(\\d*)\\t*E703.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(*)	multiple statements on one line (def)',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E704.*',
    regex_match_count: '(\\d*)\\t*E704.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(^)	comparison to None should be ‘if cond is None:’',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E711.*',
    regex_match_count: '(\\d*)\\t*E711.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(^)	comparison to True should be ‘if cond is True:’ or ‘if cond:’',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E712.*',
    regex_match_count: '(\\d*)\\t*E712.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'test for membership should be ‘not in’',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E713.*',
    regex_match_count: '(\\d*)\\t*E713.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'test for object identity should be ‘is not’',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E714.*',
    regex_match_count: '(\\d*)\\t*E714.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: '(^)	do not compare types, use ‘isinstance()’',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E721.*',
    regex_match_count: '(\\d*)\\t*E721.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'do not use bare except, specify exception instead',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E722.*',
    regex_match_count: '(\\d*)\\t*E722.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'do not assign a lambda expression, use a def',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E731.*',
    regex_match_count: '(\\d*)\\t*E731.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'do not use variables named ‘l’, ‘O’, or ‘I’',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E741.*',
    regex_match_count: '(\\d*)\\t*E741.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'do not define classes named ‘l’, ‘O’, or ‘I’',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E742.*',
    regex_match_count: '(\\d*)\\t*E742.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'do not define functions named ‘l’, ‘O’, or ‘I’',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E743.*',
    regex_match_count: '(\\d*)\\t*E743.*',
    weight: 0.1
  });   
  rule.save(onError);
  category = new db.StyleCategory({
    name: 'Runtime',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E9.*'
  });
  category.save(onError);
  rule = new db.StyleRule({
    name: 'SyntaxError or IndentationError',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E901.*',
    regex_match_count: '(\\d*)\\t*E901.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'IOError',
    language_id: pythonLang,
    regex_match: '\\d*\\t*E902.*',
    regex_match_count: '(\\d*)\\t*E902.*',
    weight: 0.1
  });  
  rule.save(onError);
  category = new db.StyleCategory({
    name: 'Indentation warning',
    language_id: pythonLang,
    regex_match: '\\d*\\t*W1.*'
  });
  category.save(onError);
  rule = new db.StyleRule({
    name: 'indentation contains tabs',
    language_id: pythonLang,
    regex_match: '\\d*\\t*W191.*',
    regex_match_count: '(\\d*)\\t*W191.*',
    weight: 0.1
  });
  rule.save(onError);
  category = new db.StyleCategory({
    name: 'Whitespace warning',
    language_id: pythonLang,
    regex_match: '\\d*\\t*W2.*'
  });
  category.save(onError);
  rule = new db.StyleRule({
    name: 'trailing whitespace',
    language_id: pythonLang,
    regex_match: '\\d*\\t*W291.*',
    regex_match_count: '(\\d*)\\t*W291.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'no newline at end of file',
    language_id: pythonLang,
    regex_match: '\\d*\\t*W292.*',
    regex_match_count: '(\\d*)\\t*W292.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'blank line contains whitespace',
    language_id: pythonLang,
    regex_match: '\\d*\\t*W293.*',
    regex_match_count: '(\\d*)\\t*W293.*',
    weight: 0.1
  });
  rule.save(onError);
  category = new db.StyleCategory({
    name: 'Blank line warning',
    language_id: pythonLang,
    regex_match: '\\d*\\t*W3.*'
  });
  category.save(onError);
  rule = new db.StyleRule({
    name: 'blank line at end of file',
    language_id: pythonLang,
    regex_match: '\\d*\\t*W391.*',
    regex_match_count: '(\\d*)\\t*W391.*',
    weight: 0.1
  });
  rule.save(onError);
  category = new db.StyleCategory({
    name: 'Line break warning',
    language_id: pythonLang,
    regex_match: '\\d*\\t*W5.*'
  });
  category.save(onError);
  rule = new db.StyleRule({
    name: '(*)	line break occurred before a binary operator',
    language_id: pythonLang,
    regex_match: '\\d*\\t*W503.*',
    regex_match_count: '(\\d*)\\t*W503.*',
    weight: 0.1
  }); 
  rule.save(onError);
  category = new db.StyleCategory({
    name: 'Deprecation warning',
    language_id: pythonLang,
    regex_match: '\\d*\\t*W6.*'
  });
  category.save(onError);
  rule = new db.StyleRule({
    name: '.has_key() is deprecated, use ‘in’',
    language_id: pythonLang,
    regex_match: '\\d*\\t*W601.*',
    regex_match_count: '(\\d*)\\t*W601.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'deprecated form of raising exception',
    language_id: pythonLang,
    regex_match: '\\d*\\t*W602.*',
    regex_match_count: '(\\d*)\\t*W602.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: '‘<>’ is deprecated, use ‘!=’',
    language_id: pythonLang,
    regex_match: '\\d*\\t*W603.*',
    regex_match_count: '(\\d*)\\t*W603.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'backticks are deprecated, use ‘repr()’',
    language_id: pythonLang,
    regex_match: '\\d*\\t*W604.*',
    regex_match_count: '(\\d*)\\t*W604.*',
    weight: 0.1
  });
  rule.save(onError);
  rule = new db.StyleRule({
    name: 'invalid escape sequence ‘x’',
    language_id: pythonLang,
    regex_match: '\\d*\\t*W605.*',
    regex_match_count: '(\\d*)\\t*W605.*',
    weight: 0.1
  });
  rule.save(onError);

  console.log("done");

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
    assert.equal(0.1, rule.weight);
  });

};
dbInit();
dbTest();


