const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog,
    getClassList,
    newClass,
    updateClass,
    delClass
} = require('../controller/blog')


const handleBlogRouter = (req,res)=>{
    const method = req.method   //GET POST
    const url = req.url
    const path = req.path

    const id = req.query.id || ''   //多个接口需要从url中获取id，所以将其放到if外
    //console.log(method,path)


    //获取博客列表
    if(method === 'GET' && path === '/api/blog/list'){
        let classification = req.query.classification || ''
        const keyword = req.query.keyword || ''
        
        const result = getList(classification,keyword)  //result是promise exec(sql)

        return result.then((listData)=>{    //相当于执行exec(sql).then(result=>return xxx)  返回的结果xxx也是promise
            //console.log(listData)
            return new SuccessModel(listData)   
        })
    }

    //获取博客内容
    if(method === 'GET' && path === '/api/blog/detail'){
        const result = getDetail(id)
        return result.then((listData)=>{
            return new SuccessModel(listData)
        })

    }

    //新增一篇博客
    if(method === 'POST' && path === '/api/blog/new'){
        const result = newBlog(req.body)
        
        return result.then((data)=>{
            //console.log(data)
            return new SuccessModel(data)
        })

    }

    //更新一篇博客
    if(method === 'POST' && path === '/api/blog/update'){
        
        const result = updateBlog(id,req.body)  //req.body存放的是post数据

        return result.then((val)=>{
            if(val){
                return new SuccessModel()
            }else{
                return new ErrorModel('更新博客失败')
            }
        })
    }

    //删除一篇博客
    if(method === 'GET' && path === '/api/blog/delete'){
        
        const result = delBlog(id)
        
        return result.then((val)=>{
            if(val){
                return new SuccessModel()
            }else{
                return new ErrorModel('删除博客失败')
            }
        })
    }

    //获取分类列表
    if(method === 'GET' && path === '/api/class/list'){
        const result = getClassList()  //result是promise exec(sql)

        return result.then((listData)=>{    //相当于执行exec(sql).then(result=>return xxx)  返回的结果xxx也是promise
            //console.log(listData)
            return new SuccessModel(listData)   
        })
    }

    //新增分类
    if(method === 'POST' && path === '/api/class/new'){
        const result = newClass(req.body)
        
        return result.then((data)=>{
            //console.log(data)
            return new SuccessModel(data)
        })

    }


    //更新分类
    if(method === 'POST' && path === '/api/class/update'){
        
        const result = updateClass(id,req.body)  //req.body存放的是post数据

        return result.then((val)=>{
            if(val){
                return new SuccessModel()
            }else{
                return new ErrorModel('更新博客失败')
            }
        })
    }

    //删除分类
    if(method === 'GET' && path === '/api/class/delete'){
        
        const result = delClass(id)
        
        return result.then((val)=>{
            if(val){
                return new SuccessModel()
            }else{
                return new ErrorModel('删除博客失败')
            }
        })
    }





}

module.exports = handleBlogRouter