import DB from '@/core/DB'
import request from 'request'
var collectionName = 'cache',
	mongon_ID = '720yun_bh-lay',
	clientUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36'


type panoData = {
	data: {
		list: any[]
	}
}
// 从数据库读取
export async function get720Data() {
	const { collection, client } = await DB.getCollection(collectionName)
	const docs = await collection.find({
		id: mongon_ID
	}).toArray()
	client.close()

	if (!docs || docs.length === 0) {
		// 若不存在，则从 720yun 上获取
		return updateFrom720()
	}
	return docs[0] as panoData
}

// 保存到数据库
async function saveDataToDataBase(data: Record<string, unknown>) {
	data.id = mongon_ID
	const { collection, client } = await DB.getCollection(collectionName)
	// 计算条数
	const count = await collection.countDocuments({
		id: mongon_ID
	})
	if (count > 0) {
		// 条数存在，则直接更新
		collection.updateOne({
			id: mongon_ID
		}, {
			$set: data
		}, function () {
			client.close()
		})
	} else {
		// 不存在则插入为新数据
		collection.insertOne(data, function () {
			client.close()
		})
	}
}
// 从720yun更新数据
export function updateFrom720(): Promise<panoData> {
	return new Promise((resolve, reject) => {
		request({
			url: 'https://apiv4.720yun.com/author/19023widcyv/products?sort=0&page=1&selected=2',
			method: 'GET',
			headers: {
				'User-Agent': clientUserAgent,
				'Accept': 'application/json, text/plain, */*',
				'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-US;q=0.7',
				'Access-Control-Request-Headers': 'app-authorization,app-key',
				'Access-Control-Request-Method': 'GET',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive',
				'Host': 'apiv4.720yun.com',
				'Origin': 'https://720yun.com',
				'Pragma': 'no-cache',
				'Referer': 'https://720yun.com/u/19023widcyv',
				'App-Authorization': '',
				'App-Key': 'eByjUyLDG2KtkdhuTsw2pY46Q3ceBPdT'
			}
		}, function (err, response, body) {
			response = response || {}
			if (err) {
				return reject(err)
			}
			if (response.statusCode !== 200) {
				return reject(new Error('error'))
			}
			try {
				var userData = JSON.parse(body || {})
				resolve(userData)
				// 保存到数据库
				saveDataToDataBase(userData)
			} catch (e) {
				reject(new Error('parse error',))
			}
		})
	})
}