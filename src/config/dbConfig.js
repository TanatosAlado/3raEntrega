const admin =require ('firebase-admin')
const { type }=require('os');

const serviceAccount=require("./desafio2daentrega-1c68d-firebase-adminsdk-9wuew-df4c7a27e8.json");
//  assert {type: "json"}

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
   
} catch (error) {
    console.log(error);
}

const config = {
    mongoDb: {
        url: process.env.DB,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    firebase: {
        db: admin.firestore(),
    }
}

module.exports= config;




// //CONEXION A LA DB EN MONGO
// require("dotenv").config()
// const config = {
//     mongoDb: {
//         url: process.env.URL_BD,
//         options: {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         }
//     }
// }

// module.exports=config;
