


//清除其他配置，只剩下如下配置
fis.match('*.{js,css,jpg,png,less,gif,svg}', {
  useHash: true,
});

fis.match('*.less', {
  // fis-parser-less 插件进行解析
  parser: fis.plugin('less'),
  // .less 文件后缀构建后被改成 .css 文件
  rExt: '.css'
});
//发布位置
fis.match('**', {
  release: 'build/aboutme_old/$0',
  domain: 'http://127.0.0.1:8088'
});
fis.match('index.html', {
  release: '../web/topic/aboutme_old/index.html'
});

fis.match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});

fis.match('*.css', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});


//线上打包
fis
  .media('production')
  .match('/**.js', {
    // 通过 uglify 压缩 js
    optimizer: fis.plugin('uglify-js')
  })
  //CSS压缩
  .match('*.less', {
    optimizer: fis.plugin('clean-css')
  })
  //使用hash
  .match('*.{js,css,jpg,png,less,gif,svg,eot,ttf,woff,woff2}', {
    useHash: true
  })
  //线上使用CDN
  .media('production').match('*', {
    domain: '//dn-lay.qbox.me'
    // domain: '//127.0.0.1:8088'
  });
