module.exports = function(grunt){

    // ��Ŀ����
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
				expand: true,
				cwd:'develop/',
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

    // �����ṩ"uglify"����Ĳ��
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Ĭ������
    grunt.registerTask('default', ['uglify','cssmin','copy']);
}