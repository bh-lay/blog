//author bh-lay

var fs = require('fs');
var tpl = fs.readFileSync('./templates/admin/user/power.html', "utf8");

exports.render = function (req,res_this){

	res_this.html(200,tpl);

}
