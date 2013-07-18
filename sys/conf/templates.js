/**
 * @author bh-lay
 */

module.exports = {
	'index' : {
		'reg' : /^(\/|)$/,
		'require' : './templates/index.js',
		'src' : './templates/index.html',
	},
	'blogList' : {
		'reg': /^\/blog(\/|)$/,
		'require' :'./templates/blogList.js',
		'src' : './templates/blogList.html',
	},
	'blogDetail' : {
		'reg': /^\/blog\/(\w+)/,
		'require' :'./templates/blogDetail.js',
		'src' : './templates/blogDetail.html',
	},
	'shareList' : {
		'reg': /^\/share(\/|)$/,
		'require' :'./templates/shareList.js',
		'src' : './templates/shareList.html',
	},
	'shareDetail' : {
		'reg': /^\/share\/(\w+)/,
		'require' :'./templates/shareDetail.js',
		'src' : './templates/shareDetail.html',
	},
	'opusList' : {
		'reg': /^\/opus(\/|)$/,
		'require' :'./templates/opusList.js',
		'src' : './templates/opusList.html',
	},
	'opusDetail' : {
		'reg': /^\/opus\/(\w+)/,
		'require' :'./templates/opusDetail.js',
		'src' : './templates/opusDetail.html',
	},
};