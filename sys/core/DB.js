/**
 * @author bh-lay
 */


let mongodb = require('mongodb')
const mongoConig = require('./../conf/app_config').mongo
const mongoConnectUrl = `mongodb://${mongoConig.host}:${mongoConig.port}/${mongoConig.dbName}`


const getConnect = () => {
	var MongoClient = require('mongodb').MongoClient
	return new Promise((resolve, reject) => {
		MongoClient.connect(mongoConnectUrl, {
			useNewUrlParser: true,
			auth: {
				user: mongoConig.user,
				password: mongoConig.pass
			}
		}, (err, client) => {
			if (err) {
				reject()
			} else {
				resolve(client)
			}
		})
	})
}

const getCollection = (collectionName) => {
	return getConnect()
		.then(client => {
			var db = client.db(mongoConig.dbName)
			const collection = db.collection(collectionName)
			
			return {
				collection,
				closeDBConnect() {
					client.close()
				}
			}
		})
}
module.exports = {
	getConnect,
	getCollection,
	ObjectID: mongodb.ObjectID
}
