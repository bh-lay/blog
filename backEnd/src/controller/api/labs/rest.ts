/*
 * @author bh-lay
 */
import detail from './detail'
import update from './update'
import remove from './remove'
import publish from './publish'

export default {
  get: detail,
  post: publish,
  put: update,
  delete: remove
}
