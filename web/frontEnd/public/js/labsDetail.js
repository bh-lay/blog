/**
 * opus detail
 *  
 */
seajs.use([
	'/frontEnd/util/tie.js',
	'/frontEnd/lib/highlight/highlight.pack.js'
],function(){
	util.tie({
		'dom' : $('.labs_detail_bar_body'),
		'scopeDom' : $('.labs_detail_cnt'),
		'fixed_top' : 30
	});
	
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
	$(function(){
		L.nav();
		L.nav.setCur('labs');
	});
	//处理github异步数据
	function getRepoData(repo_name,callback){
		$.ajax({
			url: 'https://api.github.com/repos/' + repo_name,
			dataType: 'jsonp',
			success: function(d){
				var repo = d.data;
				if(d && d.status != 200){
					callback && callback(data.message || '受限');
				}else{
					callback && callback(null,repo);
				}
			} 
		});
	}
	function getUserData(username,callback){
		$.ajax({
			url: 'https://api.github.com/users/' + username,
			dataType: 'jsonp',
			success: function(d){
				var user = d.data;
				callback && callback(null,user);
			} 
		});
	}
	var repos_name = $('.labs_detail_github').attr('data-repo');
	var this_data = {};
	getRepoData(repos_name,function(err,data){
		if(err){
			$('.labs_detail_github .labsDeGit_cnt').html('<p>github限制了你的数据抓取！</p>');
			return
		}
		var temp = $('#github-temp').html();
		this_data['user_avatar'] = data.owner.avatar_url;
		this_data['user_login'] = data.owner.login;
		this_data['repos_name'] = data.name;
		this_data['repos_watchers_count'] = data.watchers_count;
		this_data['repos_forks_count'] = data.forks_count;
		this_data['repos_stargazers_count'] = data.stargazers_count;
		this_data['repos_watchers_count'] = data.watchers;
		getUserData(this_data['user_login'],function(err,user_data){
			this_data['user_repos_count'] = user_data.public_repos;
			this_data['user_followers_count'] = user_data.followers;
			this_data['user_following_count'] = user_data.following;
			this_data['user_name'] = user_data.name;
			var this_html = temp.replace(/{(\w*)}/g,function(a,b){
				if(typeof(this_data[b]) == 'undefined'){
					return '====';
				}else{
					return this_data[b];
				}
				
			});
		//	console.log(this_data,'-----------');
			$('.labs_detail_github .labsDeGit_cnt').html(this_html);
			
		});
	});
	
	//demo部分
	function autoHeight(){
		var winH = $(window).height();
		$('.labs_detail_demo').height(winH);
	}
	autoHeight();
	$(window).resize(function(){
		autoHeight();
	});
	//代码高亮
	hljs.initHighlighting();
});

window.L = window.L || {};
/**
 * L.nav()
 * 
 */
(function(ex){
	var init=function(){
		$('.nav_tool a').click(function(){
			if($('.navLayer').hasClass('nav_slidedown')){
				$('.navLayer').removeClass('nav_slidedown');
			}else{
				$('.navLayer').addClass('nav_slidedown');
			}
		});

		$('.nav_mainList').on('click',function(){
			if($('.navLayer').hasClass('nav_slidedown')){
				$('.navLayer').removeClass('nav_slidedown');
			}else{
				//貌似不需要else
			}
		});
	};

	var setCur = function(page){
		if(page == '/'){
			page = 'index';
		}
		$('.navLayer .nav li').removeClass('cur');
		$('.navLayer .nav li[page='+page+']').addClass('cur');
	};
	ex.nav = init;
	ex.nav.setCur = setCur;
})(L);