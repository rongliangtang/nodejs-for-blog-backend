const queryString = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const {
    set,
    get
} = require('./src/db/redis')
const {
    access
} = require('./src/utils/log')

//获取cookie过期时间,然后给cookie设置
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000)) //setTime()重新设置时间
    //console.log('d.toGMTString is：',d.toGMTString())
    return d.toGMTString()
}

//获取前端发送的req中的ip地址
function getClientIP(req) {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress;
};

//处理post数据 返回一个promise
const getPostData = (req)=>{
    const promise = new Promise((resolve,reject)=>{
        //如果不是post则return结束
        if(req.method !== 'POST'){
            resolve({})
            return 
        }
        //如果header类型不是json则return结束
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        //接收数据
        let postData = ''
        req.on('data',(chunk)=>{
            postData += chunk.toString()
        })
        req.on('end',()=>{
            //如果接收到的数据为空则return结束
            if(!postData){
                resolve({})
                return
            }
            //如果接收到了数据则将其转换为对象放到resolve中
            resolve(
                JSON.parse(postData)
            )

        })

    })

    return promise
}

const serverHandle = (req,res)=>{
    
    //设置返回格式为JSON
    res.setHeader('Content-type','application/json')

    //获取path
    const url = req.url
    req.path = url.split('?')[0]

    //解析query
    req.query = queryString.parse(url.split('?')[1])
    
    //记录access log
    access(`${req.method} -- ${url} -- ${req.headers['user-agent']} -- ${getClientIP(req)} -- ${Date.now()}`)


    //解析cookie（因为从前端发送过来的cookie是字符串格式，需要解析成JSON格式）
    //将前端发送过来的cookie放到req.cookie中
    req.cookie = {} //初始化req.cookie为空对象
    const cookieStr = req.headers.cookie || ''  //cookie格式k1=v1;k2=v2
    cookieStr.split(':').forEach((item)=>{
        if(!item){
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()   //trim()函数去除字符串头尾空格（因为用httpOnly后用document.cookie添加cookie后原始的前面会多个空格）
        const val = arr[1].trim()
        req.cookie[key] = val
    })

    //用redis时不需要考虑利用一个全局变量SESSION_DATA(这种做法很有问题)，直接存入到redis中，直接从redis中取
    let userId = req.cookie.userid  //从cookie中取出userid
    let needSetCookie = false
    if(!userId){
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        set(userId,{})
    }
    
    req.sessionId = userId  //把userId放到req.sessionId中
    get(req.sessionId).then((sessionData)=>{
        //如果key找不到则给一个{}，防止恶意登录是内存爆掉
        if(sessionData == null){    //这个userId在redis中没有对应的数值
            //设置redis的val为字{}，set中会将{}转换为'{}'
            set(req.sessionId,{})
            //设置session
            req.session = {}
        }else{
            req.session = sessionData
        }

        return getPostData(req) //处理post数据
    }).then((postData)=>{   //注意同一文件中不同promise中的参数是不一样的，所以需要把blogResult放到promise中，否则req不一样
       
        req.body = postData //将post数据存入req.body中(req.body本来为空，如果api不是post，则req.body为空)
        //处理blog路由
        const blogResult = handleBlogRouter(req,res)
        if(blogResult){
            
            //设置cookie
            if(needSetCookie){
                res.setHeader('Set-Cookie',`userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)    //path=/将cookie的生效路由改为根路由;httpOnly只允许后端改
            }

            blogResult.then((blogData)=>{
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return  //阻止继续往下执行（注意不能再promise中return）
        }

        //处理user路由
        const userResult = handleUserRouter(req,res)
        if(userResult){
            userResult.then((userData)=>{
                //设置cookie
                if(needSetCookie){
                    res.setHeader('Set-Cookie',`userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)    //path=/将cookie的生效路由改为根路由;httpOnly只允许后端改
                }

                res.end(
                    JSON.stringify(userData)
                )
            })
            return  //阻止继续往下执行（注意不能再promise中return）
        }

        //未命中路由，返回404
        res.writeHead(404,{
            'Content-type':'text/plain'
        })
        res.write('404 Not Found\n')
        res.end()

    })

}

module.exports = serverHandle








