


//使用hash
fis.match('*.{js,css,jpg,png,less,gif,svg,eot,ttf,woff,woff2}', {
  useHash: true
});

  // fis-parser-less 插件进行解析
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

//
fis.match('**', {
  release: 'asset/build/admin/$0'
});

fis.match('*.html', {
  release: '../sys/views/admin/$0'
});



// 只需要编译 html 文件，以及其用到的资源。
fis.hook('cmd', {
  baseUrl: './'
});

fis.match('::packager', {
  postpackager: fis.plugin('loader')
});


// 注意： fis 中的 sea.js 方案，不支持部分打包。
// 所以不要去配置 packTo 了，运行时会报错的。
fis
  .media('production')
    .match('/**.js', {
    // 通过 uglify 压缩 js
    optimizer: fis.plugin('uglify-js')
  })
  .match('::packager', {
    postpackager: fis.plugin('loader', {
      allInOne: {
        includeAsyncs: true,
        ignore: ['sea.js','jquery.js','bootstrap/js/bootstrap.js']
      }
    })
  })
  // //线上使用CDN
  // .media('production').match('*', {
  //   // domain: 'http://static.bh-lay.com'
  // });

