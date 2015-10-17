if(self != top){
	parent.location.href = '/admin/login';
}

var emailIpt = $('input[name=email]');
var passwordIpt = $('input[name=password]');

emailIpt.focus();

function getData(){
	var email = emailIpt.val();
	var password = passwordIpt.val();
	if(email.length < 1){
		alert('二逼，快输用户名！');
		emailIpt.focus();
		return false;
	}
	if(password.length < 1){
		alert('忘写密码了吧，二货！');
		passwordIpt.focus();
		return false;
	}
	return {
		'email' : email,
		'password' : password
	};
}
$('form').submit(function(){
	var data = getData();
	if(!data){
		return;
	}
	$.ajax({
		'url':'/ajax/user/login',
		'type':'POST',
		'data' : data,
		'success' : function(d){
			if(d.code==200){
				alert('恭喜二货，登陆成功啦！');
				window.location.href = '/admin';
			}else{
				alert(d.msg);
			}
		}
	});
	return false;
});
