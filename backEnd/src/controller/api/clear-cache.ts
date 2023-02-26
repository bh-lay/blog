/**
 * @author bh-lay
 */
import { Connect, routeItemMatched, App } from "@/core/types"
import { parseRequestBody } from "@/core/utils/parse"

export default async function(route: routeItemMatched, connect: Connect, app: App){
	if(connect.request.method != 'POST'){
		connect.writeJson({
			code : 201,
			msg : 'please use POST to clear cache !'
		})
		return
	}
	// FIXME: add power check
	const { params } = await parseRequestBody(connect.request)
	var typeStr = params.type as string || ''
	app.cache.clear(typeStr)
	connect.writeJson({
		code: 200,
		msg : 'clear cache :[' + typeStr + '] completely !'
	})
}
