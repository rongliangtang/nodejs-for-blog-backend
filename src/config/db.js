const env = process.env.NODE_ENV    //下载cross-env插件后，再package.json里script定义的NODE_ENV值

let MYSQL_CONF
let REDIS_CONF

if (env === 'dev') {
    //mysql
    MYSQL_CONF = {
        host:'localhost',
        user:'root',
        password:'root',
        port:'3306',
        database:'blog'
    }
    //redis
    REDIS_CONF = {
        port:6379,
        host:'127.0.0.1'
    }

}

if (env === 'production') {
    //mysql
    MYSQL_CONF = {
        host:'localhost',
        user:'root',
        password:'root',
        port:'3306',
        database:'blog'
    }
    //redis
    REDIS_CONF = {
        port:6379,
        host:'127.0.0.1'
    }

}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}



