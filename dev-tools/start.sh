
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


	echo "启动 Mongo";
	printLine;
	cd ../../mongodb-osx-x86_64-4.0.6/;
	echo "  删除非正常退出的lock文件";
	rm db/mongod.lock -rf;
	./bin/mongod --fork -dbpath=./data/db --logpath=./log/MongoDB.log --bind_ip 127.0.0.1 --port 2797


	printScape;
	printLine;
	echo "好了，都启动好了";
	echo "  node 服务请使用 pm2 关闭"
	echo "  mongo 服务请使用以下方式关闭
	    ./mongod
	    > use admin
	    > db.shutdownServer()\n";
}

start;