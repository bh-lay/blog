/**
 * Original: https://github.com/JoelSutherland/GitHub-jQuery-Repo-Widget
 * Modify by tsl0922@gmail.com 
 */

var gitWidget = gitWidget || {};

(function(exports){
	var style = ['<style type="text/css">',
		'.github-box{font-family:helvetica,arial,sans-serif;font-size:13px;line-height:18px;background:#fafafa;border:1px solid #ddd;color:#666;border-radius:3px;margin : 0px 10px 40px}',
		'.github-box a{color:#4183c4;border:0;text-decoration:none}',
		'.github-box .github-box-title{position:relative;border-bottom:1px solid #ddd;border-radius:3px 3px 0 0;background:#fcfcfc;background:-moz-linear-gradient(#fcfcfc,#ebebeb);background:-webkit-linear-gradient(#fcfcfc,#ebebeb);}',
		'.github-box .github-box-title h3{font-family:helvetica,arial,sans-serif;font-weight:normal;font-size:16px;color:gray;margin:0;padding:10px 10px 10px 80px;background:url(/frontEnd/lib/github/github_logo.gif) center left no-repeat}',
		'.github-box .github-box-title h3 .repo{font-weight:bold}',
		'.github-box .github-box-title .github-stats{position:absolute;top:8px;right:10px;background:white;border:1px solid #ddd;border-radius:3px;font-size:11px;font-weight:bold;line-height:21px;height:21px;padding-left:2px;}',
		'.github-box .github-box-title .github-stats a{display:inline-block;height:21px;color:#666;padding:0 5px 0 5px;}',
		'.github-box .github-box-title .github-stats .watchers{border-right:1px solid #ddd;background-position:3px -2px;}',
		'.github-box .github-box-title .github-stats .forks{background-position:0 -52px;padding-left:5px}',
		'.github-box .github-box-content{padding:10px;font-weight:300}',
		'.github-box .github-box-content p{margin:0}',
		'.github-box .github-box-content .link{font-weight:bold}',
		'.github-box .github-box-download{position:relative;border-top:1px solid #ddd;background:white;border-radius:0 0 3px 3px;padding:10px;height:24px}',
		'.github-box .github-box-download .updated{margin:0;font-size:11px;color:#666;line-height:24px;font-weight:300}',
		'.github-box .github-box-download .updated strong{font-weight:bold;color:#000}',
		'.github-box .github-box-download .download{position:absolute;display:block;top:10px;right:10px;height:24px;line-height:24px;font-size:12px;color:#666;font-weight:bold;text-shadow:0 1px 0 rgba(255,255,255,0.9);padding:0 10px;border:1px solid #ddd;border-bottom-color:#bbb;border-radius:3px;background:#f5f5f5;background:-moz-linear-gradient(#f5f5f5,#e5e5e5);background:-webkit-linear-gradient(#f5f5f5,#e5e5e5);}',
		'.github-box .github-box-download .download:hover{color:#527894;border-color:#cfe3ed;border-bottom-color:#9fc7db;background:#f1f7fa;background:-moz-linear-gradient(#f1f7fa,#dbeaf1);background:-webkit-linear-gradient(#f1f7fa,#dbeaf1);}',
	'</style>'].join('');
	
	var base_tpl = ['<div class="github-box repo">',
		'<div class="github-box-title">',
			'<h3>',
				'<a class="owner" href="https://github.com/${owner.login}" target="_blank">${owner.login}</a>/',
				'<a class="repo" href="${html_url}" target="_blank">${name}</a>',
			'</h3>',
			'<div class="github-stats">',
				'Watch<a class="watchers" title="Watchers" href="${html_url}/watchers" target="_blank">${watchers}</a>',
				'Fork<a class="forks" title="Forks" href="${html_url}/network" target="_blank">${forks}</a>',
			'</div>',
		'</div>',
		'<div class="github-box-content">',
			'<p class="description">${description} &mdash; <a href="${html_url}#readme"  target="_blank">More...</a></p>',
			'<p class="link"><a href="${homepage}">${homepage}</a></p>',
			'<table class="issues" width="100%"></table>',
				'</div>',
				'<div class="github-box-download">',
					'<p class="updated"><a href="${html_url}/tree/master" target="_blank"><strong>master</strong>分支</a> 代码最近更新：${pushed_at}</p>',
			'<a class="download" href="${html_url}/zipball/master">下载zip</a>',
			'</div>',
	'</div>'].join('');	
			
	$('head').append(style);
	var html_encode = function(str){
		if(!str || str.length == 0) return "";
		return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}
	function getRepoData(repo_name,callback){
		$.ajax({
			url: 'https://api.github.com/repos/' + repo_name,
			dataType: 'jsonp',
			success: function(d){
				var repo = d.data;
				callback && callback(null,repo);
			} 
		});
	}
	exports.init = function(dom,repo_name){
		getRepoData(repo_name,function(err,data){
			if(err){
				return
			}
			var repo = data;
			console.log(data);
			var this_html = juicer(base_tpl,data);
			var $widget = $(this_html);
			$widget.appendTo(dom);
			return
				var pushed_at = repo.pushed_at.substr(0,10);
            var url_regex = /((http|https):\/\/)*[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
            if(repo.homepage && (m = repo.homepage.match(url_regex))) {
              if(m[0] && !m[1]) repo.homepage = 'http://' + m[0];
            }else {
               repo.homepage = '';
            }
				
				
				if(repo.has_issues && repo.open_issues > 0) {
					$.ajax({
						url: 'https://api.github.com/repos/' + repo_name + "/issues?state=open&per_page=5&page=1&sort=updated",
						dataType: 'jsonp',
						success: function(results){
							var issues = results.data;
							var $issues_table = $(".github-box-content table");
							$issues_table.append('<tr><td colspan="2"><a href="' + repo.html_url + '/issues" target="_blank"><strong>Issues</strong></a></td></tr>');
							for(var i=0;i<issues.length;i++) {
								var updated_at = issues[i].updated_at.substr(0,10);
								var txt = ['<tr>',
									'<td class="number" width="30">#' + issues[i].number + '</td>',
									'<td class="info">',
										'<a href="' + issues[i].html_url + '" target="_blank">' + html_encode(issues[i].title) + '</a>',
									'</td>',
									'<td class="author" width="200" align="right">',
										'by <a href="' + issues[i].user.url.replace('api.','').replace('users/','') + '" target="_blank">'
										   + issues[i].user.login + 
										 '</a>',
										 '<em style="font-size: 8pt;font-family: Candara,arial;color: #666;-webkit-text-size-adjust: none;">' + updated_at +'</em>',
									'</td>',
								'</tr>'].join('');
								$issues_table.append(txt);
							}
						}
					});
	    		}
		});
	}
})(gitWidget);

$(function(){
	$('.github_widget').each(function(){
		if($(this).data('repo').length < 1){
			alert('shujuyichang');
			return 
		}
		gitWidget.init($(this),$(this).data('repo'));
	});
});

/**
	var base_tpl = ['<div class="github-box repo">',
		'<div class="github-box-title">',
			'<h3>',
				'<a class="owner" href="' + repo.owner.url.replace('api.','').replace('users/','') + '" target="_blank">' + repo.owner.login  + '</a>',
				'<a class="repo" href="' + repo.url.replace('api.','').replace('repos/','') + '" target="_blank">' + repo.name + '</a>',
			'</h3>',
			'<div class="github-stats">',
				'Watch<a class="watchers" title="Watchers" href="' + repo.url.replace('api.','').replace('repos/','') + '/watchers" target="_blank">' + repo.watchers + '</a>',
				'Fork<a class="forks" title="Forks" href="' + repo.url.replace('api.','').replace('repos/','') + '/network" target="_blank">' + repo.forks + '</a>',
			'</div>',
		'</div>',
		'<div class="github-box-content">',
			'<p class="description">' + html_encode(repo.description) + ' &mdash; <a href="' + repo.url.replace('api.','').replace('repos/','') + '#readme"  target="_blank">More...</a></p>',
			'<p class="link"><a href="' + repo.homepage + '">' + html_encode(repo.homepage) + '</a></p>',
			'<table class="issues" width="100%"></table>',
				'</div>',
				'<div class="github-box-download">',
					'<p class="updated"><a href="' + repo.url.replace('api.','').replace('repos/','') + '/tree/master" target="_blank"><strong>master</strong>分支</a>代码最近更新：' + pushed_at + '</p>',
			'<a class="download" href="' + repo.url.replace('api.','').replace('repos/','') + '/zipball/master">下载zip</a>',
			'</div>',
			'</div>'].join('');	
 */