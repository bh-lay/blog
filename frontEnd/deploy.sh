
echo 'Deploy System'
echo '-----------------------'


#检查项目是否存在
if [ $1 == 'help' ]; then 
    echo -e "Usage: bash $0 [project] [media]";
    echo -e "       [project] 项目目录名";
    echo -e "       [media] fis配置中的media（可选）";
    exit 1;
fi

# 源码目录-发布目录
deployFrom=$1;
deployMedia=${2:-''};
deployTo='';
watch='';

#没有media配置时才用watch
if [ ${#deployMedia} == 0 ]; then
    watch='-w';
fi

#检查项目是否存在
if [ ! -d $deployFrom ]; then 
    echo -e "project not found !\n";  
    exit 1;
fi

if [ ${deployFrom:0:1} == '_' ]; then 
    echo -e "["$deployFrom"] is not a project !\n";  
    exit 1;
fi

case $deployFrom in
    'aboutblog')
		deployTo='../../web/topic/aboutblog'
    ;;
    'aboutme')
        deployTo='../../web/topic/aboutme'
    ;;
    'aboutme_old')
        deployTo='../../web/topic/aboutme_old'
    ;;
    'intiate')
        deployTo='../../web/topic/intiate'
    ;;
    'multi-page')
        deployTo='../../web/'
    ;;
    'single-page')
        deployTo='../../static/'
    ;;
    'admin')
        deployTo='../../web/'
    ;;
    *)  
		echo -e "need config first,please edit deploy.sh !\n";
    	exit 1; 
    ;;
esac

echo '  from: '$deployFrom ' to  : '$deployTo
echo '  fis3 release '$deployMedia' '$watch' -d '$deployTo' --file fis-conf.js'

cd $deployFrom
fis3 release $deployMedia $watch -d $deployTo --file fis-conf.js
