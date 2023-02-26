/*
 * @author bh-lay
 */
import detail from './detail'
import update from './update'
import publish from './publish'
import remove from './remove'

export default {
	post: publish,
	delete: remove,
	get: detail,
	put: update
}