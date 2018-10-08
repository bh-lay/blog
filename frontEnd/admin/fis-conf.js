


//使用hash
fis.match('*.{js,css,jpg,png,less,gif,svg,eot,ttf,woff,woff2}', {
  useHash: true
});

//CSS压缩
fis.match('*.css', {
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

//发布位置
fis.match('**', {
  release: 'build/admin/$0',
  domain: 'http://127.0.0.1:8088'
});
fis.match('/index.html', {
  release: '../sys/views/admin/index.html'
});
fis.match('login.html', {
  release: '../sys/views/admin/login.html'
});



// 只需要编译 html 文件，以及其用到的资源。
fis.hook('cmd', {
  baseUrl: './'
});

fis.match('::packager', {
  postpackager: fis.plugin('loader')
});


//线上打包
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
  //线上使用CDN
  .media('production').match('*', {
    domain: 'http://static.bh-lay.com'
  });
