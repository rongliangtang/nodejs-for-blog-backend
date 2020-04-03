const {
    exec,
    escape
} = require('../db/mysql') 
const xss = require('xss')

//获取文章列表
const getList = (classification,keyword) => {
    let sql = `select *from article where 1=1 `  //1=1永远成立，让where语法成立
    if (classification) {
        sql += `and classification=${classification} `  //${}内可以写变量名，会在该字符串中翻译为变量的值
    }
    if (keyword) {
        sql += `and title like '%${keyword}' or content like '%${keyword}' `   //注意拼接中最后的空格
    }
    sql += `order by createtime desc`
    //console.log(sql)

    return exec(sql)
}

//获取文章详情
const getDetail = (id) => {
    let sql = `select *from article where id=${id}`

    return exec(sql).then((row)=>{
        return row[0]
    })
}

//新增一篇文章
const newBlog = (blogData = {})=>{
    //blogData是一个博客对象(如果为空则为=后面的{}，这是es6新语法),包含title,content属性
    const title = xss(escape(blogData.title))
    const content = xss(escape(blogData.content))
    const createtime = Date.now()   //获取当前时间戳
    const classification = blogData.classification

    const sql = `
        insert into article (title,content,createtime,classification) value (${title},${content},${createtime},${classification})
    `
     console.log(sql)

    return exec(sql).then((insertData)=>{
        return {
            id:insertData.insertId
        }
    })

}

//更新一篇博客
const updateBlog = (id,blogData) => {
    //id是需要更新博客的id
    //blogData是一个博客对象，包含title,content属性

    const title = xss(escape(blogData.title))
    const content = xss(escape(blogData.content))
    const classification = blogData.classification

    const sql = `
        update article set title=${title},content=${content},classification=${classification} where id=${id}
    `
    return exec(sql).then((updateData)=>{
        if (updateData.affectedRows >= 0) {
            return true
        }else{
            return false
        }
    })
}

//删除一篇文章
const delBlog = (id)=>{
    //id是要删除文章的id
    const sql = `delete from article where id=${id}`

    return exec(sql).then((delData)=>{
        if(delData.affectedRows > 0){
            return true
        }else{
            return false
        }
    })
}

//获取分类列表
const getClassList = ()=>{
    let sql = `select *from classification `

    return exec(sql)
}

//增加一个分类
const newClass = (classData = {})=>{
    //calssData是类名对象，包含name类名
    const name = xss(escape(classData.name))

    let sql = `insert into classification (name) values (${name})`

    return exec(sql).then((insertData)=>{
        return {
            id:insertData.insertId
        }
    })
}

//更新一个分类
const updateClass = (id,classData)=>{
    const name = xss(escape(classData.name))


    const sql = `
        update classification set name=${name} where id=${id}
    `
    return exec(sql).then((updateData)=>{
        if (updateData.affectedRows >= 0) {
            return true
        }else{
            return false
        }
    })
    
}

//删除一个分类
const delClass = (id)=>{
    //id是要删除文章的id
    const sql = `delete from classification where id=${id}`

    return exec(sql).then((delData)=>{
        if(delData.affectedRows > 0){
            return true
        }else{
            return false
        }
    })
}



module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog,
    getClassList,
    newClass,
    updateClass,
    delClass
}