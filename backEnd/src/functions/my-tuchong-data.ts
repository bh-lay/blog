import DB from '@/core/DB'
import request from 'request'

var collectionName = 'cache',
	mongon_ID = 'tuchong_bh-lay',
	clientUserAgent = 'bh-lay api Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36'


	type tuchongData = {
		post_list: []
	}
// 从数据库读取
export async function getTuchongData(){
	const { collection, client } = await DB.getCollection(collectionName)
	const docs = await collection.find({
		id : mongon_ID
	}).toArray()
	client.close()

	if (!docs || docs.length === 0) {
	// 若不存在，则从 720yun 上获取
		return updateFromTuchong()
	}
	return docs[0] as tuchongData
}
// 保存到数据库
async function saveDataToDataBase(data: Record<string, unknown>){
	data.id = mongon_ID
	const { collection, client } = await DB.getCollection(collectionName)
	// 查询用户信息
	const count = await collection.countDocuments({
		id : mongon_ID
	})
	if(count > 0){
		// 条数存在，则直接更新
		collection.updateOne({
			id: mongon_ID
		}, {
			$set: data
		}, function() {
			client.close()
		})
	}else{
		// 不存在则插入为新数据
		collection.insertOne(data,function(){
			client.close()
		})
	}
}

// 从720yun更新数据
export function updateFromTuchong(): Promise<tuchongData>{
	return new Promise((resolve, reject) => {
		request({
			url: 'http://bh-lay.tuchong.com/rest/2/sites/1785007/posts?count=40&page=1&before_timestamp=0',
			headers: {
				'User-Agent': clientUserAgent,
				'Referer': 'https://bh-lay.tuchong.com/'
			}
		}, function (err, response, body){
			response = response || {}
			if (err) {
				return reject(err)
			}
			if (response.statusCode !== 200) {
				return reject(new Error('error'))
			}
			try {
				var userData = JSON.parse( body || {} ) as tuchongData
				resolve(userData)
				// 保存到数据库
				saveDataToDataBase(userData)
			} catch (e) {
				reject(new Error('parse error',))
			}
		})
	})
}
