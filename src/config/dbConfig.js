
//CONEXION A LA DB EN MONGO
require("dotenv").config()
const config = {
    mongoDb: {
        url: process.env.URL_BD,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }
}

module.exports=config;



// // //CONEXION A LA DB EN MONGO

// const config = {
//     mongoDb: {
//         url: 'mongodb+srv://andres:Dorian23@cluster0.ohq5xhd.mongodb.net/ecommerce?retryWrites=true&w=majority',
//         options: {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         }
//     }
// }

// module.exports=config;
