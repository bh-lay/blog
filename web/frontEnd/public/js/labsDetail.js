/**
 * opus detail
 *  
 */
seajs.use('/frontEnd/util/tie.js',function(){
	util.tie({
		'dom' : $('.labs_detail_bar_body'),
		'scopeDom' : $('.labs_detail_cnt'),
		'fixed_top' : 30
	});
	$.getScript('/frontEnd/lib/juicer.js',function(){
		$.getScript('/frontEnd/lib/github/reposWidge.js');
	});
});