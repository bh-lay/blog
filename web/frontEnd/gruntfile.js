module.exports = function(grunt){
	var transport = require('grunt-cmd-transport');
	var style = transport.style.init(grunt);
	var text = transport.text.init(grunt);
	var script = transport.script.init(grunt);

	//
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			'copyAll': {
				cwd: 'develop/',
				src: ['**/*.css','**/*.js','**/*.png','**/*.jpg','**/*.gif','**/*.eot','**/*.svg','**/*.ttf','**/*.woff'],
				dest: 'build/',
				expand: true
			},
			/**
			 * 从临时目录dist 取回 合并后的seajs文件至build环境中
			 */
			'seaJS' :{
				cwd: 'dist/',
				src: ['**/*.js'],
				dest: 'build/',
				expand: true
				
			}
		},
		transport : {
			options : {
				paths : ['develop/'],
				alias : '<%= pkg.spm.alias %>',
				parsers : {
					'.js' : [script.jsParser],
					'.css' : [style.css2jsParser],
					'.html' : [text.html2jsParser]
				}
			},
			common:{
				options:{
					idleading:''
				},
				files:[{
					expand:true,
					cwd:"develop/",
					src:["**/*.js"],
					filter:"isFile",
					dest:"build/",
					ext:'.js'
				}]
			}
		},
		concat:{
			options : {
				paths : ['build'],
				include : 'relative',
				alias : '<%= pkg.spm.alias %>'
			},
			/**
			 * 从build环境中合并seajs文件至临时目录dist
			 */
			common:{
				options:{
					include : 'all'
				},
				files:[{
					expand:true,
					cwd:'build/',
					src:['**/*.js'],
					dest:'dist/',
					ext:'.js'
				}]
			}
 		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			common: {
				expand: true,
				cwd:'build/',
				src: ['**/*.js', '!**/*.min.js'],
				dest: 'build/',
				ext:".js"
			}
		},
		cssmin: {
			options: {  
				keepSpecialComments: 0  
			},  
			common: {
				expand: true,
				cwd: 'build/',
				src: ['**/*.css', '**/!*.min.css'],
				dest: 'build/',
				ext: '.css'
			}
		}
	});

	//
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-cmd-concat');
	
	
 	//抽出saejs模块
	grunt.registerTask('transports', ['transport:common']);
 	//合并saejs模块
	grunt.registerTask('concats', ['concat:common']);
 	//复制所有可用文件
 	grunt.registerTask('copyAll', ['copy:copyAll']);
 	//复制saejs模块
	grunt.registerTask('copySeajs', ['copy:seaJS']);
	//压缩css、js（混淆）
	grunt.registerTask('min', ['uglify','cssmin']);
	//一键完成
	grunt.registerTask('default', [
		'transport:common',
		'concat:common',
		'copy:copyAll',
		'copy:seaJS',
		'uglify:common',
		'cssmin:common'
	]);
}
