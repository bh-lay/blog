


//使用hash
fis.match('*.{js,css,jpg,png,less,gif,svg,eot,ttf,woff,woff2}', {
  useHash: true
});

//less编译
fis.match('*.less', {
  // fis-parser-less 插件进行解析
  parser: fis.plugin('less'),
  // .less 文件后缀构建后被改成 .css 文件
  rExt: '.css'
});

//PNG压缩
fis.match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});

//CSS压缩
fis.match('*.css', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});

fis.match('tool/*.js', {
  isMod: true
});
fis.match('view/*.js', {
  isMod: true
});
fis.match('publish/*.js', {
  isMod: true
});
fis.match('gallery/*.js', {
  isMod: true
});
fis.match('app.js', {
  isMod: true
});
fis.hook('cmd', {
  // baseUrl: './'
});
fis.match('::packager', {
  postpackager: fis.plugin('loader', {
    // allInOne: {
    //   includeAsyncs: true,
    //   ignore: ['sea.js','jquery.js','bootstrap/js/bootstrap.js']
    // }
  })
});
//
fis.match('**', {
  release: 'asset/build/admin/$0'
});

fis.match('*.html', {
  release: '../sys/views/admin/$0'
});

//线上使用CDN
fis.media('production').match('*', {
  domain: 'http://static.bh-lay.com'
});