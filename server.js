const express=require("express");

// const {routerProducto,routerCarrito}=require("./src/routes/routes.js")
const {routerProducto} = require("./src/routes/productos")
const {routerCarrito} = require("./src/routes/carros")
const {routerUsuario} = require("./src/routes/usuarios")


const{Server:http}=require ("http");
const {Server:ioServer}=require ("socket.io");
const User=require("./src/schema/schemaUser.js")
const session =require("express-session")
const MongoStore=require("connect-mongo");
const LocalStrategy = require('passport-local').Strategy;
const passport = require("passport");
const { comparePassword, hashPassword } = require("./src/services/utils")
const {connect} = require('./src/config/dbConfig.js');
const { Types } = require("mongoose");
const {saveMsjs, getMsjs, sendWhatsapp, sendMail, sendSms,deleteCartBuy}=require ("./src/controllers/mensajes.js")
const nodemailer= require('nodemailer');
const { argv0 } = require("process");
const { db } = require("./src/schema/schemaProducts.js");



//="="="="="=""="=="="="==""="

const {
  loggerDev,
  loggerProd
} = require("./logger_config");

const NODE_ENV = process.env.NODE_ENV || "development";
const logger = NODE_ENV === "production"
? loggerProd
: loggerDev

const cluster = require("cluster");
const {cpus} = require('os');
const cpuNum = cpus().length;

const modoCluster = false;

if(modoCluster){
  console.log("Se iniciará en modo CLUSTER")
}
else{
  console.log("Se iniciará en modo FORK")
}

if (modoCluster && cluster.isPrimary) {
  console.log(`Cluster iniciado. CPUS: ${cpuNum}`);
  console.log(`PID: ${process.pid}`);
  for (let i = 0; i < cpuNum; i++) {
    cluster.fork();
  }

  cluster.on("exit", worker => {
    console.log(`${new Date().toLocaleString()}: Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();
  const httpserver = http(app)
  const io = new ioServer(httpserver)
  
  app.use("/public", express.static('./public/'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/productos', routerProducto);
  app.use('/api/carritos', routerCarrito);
  
  // app.use('/', routerUsuario);
  
  

  app.use(session({
    secret: 'TanatosAlado',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl:process.env.URL_BD,
      retries: 0,
      ttl: 10 * 60 ,
    }),
  })
  );
  
  
  app.use(passport.initialize());
  app.use(passport.session());
  
   //   //RECUPERO EL NOMBRE YA EN SESION INICIADA
   app.get('/loginEnv', (req, res) => {
    //console.log(req.user.name)
    process.env.USER=req.user.name;
    process.env.avatar=req.user.avatar;
    const user = process.env.USER;
    const avatar=process.env.avatar;
    res.send({
        user,avatar
    })
    
  })
  
  
   //   //RECUPEROel ID DeL CARRO EN SECION INICIADA
   app.get('/idCart', (req, res) => {
    process.env.USER=req.user.name;
    process.env.id=req.user.id;
    process.env.avatar=req.user.avatar
    const user = process.env.USER;
    const id=process.env.id
    const avatar=process.env.avatar
    res.send({
        user,id,avatar
    })
    
  })
  
  
  //RECUPERO EL NOMBRE YA EN SESION INICIADA
  app.get('/getUserNameEnv', (req, res) => {
    const user = process.env.USER;
        res.send({
        user
    })
  })
  

  app.get("/", (req,res)=>{
      try{
          if (req.session.user){
             res.sendFile(__dirname + ('/public/index.html'))
             logger.log("info",`Ingreso a la ruta${req.url}`)
          }
          else
          {
              res.sendFile(__dirname + ('/views/login.html'))
              logger.log("info",`Ingreso a la ruta${req.url}`)
          }
      }
      catch (error){
       console.log(error)
      }
  
  })
  
  io.on('connection', async (socket) => {
      console.log('Usuario conectado');
      socket.on('enviarMensaje', (msj) => {
          saveMsjs(msj);
      })
  
      socket.emit ('mensajes', await getMsjs());
  })
  
  // DESLOGUEO DE USUARIO
  
  app.get('/logout', (req, res) => {
      try {
          req.session.destroy((err) => {
            console.log("previo al if")
              if (err) {
                  console.log("dentro del if")
                  console.log(err);
              } else {
                  console.log("Dentro del Else")
                  res.redirect('/logout');
                  logger.log("info",`Ingreso a la ruta${req.url}`)
              }
          })
      } catch (err) {
          console.log(err);
      }
  })
  app.get('/logoutMsj', (req, res) => {
      try {
          res.sendFile(__dirname + '/views/logout.html');
          logger.log("info",`Ingreso a la ruta${req.url}`)
      }
      catch (err) {
          console.log(err);
      }
  })

//-------------------------------

app.get('/buyCart', async(req, res) => {
  try{
  process.env.USER=req.user.mail;
  process.env.id=req.user.id;
  process.env.name=req.user.name
  process.env.phone=req.user.phone
  // const idProductos=process.env.id
   const id=parseInt( process.env.id)

  const productos=await db.collection("carts").findOne({id:id})

  const mail = process.env.USER;
  const phone=process.env.phone
  const name= process.env.name
       sendWhatsapp(name,mail)
       sendMail(name,mail,JSON.stringify(productos))
       sendSms(phone)
       deleteCartBuy(id)
  res.redirect("/buySuccessfull")
  logger.log("info",`Ingreso a la ruta${req.url}`)
  

   }
  catch(err){
    console.log(err)
  }
})

//-------------------------------




   
    app.get("/login", (req, res) => {
      res.sendFile(__dirname + "/views/login.html");
      logger.log("info",`Ingreso a la ruta${req.url}`)
    });
  
    app.get("/signup", (req, res) => {
      res.sendFile(__dirname + "/views/register.html");
      logger.log("info",`Ingreso a la ruta${req.url}`)
    });
  
    app.get("/loginFail", (req, res) => {
      res.sendFile(__dirname + "/views/loginFail.html");
      logger.log("info",`Ingreso a la ruta${req.url}`)
    });
  
    app.get("/signupFail", (req, res) => {
      res.sendFile(__dirname + "/views/signupFail.html");
      logger.log("info",`Ingreso a la ruta${req.url}`)
    });
    app.get("/cart", (req, res) => {
      res.sendFile(__dirname + "/views/cart.html");
      logger.log("info",`Ingreso a la ruta${req.url}`)
    });
  

//---------------------------------------------------------

    app.get("/buySuccessfull", (req, res) => {
      res.sendFile(__dirname + "/views/buyCart.html");
      logger.log("info",`Ingreso a la ruta${req.url}`)
    });

//----------------------------------------------------------
  
    app.post("/signup", passport.authenticate("signup", {
      failureRedirect: "/signupFail",
    }) , (req, res) => {  
      req.session.user = req.user;
      res.redirect("/login");
    });
    
    app.post("/login", passport.authenticate("login", {
      failureRedirect: "/loginFail",
    }) ,(req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });
  
    app.get("*", (req, res) => {
      logger.log("warn",`Ruta no encontrada ${req.url}`)
      res.status(400).send(`Ruta no encontrada ${req.url}`);
    });
  
    const PORT = process.env.PORT || 8080;
  
    const server = httpserver.listen(PORT, () => {
        console.log(`Server is running on port: ${server.address().port}`);
    });
    server.on('error', error => console.log(`error running server: ${error}`));
  
  
}


//="="="="="=""="=="="="==""="

