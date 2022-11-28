const dotenv =require ('dotenv')
dotenv.config()
const args=`${process.argv.slice(2)}`||"mongo"

let productoDao
let cartDao
let userDao
let messagesDao


switch (args){
    case 'mongo':{
        const  ProductosDaoMongo =  require('./mongo/ProductsDaoMongo.js')
        const cartDaoMongo =  require('./mongo/cartDaoMongo.js')
        const userDaoMongo =  require('./userDao.js')



       productoDao=ProductosDaoMongo
       cartDao=cartDaoMongo
       userDao=userDaoMongo;
       break;
    }
    case 'firebase':{
        const  cartDaoFirebase =  require('./firebase/cartDaoFirebase.js')
        const productsDaoFirebase =  require('./firebase/productsDaoFirebase.js')
        const messagesDaoFirebase =  require('./firebase/messagesDaoFirebase.js')

       productoDao=productsDaoFirebase
       cartDao=cartDaoFirebase
       messagesDao=messagesDaoFirebase
       break;
    }
}
module.exports= {
    productoDao, cartDao,userDao
    }
