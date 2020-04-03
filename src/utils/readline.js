const fs = require('fs')
const path = require('path')
const readline = require('readline')

//文件名
const fullFileName = path.join(__dirname,'../','../','logs','access.log')

//创建readStream
const readStream = fs.createReadStream(fullFileName)

//创建readline对象
const rl = readline.createInterface({
    input:readStream
})

let postManNum = 0
let sum = 0

//逐行读取,listData为读取的每行字符串
rl.on('line',(lineData)=>{
    if(!lineData){
        return
    }
    //记录总函数
    sum++
    //判断每行中是否有Postman关键词
    const arr = lineData.split(' -- ')
    if(arr[2] && arr[2].indexOf('Postman') >= 0){
        //累加postman的数量
        postManNum++
    }
})

//监听读取完成
rl.on('close',()=>{
    console.log('Postman占比',postManNum/sum)
})
