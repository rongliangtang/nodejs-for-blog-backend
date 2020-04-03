const mysql = require('mysql')
const {
    MYSQL_CONF
} = require('../config/db')

//创建连接对象
const coon = mysql.createConnection(MYSQL_CONF)

//开始连接
coon.connect()
console.log('mysql连接成功')

//执行sql函数结果返回promise
function exec(sql){
    const promise = new Promise((resolve,reject)=>{
        coon.query(sql,(err,result)=>{
            if(err){
                reject(err)
                return
            }
            resolve(result)
        })
    })

    return promise
}

//coon.end()    //这里不执行end，因为node.js是同步执行的，end后不能导出

module.exports = {
    exec,
    escape:mysql.escape
}



