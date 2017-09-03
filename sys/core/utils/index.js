
var juicer = require('juicer');

juicer.set({
  'tag::operationOpen': '[[@',
  'tag::operationClose': ']]',
  'tag::interpolateOpen': '$[[',
  'tag::interpolateClose': ']]',
  'tag::noneencodeOpen': '$$[[',
  'tag::noneencodeClose': ']]',
  'tag::commentOpen': '[[#',
  'tag::commentClose': ']]'
});


exports.juicer = juicer;
exports.parse = require('./parse.js');
exports.pagination = require('./pagination.js');
exports.trim = function(str){
  return (str || '').replace(/^\s*|\s*$/g,'');
};
//生成ID
exports.createID = function(){
  var date = new Date(),
      id = date.getTime().toString(16);
  return id;
};

exports.encodeHtml = function(s){
  return (typeof s != "string") ? s : s.replace(/"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g,function($0){
    var c = $0.charCodeAt(0), r = ["&#"];
    c = (c == 0x20) ? 0xA0 : c;
    r.push(c); r.push(";");
    return r.join("");
  });
};