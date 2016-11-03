# 使用帮助
function help(){
	echo "Usage   sh $0 [project] [media]";
	echo "        project 项目目录名，all为编译全部";
	echo "        media   fis3 中配置的 media（可选）\n";
	echo "notice  非编译全部项目[all]，且未指定 media 时，默认开启 watch\n";
}

# 画横线
function printLine(){
	echo '--------------------------------------------------------\n';
}

# 编译方法 参数为目录名
function deploy(){
	# 不编译【 _ 】开头的目录
	if [ ${1:0:1} == '_' ]; then
		echo "skip ["$1"], ["$1"] is not a project !\n";
	else
		echo '  frontEnd/'$1 ' --> '$deployTo;
		echo '  fis3 release '$deployMedia' '$watch' -d '$deployTo' --file fis-conf.js'
		cd $root'/'$1
		fis3 release $deployMedia $watch -d $deployTo --file fis-conf.js
	fi
}


# 当前目录
root=`pwd`;

# 发布media，fis3的参数
deployMedia=${2:-''};

# 发布目录
deployTo='../../static/';

# 是否开启持续观测模式
watch='';
# 没有media配置时才用watch
if [ ${#deployMedia} == 0 ]; then
	watch='-w';
fi



echo '\n[BDS] bh-lay deploy system'
printLine;


if [ $# == 0 ]; then
	# 未传入参数 显示帮助
	echo "没有执行任何编译操作，请按照下面提示进行操作";
	printLine;
    help

elif [ $1 == 'help' ]; then
	# help 显示帮助
    help

elif [ $1 == 'all' ]; then
	# all 编译所有项目
    
    echo "deploy all project start ";
    # 取消 watch
    watch='';
    # 遍历编译所有项目
	for x in `ls -l | grep '^d' | awk '{print $9}'`
	do
		printLine;
		deploy $x;
	done
	
elif [ ! -d $1 ]; then

	# 项目可能不存在
	echo "project ["$1"] is not found !\n";
	help

else

	# 进入单项编译
	deploy $1;

fi


