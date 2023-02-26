/*
 * @author bh-lay
 */

import DB from '@/core/DB'

let showdown  = require('showdown')
type detail = {
	content?: string
}
export default async function (articleID: string, format: string) {
	let resJSON={
		code: 200,
		id : articleID,
		format : format,
		msg: '',
		detail: {} as detail
	}
	const { collection, client } = await DB.getCollection('article')
	const docs = await collection.find({
		id:articleID
	}).toArray()
	
	client.close()
	if(docs.length === 0){
		resJSON.code = 2
		resJSON.msg = 'could not find this blog !'
	} else {
		resJSON.detail = docs[0]
		if(format === 'html'){
			var converter = new showdown.Converter()
			// converter.setOption('noHeaderId', true)
			resJSON.detail.content = converter.makeHtml(resJSON.detail.content)
		}
	}
	return resJSON
}