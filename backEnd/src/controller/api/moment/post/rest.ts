/*
 * @author bh-lay
 */
import publish from './publish'
import detail from './detail'
import update from './update'
import remove from './remove'

export default {
  post: publish,
  delete: remove,
  get: detail,
  put: update
}