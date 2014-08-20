
//引入app框架
var app_factory = require('../sys/lofox/index.js');
//创建app
var app = new app_factory(3000);

app.set('staticFileRoot','../web/')

app.get('/', function(data,connect){
  connect.write('html',200,'hello world from bh-lay.com!');
});
app.get('/blog', function(data,connect){
  connect.write('html',200,'hello blog world from bh-lay.com!');
});