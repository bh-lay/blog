# 本目录下文件及目录解释
项目后端目录，不向web端开放，切记ngnix、apache等其他项目不可设置本目录公开。

## ajax
前端接口目录

## component
前端视图片段，用于定制页面公用视图（如navigation）

## conf
APP相关配置，包括端口号、图床、301重定向等

## controller
视图控制模块，用于管理views（目前作用比较暧昧，有打算与views合并）

## core
隆重介绍这个目录。APP底层基础逻辑，抽象出APP类，用于初始化项目，单次请求抽象出一个叫connect的类。围绕APP、connect会有session、静态资源、缓存等功能。

## lib
一些方法、类库

## temporary
临时文件存放目录，包括缓存、session、文件上传临时目录

## views
存放视图文件

## app.js
应用入口文件，初始化项目，完成配置路由及静态资源目录等操作。

## package.json
项目运行需要的基础类库

## readme.md
你正在阅读的这份文件
