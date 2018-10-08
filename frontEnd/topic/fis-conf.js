
// 静态资源均使用hash
fis.match('*.{js,css,jpg,png,less,gif,svg}', {
  useHash: true,
});
// 解析 less
fis.match('*.less', {
  parser: fis.plugin('less'),
  rExt: '.css'
});


// 配置发布位置
fis.match('**', {
  release: 'build/topic/$0',
  domain: 'http://127.0.0.1:8088'
});
fis.match('**/*.html', {
  release: '../web/topic/$0'
});

//线上打包
fis.media('production')
    // 压缩 JS
    .match('/**.js', {
      optimizer: fis.plugin('uglify-js')
    })
    // 压缩CSS
    .match('*.less', {
      optimizer: fis.plugin('clean-css')
    })
    // 压缩 PNG
    .match('*.png', {
      optimizer: fis.plugin('png-compressor')
    })
    // 线上使用 CDN 域名
    .match('*', {
        domain: 'http://static.bh-lay.com'
    });
