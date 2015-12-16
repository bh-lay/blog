


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

//发布位置
fis.match('**', {
  release: 'build/multi-page/$0',
  domain: 'http://127.0.0.1:8088'
});
fis.match('**.psd', {
  release: false
});
fis.match('*.html', {
  release: '../sys/views/multi-page/$0'
});



//线上使用CDN
fis.media('production').match('*', {
  domain: '//dn-lay.qbox.me'
  // domain: '//127.0.0.1:8088'
});