/**
 * @author bh-lay
 */

exports.json = function(res,data){
	
	res.statusCode = 200 ;
	res.setHeader('Content-Type','application/json');
	res.setHeader('charset','utf-8');
	
	res.write(JSON.stringify(data));
	res.end();
	
}
