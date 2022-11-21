const config =require("../config/dbConfig.js")
const mongoose =require("mongoose");
const {normalizeMsj}=require("./normalizr.js")
const twilio=require('twilio')
const nodemailer= require('nodemailer');
const { db } = require("../schema/schemaCarts.js");

const {
  loggerDev,
  loggerProd
} = require("../../logger_config");
const NODE_ENV = process.env.NODE_ENV || "development";
const logger = NODE_ENV === "production"
? loggerProd
: loggerDev



try {
    mongoose.connect(config.mongoDb.url, config.mongoDb.options)
} catch (error) {
    console.log(error);
};

const mongooseSchema = new mongoose.Schema({
    author: {
        id: { type: String, required: true, max: 100 },
        nombre: { type: String, required: true, max: 100 },
        apellido: { type: String, required: true, max: 50 },
        edad: { type: Number, required: true },
        alias: { type: String, required: true },
        avatar: { type: String, required: true, max: 100 },
        timestamp: { type: Date, default: Date.now }
    },
    text: { type: String, required: true, max: 400 }
});

const msjModel = mongoose.model('mensajes', mongooseSchema);


//-------------------------------

// if (typeof window !== 'undefined') {
//     console.log('You are on the browser')
//   } else {
//     console.log('You are on the server')
//   }

// const ingresoMensaje = document.getElementById("ingresoMensaje");
// const botonEnviar = document.getElementById("botonEnviar");

// botonEnviar.addEventListener('click', (e) => {
//     e.preventDefault()
//     const mensaje = {
//         author: {
//             id: ingresoMensaje.children.id.value,
//             nombre: ingresoMensaje.children.nombre.value,
//             apellido: ingresoMensaje.children.apellido.value,
//             edad: ingresoMensaje.children.edad.value,
//             alias: ingresoMensaje.children.alias.value,
//             avatar: ingresoMensaje.children.avatar.value,
//         },
//         text: ingresoMensaje.children.text.value
//     }
//     socket.emit('enviarMensaje', mensaje);
// })

// //NORMALIZAR ESQUEMAS
// const authorsSchema = new normalizr.schema.Entity('authors');
// const msjSchema = new normalizr.schema.Entity('mensajes', { author: authorsSchema }, { idAttribute: 'id' });
// const fileSchema = [msjSchema]

// const renderMsj = (msj) => {
//     msj.map(element => {
//         const html = ` <article class=text-center>
//         <span class="id mail">${element._doc.author.id}</span><span class="date">[${element._doc.author.timestamp}]:</span><span class="mensaje">${element._doc.text}</span><img src="${element._doc.author.avatar}" alt="avatar" class="avatar">
//                         </article>`;
//         const mensajes = document.getElementById("mensajes");
//         mensajes.innerHTML += html;
//     })
// }

// //DESNORMALIZAR ESQUEMAS

// socket.on('mensajes', (msj) => {
//     const denormMsjs = normalizr.denormalize(msj.result, fileSchema, msj.entities);
//     renderMsj(denormMsjs);
//     renderComp(msj, denormMsjs);
// })

// //RENDERIZAR MENSAJES


// const renderComp = (msj, denormMsjs) => {
//     const comp = document.getElementById("compresion");
//     const denormMsjsLength = (JSON.stringify(denormMsjs)).length;
//     const msjLength = (JSON.stringify(msj)).length;
//     const compresion = ((msjLength - denormMsjsLength) / msjLength * 100).toFixed(2);
//     comp.innerHTML = `(Compresion: ${compresion}%)`;
// }



//-------------------------------



const saveMsjs = async (msj) => {
    const newMsj = new msjModel(msj);
    try {
        newMsj.save()
    } catch (error) {
        throw new Error(error);
    }
}

const getMsjs = async () => {
    try {
        const mensajes = await msjModel.find();
        return normalizeMsj(mensajes);
    } catch (error) {
        logger.log("error",err)
    }
}


//MENSAJES SMS CON TWILIO

const accountSid = 'ACb1200a8e555e9b41c8ec2323345c9a71'; 
const authToken = '9108c04775caa79108d16402618d5d1b'; 
const client = twilio(accountSid, authToken); 

async function sendSms() {
    const smsOption={
        from:"+18158804635",   
        to: "+5493425289170",
        body:"Recibimos tu pedidos, lo prepararemos a la brevedad"
    }
    try {
        const info = await client.messages.create(smsOption);
        console.log(info);
    }  catch(err) {
        logger.log("error",err)
    }
}

async function sendWhatsapp(name,mail) {
    const whatsAppOption={
        from:"whatsapp:+14155238886",
        to: "whatsapp:+5493425289170",
        body:`Ingreso pedido de Nombre: ${name} Mail: ${mail}`
    }    
    try {
      const info = await client.messages.create(whatsAppOption);
      console.log(info);
    }  catch(err) {
      logger.log("error",err)
    }
  }

  async function sendMail(name,mail,listCart) {
    try {
        await transporter.sendMail({
          to:"topesox325@lance7.com",
          from:"jovanny.goldner@ethereal.email",
          subject:`nuevo pedido de Nombre: ${name} Mail: ${mail}`,
          html:`${listCart}`
      });
      }  catch(err) {
        logger.log("error",err)
      }
    }

    async function deleteCartBuy(idCart){
      try{
       await db.collection("carts").deleteOne({id:idCart});
      }
      catch(err) {
        logger.log("error",err)
      }
    }
    const transporter = nodemailer.createTransport({
        service:"gmail",
        host: 'smtp.gmail.email',
        port: 587,
        auth: {
            user: 'cybernanox@gmail.com',
            pass: "itvptxxbnvqeudhn"
        }
      });

      module.exports={saveMsjs,getMsjs,sendMail,sendSms,sendWhatsapp,deleteCartBuy}