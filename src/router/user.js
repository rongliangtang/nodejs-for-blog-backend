const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')
const {
    login
} = require('../controller/user')
const {
    set,
    get
} = require('../db/redis')

const handleUserRouter = (req,res)=>{
    const method = req.method   //GET POST
    const url = req.url
    const path = req.path

    //登录
    if(method === 'POST' && path === '/api/user/login'){
        const {
            username,
            password
        } = req.body
        
        const result = login(username,password)
        
        return result.then((data)=>{
            if(data.id){
                //设置session
                req.session.username = data.username
                
                //同步到redis
                set(req.sessionId,req.session)

                return new SuccessModel(data)
            }else{
                return new ErrorModel('账号密码不正确')
            }
            
        })
    }

    //登录验证测试
    if(method === 'GET' && path === '/api/user/login-test'){
        //已经登录了话req.session里面是有信息的
        if(req.session.username){
            return Promise.resolve(new SuccessModel('已经登录了'))  //返回promise的简单方式
        }else{
            return Promise.resolve(new ErrorModel('尚未登录'))
        }
    }

}

module.exports = handleUserRouter
