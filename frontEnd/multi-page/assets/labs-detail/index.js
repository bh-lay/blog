/**
 * labs detail
 *
 */
import "./index.less";

(function(){
	//下载部分
	var btn = $('.labs_detail_download_link a');
	btn.eq(0).addClass('active');

	btn.mouseover(function(){//点击圆点按钮效果
		var index = $(this).index();
		$('.labs_detail_download_linkTxt ul:first').stop().animate({
			'marginLeft' : '-' + index + '00%'
		},200);
		btn.removeClass('active');
		btn.eq(index).addClass('active');
	});
	//处理github异步数据
	function getRepoData(input,callback){
    var split_array = input.match(/(?:^|\/)([^\/]+)\/([^\/]+)/);
    if (!split_array) {
    	return
		}
		var user_login = split_array[1],
        repos_name = split_array[2];
		$.ajax({
			url: 'https://api.github.com/repos/' + user_login + '/' + repos_name,
			dataType: 'jsonp',
			success: function(d){
				var repo = d.data || {};
                repo['user_login'] = user_login;
                repo['repos_name'] = repo.name || repos_name;
                repo['repos_watchers_count'] = repo.watchers_count || 0;
                repo['repos_forks_count'] = repo.forks_count || 0;
                repo['repos_stargazers_count'] = repo.stargazers_count || 0;
                repo['repos_watchers_count'] = repo.watchers || 0;
                callback && callback(repo);
			}
		});
	}
	var repos_name = $('.labs_detail_github').attr('data-repo');
	getRepoData(repos_name,function(data){
		var temp = $('#github-temp').html();
        var this_html = temp.replace(/{(\w*)}/g,function(a,b){
            return data[b] || '0';
        });
        $('.labs_detail_github .labsDeGit_cnt').html(this_html);
	});

  //代码高亮
  $('pre').each(function(){
      hljs.highlightBlock(this);
  });
})();
