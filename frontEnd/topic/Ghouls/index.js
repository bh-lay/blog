(function(){
function trim(input) {
	return (input || '').replace(/^\s+|\s+$/g,'');
}
function addClass(dom, cls) {
	if(dom){
	  dom.className += " " + cls;
	}
}
function getRandomBoolean(){
	return Math.random() < 0.5;
}
function createLineClassName(){
	return 'trigramsLine trigramsIcon' + (getRandomBoolean() ? 'Row' : 'Split');
}
function createTextNode(input){
	var node = document.createElement('div');
	node.className = 'ghoulsText';
	node.innerHTML = [
		'<div class="ghoulsTextTopHalf">', input,  '</div>',
		'<div class="ghoulsTextBottomHalf">', input,  '</div>',
		'<div class="trigramsLine1 ', createLineClassName(), '"></div>',
		'<div class="trigramsLine2 ', createLineClassName(), '"></div>',
		'<div class="trigramsLine3 ', createLineClassName(), '"></div>'].join('');
	return node;
}
function createNodes(text){
	var text_arr = text.split(''),
		node = document.createElement('div');
	node.className = 'ghoulsName';
	for(var i=0,total=text_arr.length;i<total;i++){
		node.appendChild(createTextNode(text_arr[i]));
	}
	return node;
}

function slideShow(nodes){
	for(var i=0,total=nodes.length;i<total;i++){
		(function(s){
			setTimeout(function(){
				addClass(nodes[s],'active');
				setTimeout(function(){
					nodes[s].innerHTML = nodes[s].innerText.slice(0,1);
				},1000);
			},160 * s + 10);
		})(i);
	}
}
function build(text){
	var content = document.getElementsByClassName('header')[0],
		node = createNodes(text);
	content.innerHTML = '';
	content.appendChild(node);
	setTimeout(function(){
		slideShow(node.childNodes);
	},500);
}

///
var input = document.getElementById("inputText"),
	defaultText = (location.hash || '').length > 1 ? location.hash.slice(1,6) : '寻龙诀',
	button = document.getElementById('button');

build(defaultText);
function BuildText(){
	var value = trim(input.value).slice(0,6),
		node = document.getElementsByClassName('ghoulsName')[0];
	if( !value || value.length == 0 ){
		return;
	}
	if(node){
		addClass(node,'fadeOut');
		setTimeout(function(){
			build(value);
		},550);
	}else{
		build();
	}
	location.hash = value;
}
button.onclick = BuildText;

var audio = new Audio();
audio.src = __uri("bjMusic.mp3");
audio.autoplay = true;
audio.loop = "loop";
audio.play();
})();