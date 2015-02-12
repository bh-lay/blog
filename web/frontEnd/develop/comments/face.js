define(function(){
    var face_config = 'smile grinning smiley blush relaxed wink heart_eyes kissing_heart kissing_heart kissing_closed_eyes kissing flushed grin pensive relieved cry scream angry mask tired_face';
    var face_tpl = ['<div class="face_list">{@each list as it}',
        '<a href="javascript:void(0)" title="${it}"><span class="emoji s_${it}"></span></a>',
	'{@/each}</div>'].join('');
    
    function face(param){
        var html = '';
        var config_arr = face_config.split(/\s/);
        var html = juicer(face_tpl,{
            list: config_arr
        });
        
        var pop = UI.pop({
            title: '贱萌的emoji表情',
            top: param.top,
            left: param.left,
            width: 300,
            html : html
        });
        $(pop.cntDom).on('click','a',function(){
            param.onSelect && param.onSelect($(this).attr('title'));
        });
    }
    return face;
});