import { Connect, routeItemMatched } from '@/core/index'
import formidable from 'formidable'
import { promises as fs } from 'fs'

export async function upload (route: routeItemMatched, connect: Connect) {

  const { files } = await connect.parseRequestBody()

  if (!files) {
    return connect.writeJson({
      code : 201
    })
  }

  let fileList: formidable.File[] = []
  if (Array.isArray(files.file)) {
    fileList = files.file
  } else {
    fileList = [files.file]
  }
  type file = {
    name: string,
    url: string
  }
  const json: {code: number, files: file[]} = {
    code:200,
    files: []
  }
  const newFiles: file[] = []
  fileList.forEach(file => {
    fs.unlink(file.filepath)
    newFiles.push({
      name : 'upload.jpg',
      url : '//static.bh-lay.com/demo/upload.jpg'
    })
  })
  json.files = newFiles
  connect.writeJson(json)
}
