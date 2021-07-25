
# 画横线
function printLine(){
	echo '--------------------------------------------------------';
}

# 画空行
function printScape(){
	echo '\n\n\n';
}

function start(){

	echo "\n一键启动服务\n";

	echo "启动主服务";
	printLine;
	cd ../sys;
	pm2 start app.js;


	printScape;


	echo "启动静态资源服务";
	printLine;
	cd ../frontEnd/;
	pm2 start develop_static_server.js;

	printScape;

	printScape;
	printLine;
	echo "好了，都启动好了";
	echo "  node 服务请使用 pm2 关闭"
	echo "  mongo 服务请自行维护"
}

start;