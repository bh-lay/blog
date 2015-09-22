


//清除其他配置，只剩下如下配置
fis.match('*.{js,css,jpg,png,less,gif,svg,eot,ttf,woff,woff2}', {
  useHash: true,
});

fis.match('*.less', {
  // fis-parser-less 插件进行解析
  parser: fis.plugin('less'),
  // .less 文件后缀构建后被改成 .css 文件
  rExt: '.css'
});


fis.match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});

fis.match('*.css', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});

 
fis.match('**', {
  release: 'asset/build/multi-page/$0'
})

fis.match('*.html', {
  release: '../sys/views/multi-page/$0'
});
