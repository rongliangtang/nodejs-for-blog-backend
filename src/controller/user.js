const {
    exec,
    escape
} = require('../db/mysql')
const {
    genPassword
} = require('../utils/cryp')


//查询user表
const login = (username,password)=>{

    password = genPassword(password)
    username = escape(username)
    password = escape(password)

    const sql = `
        select *from user where username=${username} and password=${password}
    `
    console.log(sql)

    return exec(sql).then((rows)=>{
        
        return rows[0]||{}
    })
}


module.exports ={
    login
}






