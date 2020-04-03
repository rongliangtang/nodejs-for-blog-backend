const crypto = require('crypto')

//密钥
const SECRET_KEY = 'ssak3298732ncawo'

//md5加密
function md5(content){
    let md5 = crypto.createHash('md5')  //返回加密哈希算法为md5
    return md5.update(content).digest('hex')    //返回加密得结果，hex表示16进制，content为pwd和key组成的字符串是下面的str那种格式
}

//加密函数
function genPassword(password){
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}

//测试
// const result = genPassword('123456')
// console.log(result)

module.exports = {
    genPassword
}