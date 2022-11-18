const {Router}=require("express");
const { userDao }= require("../dao/index.js")
const MongoStore=require("connect-mongo");
const User=require("../schema/schemaUser")
const { comparePassword, hashPassword } = require("../../utils")

const { loginControl } = require("../controllers/user")

const routerUsuario = Router();
const usuarios=new userDao;

const passport = require("passport");
const session =require("express-session")

const usr = require("../controllers/user")

routerUsuario.use(passport.initialize());
routerUsuario.use(passport.session());

routerUsuario.use(session({
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

routerUsuario.get('/logout', (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/logout');
                logger.log("info",`Ingreso a la ruta${req.url}`)
            }
        })
    } catch (err) {
        console.log(err);
    }
})
routerUsuario.get('/logoutMsj', (req, res) => {
    try {
        res.sendFile(__dirname + '/views/logout.html');
        logger.log("info",`Ingreso a la ruta${req.url}`)
    }
    catch (err) {
        console.log(err);
    }
})

//   //RECUPERO EL NOMBRE YA EN SESION INICIADA
routerUsuario.get('/loginEnv', (req, res) => {
process.env.USER=req.user.name;
process.env.avatar=req.user.avatar;
const user = process.env.USER;
const avatar=process.env.avatar;
res.send({
    user,avatar
})

})

//RECUPERO EL NOMBRE YA EN SESION INICIADA
routerUsuario.get('/getUserNameEnv', (req, res) => {
const user = process.env.USER;

    res.send({
    user
})
})



// routerUsuario.get("/login", (req, res) => {
// res.sendFile(__dirname + "/views/login.html");
// logger.log("info",`Ingreso a la ruta${req.url}`)
// });


routerUsuario.get("/login", loginControl);


routerUsuario.get("/signup", (req, res) => {
res.sendFile(__dirname + "/views/register.html");
logger.log("info",`Ingreso a la ruta${req.url}`)
});

routerUsuario.get("/loginFail", (req, res) => {
res.sendFile(__dirname + "/views/loginFail.html");
logger.log("info",`Ingreso a la ruta${req.url}`)
});

routerUsuario.get("/signupFail", (req, res) => {
res.sendFile(__dirname + "/views/signupFail.html");
logger.log("info",`Ingreso a la ruta${req.url}`)
});
routerUsuario.get("/cart", (req, res) => {
res.sendFile(__dirname + "/views/cart.html");
logger.log("info",`Ingreso a la ruta${req.url}`)
});

routerUsuario.post("/signup", passport.authenticate("signup", {
    failureRedirect: "/signupFail",
}) , (req, res) => {  
req.session.user = req.user;
res.redirect("/login");
});

routerUsuario.post("/login", passport.authenticate("login", {
failureRedirect: "/loginFail",
}) ,(req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

routerUsuario.get("*", (req, res) => {
logger.log("warn",`Ruta no encontrada ${req.url}`)
res.status(400).send(`Ruta no encontrada ${req.url}`);
});



module.exports= {routerUsuario}