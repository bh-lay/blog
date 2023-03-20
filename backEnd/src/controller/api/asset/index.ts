/**
 * @author bh-lay
 */
import fileList from './file-list'
import rename from './rename'
import remove from './remove'
import upload from './upload'

export default {
  post: upload,
  delete: remove,
  get: fileList,
  put: rename
}
