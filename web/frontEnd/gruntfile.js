module.exports = function(grunt){
	var transport = require('grunt-cmd-transport');
	var style = transport.style.init(grunt);
	var text = transport.text.init(grunt);
	var script = transport.script.init(grunt);

	//
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			build: {
				cwd: 'develop/',
				src: ['**/*.css','**/*.js','**/*.png','**/*.jpg','**/*.eot','**/*.svg','**/*.ttf','**/*.woff'],
				dest: 'build/',
				expand: true
			},
		},
		transport : {
			options : {
				paths : ['build/'],
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
					cwd:"build/",
					src:["**/*.js"],
					filter:"isFile",
					dest:"build/",
					ext:".js"
				}]
			}
		},
		concat:{
			options : {
				paths : ['build/'],
				include : 'relative',
				alias : '<%= pkg.spm.alias %>'
			},
			common:{
				options:{
					include : 'all'
				},
				files:[{
					expand:true,
					cwd:'build/',
					src:['**/*.js'],
					dest:'build/',
					ext:'.js'
				}]
			},
 		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				expand: true,
				cwd:'build/',
				src: ['**/*.js', '**/!*.min.js'],
				dest: 'build/',
				ext:".js"
			}
		},
		cssmin: {
			options: {  
				keepSpecialComments: 0  
			},  
			minify: {
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

 //
	grunt.registerTask('copy', 'copy');
	grunt.registerTask('seajs', ['transport','concat']);
	grunt.registerTask('min', ['uglify','cssmin']);
//	grunt.registerTask('default', ['copy']);
}