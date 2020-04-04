# nodejs-for-blog-backend
用原生nodejs写一个简单博客的后端（仅供学习用，实际开发中肯定用框架好，用原生写一遍能更好帮助你理解nodejs原理）

## 项目实现
- 数据库开发
- 接口开发
- 登录：cookie和session的配合来存储登录状态
- 日志记录以及分析
- 安全：防止sql注入，xss攻击，密码加密

## 项目数据库设计
![数据库设计](https://github.com/rongliangtang/nodejs-for-blog-backend/raw/master/img/db.png)
![数据库设计](https://github.com/rongliangtang/nodejs-for-blog-backend/raw/master/img/db1.png)

## 项目接口设计
![接口设计](https://github.com/rongliangtang/nodejs-for-blog-backend/raw/master/img/port.png)

## 项目结构解析
![项目结构](https://github.com/rongliangtang/nodejs-for-blog-backend/raw/master/img/item.png)

## 启动前需要更改数据库配置和安装redis
数据库配置在src/config/db目录下，更改为你电脑上的数据库配置</br>
mysql中运行以下代码创建数据库和数据：
```
create database blog;
use blog;
create table user(
	id INT(11) auto_increment primary key,
    username VARCHAR(30) NOT null unique,
	password VARCHAR(30) NOT null
);
create table classification(
	id INT(11) auto_increment primary key,
    name VARCHAR(30) NOT null unique,
	number INT(11) default 0
);
create table article(
	id INT(11) auto_increment primary key,
    title VARCHAR(30) NOT null,
	content longtext NOT null,
    createtime bigint not null ,
    classification INT(11) 
);
insert into user (username,`password`) values ('admin','123456');
insert into user (username,`password`) values ('管理员','123456');
insert into classification (name,number) values ('分类1',2);
insert into classification (name) values ('分类2');
insert into article (title,content,createtime,classification) values('标题1','内容1',1111111111,1);
insert into article (title,content,createtime,classification) values('标题2','内容2',1112222222,1);
```

安装和启动redis参考</br>https://www.runoob.com/redis/redis-install.html</br>（注意启动后cmd窗口不可关闭）

## 启动前先安装项目所需要的依赖
```
npm install
```

## 编译运行
```
npm run dev
```

