
echo 'Deploy System'
echo '-----------------------'

# 源码目录-发布目录
deployFrom=$1;
deployTo='';

if [ ! -d $deployFrom ]; then 
    echo -e "project not found !\n";  
    exit 1;
fi

case $deployFrom in
    'aboutblog')
		deployTo='../../web/topic/aboutblog'
    ;;
    'aboutme')
        deployTo='../../web/topic/aboutme'
    ;;
    'intiate')
        deployTo='../../web/topic/intiate'
    ;;
    *)  
		echo -e "need config first,please edit deploy.sh !\n";
    	exit 1; 
    ;;
esac

echo '  from '$deployFrom
echo '  to   '$deployTo

cd $deployFrom
fis3 release -d $deployTo --file fis-conf.js