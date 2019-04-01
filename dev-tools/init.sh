echo '\n\n[1] 正在创建环境变量样本...'

cp -rf ./samples/.env ../sys/

echo '环境变量配置完成，您可以在 sys/.env 编辑环境变量配置\n\n'

echo '[2] 安装后端依赖\n cd ../sys \n npm install'
cd ../sys && npm install

echo '\n\n\n\n[3] 安装前端依赖'
echo '\n\n[3.1] 安装前端 single-page 依赖\n cd ../frontEnd/single-page \n npm install'
cd ../frontEnd/single-page && npm install
echo '\n\n[3.2] 安装前端 multi-page 依赖\n cd ../multi-page \n npm install'
cd ../multi-page && npm install
echo '\n\n[3.3] 安装前端 console 依赖\n cd ../console \n npm install'
cd ../console && npm install
echo '\n\n[3.4] 安装前端 topic 依赖\n cd ../topic \n npm install'
cd ../topic && npm install
echo '\n\n[3.4] 安装前端 moments 依赖\n cd ../moments \n npm install'
cd ../moments && npm install

echo '\n\n\n\n[4] 安装 node 进程管理工具 pm2 \n cd npm install -g pm2'
cd npm install -g pm2

echo '初始化完成'