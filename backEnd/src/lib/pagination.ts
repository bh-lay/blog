/** *
 * list_count
 * page_cur
 * page_list_num
 * max_page_btn
 * base_url : /blog/list?page={num}&tag=js
 **/
export type paginationParams = {
	list_count: number
	page_cur: number
	page_list_num: number
	max_page_btn: number
	base_url :string
}
export function createPagination (param: paginationParams): string {
  param = param || {}
  const list_count = param.list_count || 0
  const page_cur = param.page_cur || 1
  const page_list_num = param.page_list_num || 15
  const page_num = Math.ceil(list_count / page_list_num)
  const max_page_btn = param.max_page_btn || 50
  const base_url_split = (param.base_url || '').split(/{num}/)
  const base_url_front = base_url_split[0]
  const base_url_end = base_url_split[1] || ''
  let txt = '<ul class="pagination">'

  if (page_cur > 1) {
    txt += '<li class="pagination_prev"><a href="' + base_url_front + (page_cur - 1) + base_url_end + '" >上一页</a></li>'
  } else {
    txt += '<li class="pagination_prev disabled"><span>上一页</span></li>'
  }

  let btn_num = 0,
    start_num = 0
  if (page_num > max_page_btn) {
    start_num =  page_cur - Math.floor(max_page_btn/2)
  }
  
  
  start_num = Math.max(start_num,1)
  for (; start_num < page_num + 1; start_num++) {
    if (start_num != page_cur) {
      txt += '<li><a href="' + base_url_front + start_num + base_url_end + '">'+ start_num +'</a></li>'
    } else {
      txt += '<li class="active"><span>'+ start_num +'</span></li>'
    }
    btn_num++
    if (btn_num >= max_page_btn) {
      break
    }
  }
  if (page_num - page_cur >= 1) {
    txt += '<li class="pagination_next"><a href="' + base_url_front + (page_cur + 1) + base_url_end + '">下一页</a></li>'
  } else {
    txt += '<li class="pagination_next disabled"><span>下一页</span></li>'
  }
  txt += '</ul>'
  return txt
}