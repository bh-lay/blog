module.exports = function(grunt){

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
				expand: true,
				cwd:'develop/',
                src: '**/*.js',
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
				cwd: 'develop/',
				src: ['**/*.css', '**/!*.min.css'],
				dest: 'build/',
				ext: '.css'
			}
		},
		copy: {
			build: {
				cwd: 'develop/',
				src: ['**/*.png','**/*.jpg','**/*.eot','**/*.svg','**/*.ttf','**/*.woff'],
				dest: 'build/',
				expand: true
		  },
		},
    });

    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // 默认任务
    grunt.registerTask('default', ['uglify','cssmin,copy']);
}