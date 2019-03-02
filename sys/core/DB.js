/**
 * @author bh-lay
 */


let mongodb = require('mongodb')
const mongoConig = require('./../conf/app_config').mongo
const mongoConnectUrl = `mongodb://${mongoConig.host}:${mongoConig.port}`


const getConnect = () => {
	var MongoClient = require('mongodb').MongoClient
	return new Promise((resolve, reject) => {
		MongoClient.connect(mongoConnectUrl, function (err, client) {
			if (err) {
				reject()
			} else {
				resolve(client)
			}
		})
	})
}
const getCollection = (collectionName) => {
	var MongoClient = require('mongodb').MongoClient
	return new Promise((resolve, reject) => {
		MongoClient.connect(mongoConnectUrl, {
			useNewUrlParser: true
		}, (err, client) => {
			if (err) {
				reject()
			} else {
				var db = client.db(mongoConig.dbName)
				const collection = db.collection(collectionName)
				resolve({
					collection,
					closeDBConnect() {
						client.close()
					}
				})
			}
		})
	})
}
module.exports = {
	getConnect,
	getCollection,
	ObjectID: mongodb.ObjectID
}
