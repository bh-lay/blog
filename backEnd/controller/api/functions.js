/**
 * @author bh-lay
 */
let my720Data = require('../../functions/my720Data.js')
let myTuchongData = require('../../functions/myTuchongData.js')
let moment = require('../../functions/moment/index.js')

function isAdmin (connect, successFn, failFn) {
	connect.session(function (session_this) {
		if (session_this.get('user_group') == 'admin') {
			successFn && successFn()
		} else {
			failFn && failFn()
		}
	})
}
module.exports = function (route, connect,app) {
	var act = route.params.act
	isAdmin(connect, function () {
		var responseJson = {
			code: 200,
			msg: 'update success !'
		}
		switch (act) {
		case 'update720yun':
			my720Data.update()
			break
		case 'updateTuchong':
			myTuchongData.update()
			break
		case 'syncMoment':
			moment.sync()
			break
		default:
			responseJson.code = 203
			responseJson.msg = 'wrong action !'
		}
		connect.write('json', responseJson)
	}, function () {
		connect.write('json', {
			'code': 201,
			'msg': 'no power !'
		})
	})
}
