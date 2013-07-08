/**
 * @author bh-lay
 */

module.exports = [
	{
		'name' : 'index',
		'reg': /^(\/|)$/,
		'require' :'index.js'
	},
	{
		'name' : 'admin',
		'reg': /^\/admin/,
		'require' :'admin.js'
	},
	{
		'name' : 'blogList',
		'reg': /^\/blog(\/|)$/,
		'require' :'blogList.js'
	},
	{
		'name' : 'blogDetail',
		'reg': /^\/blog\/(\w+)/,
		'require' :'blogDetail.js'
	},
	{
		'name' : 'shareList',
		'reg': /^\/share(\/|)$/,
		'require' :'shareList.js'
	},
	{
		'name' : 'shareDetail',
		'reg': /^\/share\/(\w+)/,
		'require' :'shareDetail.js'
	},
	{
		'name' : 'opusList',
		'reg': /^\/opus(\/|)$/,
		'require' :'opusList.js'
	},
	{
		'name' : 'opusDetail',
		'reg': /^\/opus\/(\w+)/,
		'require' :'opusDetail.js'
	},
];