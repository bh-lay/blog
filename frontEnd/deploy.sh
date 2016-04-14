
echo 'Deploy System'
echo '-----------------------'


# 使用帮助
if [ $1 == 'help' ]; then
    echo -e "Usage: bash $0 [project] [media]";
    echo -e "       [project] 项目目录名";
    echo -e "       [media] fis配置中的media（可选）";
    exit 1;
fi

# 源码目录-发布目录
deployFrom=$1;
deployMedia=${2:-''};
deployTo='../../static/'
watch='';

# 没有media配置时才用watch
if [ ${#deployMedia} == 0 ]; then
    watch='-w';
fi

#检查项目是否存在
if [ ! -d $deployFrom ]; then
    echo -e "project not found !\n";
    exit 1;
fi

# 不编译【 _ 】开头的目录
if [ ${deployFrom:0:1} == '_' ]; then
    echo -e "["$deployFrom"] is not a project !\n";
    exit 1;
fi

echo '  from: '$deployFrom ' to  : '$deployTo
echo '  fis3 release '$deployMedia' '$watch' -d '$deployTo' --file fis-conf.js'

cd $deployFrom
fis3 release $deployMedia $watch -d $deployTo --file fis-conf.js
