


//使用hash
fis.match('*.{js,css,jpg,png,less,gif,svg,eot,ttf,woff,woff2}', {
  useHash: true,
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

 //
fis.match('**', {
  release: 'asset/build/multi-page/$0'
});

fis.media('production').match('*', {
  domain: 'http://static.bh-lay.com'
});


fis.match('*.html', {
  release: '../sys/views/multi-page/$0'
});
