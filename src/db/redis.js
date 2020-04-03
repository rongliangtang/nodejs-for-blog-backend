const redis = require('redis')
const {REDIS_CONF} = require('../config/db')

//创建客户端
const redisClient = redis.createClient(REDIS_CONF.port,REDIS_CONF.host)
redisClient.on('error',(err)=>{
    console.error(err)
})
console.log('redis连接成功')

//设置key val
function set(key,val){
    if(typeof val === 'object'){
        val = JSON.stringify(val)   //把对象转换为字符串，因为key val必须为字符串
    }
    redisClient.set(key,val,redis.print)
}

//获取key val，回调函数，返回promise
function get(key){
    const promise = new Promise((resolve,reject)=>{
        redisClient.get(key,(err,val)=>{
            if(err){
                reject(err)
                return
            }
            if(val == null){
                resolve(null)   //如果查不到返回null
                return
            }
            //try catch使结果返回JSON格式
            try{
                resolve(JSON.parse(val))    //字符串转换为JSON
            }catch(err){
                resolve(val)    //如果是JSON则直接返回
            }
        })
    })

    return promise
}

module.exports = {
    set,
    get
}
