/***
 * 使用ajax提交表单
 * 
 **/
define(function(){
  function formToAjax(dom,param){
    var this_form = this;
    var param = param || {};
    var formDom = null;
    if(dom[0].tagName == 'FORM'){
      formDom = dom;
    }else{
      formDom = dom.find('form');
    }

    if(formDom.length == 0){
      console.log('找不到<form>');
      return
    }
    this.formDom = formDom;
    this.action = this.formDom.attr('action');
    this.method = this.formDom.attr('method') || 'GET';
    this.method = this.method.toUpperCase();
    this.onSubmit = param['onSubmit'] || null;
    this.onResponse = param['onResponse'] || null;

    this.formDom.on("submit", function(event) {
      this_form.submit();
      return false
    });
  }
  formToAjax.prototype = {
    'getData' : function(){
      var output = {};
      this.formDom.find('input,textarea').each(function(){
        var ipt = $(this);
        var name = ipt.attr('name');
        var type = ipt.attr('type');
        if(!name){
          return
        }
        if(type == 'radio' || type == 'checkbox'){
          //FIXME 单选框或复选框
        }else if(type == 'file'){
          console.log('丢弃文件域！');
        }else{
          var value = ipt.val();
          output[name] = value;
        }
      });
      this.formDom.find('select').each(function(){
        //FIXME 下拉框
      });
      return output;
    },
    'submit' : function(){
      var this_form = this;
      var data = this.getData();
      if(this.onSubmit){
        var check = this.onSubmit(data);
        if(check == false){
          //console.log('不提交');
          return
        }
      }
      //console.log('提交');
      $.ajax({
        'url' : this.action,
        'type' : this.method,
        'data' : data,
        'success' : function(data){
          this_form.onResponse && this_form.onResponse(data);
        }
      });
    }
  };
  return formToAjax;
});