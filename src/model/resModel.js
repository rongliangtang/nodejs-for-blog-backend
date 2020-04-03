/*
注意
Node.js支持类似Java的类和继承机制，包括类的什么、继承、静态方法等。
NodeJS和js中类的定义不一样，NodeJS用class，js用function
*/

//利用resModel来优化接口的格式，使其返回的数据格式更加标准
//SuccessModel,ErrorModel继承BaseModel;
//data键值对为对象类型，message键值对为字符串类型
//如果第一个参数为string则只返回message键值对
class BaseModel{
    constructor(data,message){
        if(typeof data === 'string'){
            this.message = data
            data = null
            message = null
        }
        if(data){
            this.data = data
        }
        if(message){
            this.message = message
        }

    }

}

class SuccessModel extends BaseModel{
    constructor(data,message){
        super(data,message)
        this.error = 0
    }
}

class ErrorModel extends BaseModel{
    constructor(data,message){
        super(data,message)
        this.error = -1
    }
}


module.exports = {
    SuccessModel,
    ErrorModel
}










