


//清除其他配置，只剩下如下配置
fis.match('*.{js,css,png,less,gif,svg}', {
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


//启用插件 
fis.hook('relative'); 

//让所有文件，都使用相对路径。 
fis.match('**', {
  relative: true
})