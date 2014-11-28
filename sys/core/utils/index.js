
var juicer = require('juicer');

juicer.set({
    'tag::operationOpen': '{{@',
    'tag::operationClose': '}}',
    'tag::interpolateOpen': '${{',
    'tag::interpolateClose': '}}',
    'tag::noneencodeOpen': '$${{',
    'tag::noneencodeClose': '}}',
    'tag::commentOpen': '{{#',
    'tag::commentClose': '}}'
});


exports.juicer = juicer;
exports.pagination = require('./pagination.js');