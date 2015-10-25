/* global fis */



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

//CSS压缩
fis.match('*.css', {
  optimizer: fis.plugin('clean-css')
});

fis.match('js/*.js', {
  isMod: true
});
fis.match('comments/*.js', {
  isMod: true
});
fis.match('/js/sea.js', {
  isMod: false
});

//发布位置
fis.match('**', {
  release: 'build/single-page/$0',
  domain: 'http://127.0.0.1:8088'
});
fis.match('**.psd', {
  release: false
});
fis.match('index.html', {
  release: '../sys/views/single-page/index.html'
});
fis.match('tpl/github.html', {
  release: '../sys/component/single-page/github.html'
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
        ignore: ['/js/sea.js']
      }
    })
  })
  //线上使用CDN
  .media('production').match('*', {
    domain: 'http://static.bh-lay.com'
  });

