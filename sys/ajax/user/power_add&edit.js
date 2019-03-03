/**
 * @author bh-lay
 * 
 * demo $.post('/ajax/user',{},function(d){console.log(d)})
 */

var DB = require('../../core/DB.js')
function add(parm,res_this){
	DB.getCollection('power')
		.then(({collection, closeDBConnect}) => {
			collection.find({}, {}).toArray(function() {
				collection.insert(parm,function(){
					res_this.json({
						'code' : 1 ,
						'id' : parm.id ,
						'msg' : 'sucess'
					})
					closeDBConnect()
				})
			})
		})
}

function edit(parm,res_this){
	DB.getCollection('power')
		.then(({collection, closeDBConnect}) => {
			collection.updateOne({'id':parm.id}, {$set:parm}, function(err,docs) {
				if(err) {
					res_this.json({
						'code' : 2 ,
						'msg' : 'modified failure !'
					})
				}else {
					res_this.json({
						'code' : 1,
						'msg' : 'modified success !'
					})
				}
				closeDBConnect()
			})
		})
}

exports.render = function (req, res_this){
	res_this.json({
		'code' : 2,
		'msg' : 'please insert complete code !'
	})
}
