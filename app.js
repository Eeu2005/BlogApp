//variáveis
process.loadEnvFile("./.env")
const  {env} = process
const express = require("express")
const handlebars =require("express-handlebars")
const bodyParser =require("body-parser")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
const  app =express()
const postagem = require("./models/Posts")
const admin = require("./router/admin")
const user = require("./router/usuario")
const passport = require("passport");
require("./config/auth")(passport)
const verficaAdmin = require("./helpers/isAdmin")
let port = env.PORT||5000
let hostname = env.HOSTNAME||"localhost"

//configurações
app.use(session({
    secret:"cursodenode",
    saveUninitialized:false,
    resave:false
}))
app.use(passport.initialize())
app.use( passport.session());
app.use(flash())
app.use("/public",express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.engine("handlebars",handlebars.engine({defaultLayout:"main"}))
app.set("view engine", "handlebars")
//myMiddleware
app.use((req,res,next)=>{
    res.locals.succsses_msg=req.flash("succsses_msg")
     res.locals.error_msg=req.flash("error_msg")
     res.locals.error = req.flash("error")
    res.locals.success= req.flash("successs")
     res.locals.user = req.user ?? null
    res.locals.nome = req.user?.nome || "visitante"
    res.locals.admin = req?.user?.admin ===1
     // proteção
    if ( req.method == "POST" || req.method == "PATCH" || req.method == "DELETE" ){
        if ( !req.headers.origin ||req.headers.origin!=`http://${hostname}${port ? ":"+port:""}` ){
            res.send("requsição invalida")
        }
    }
    next()
})
// mongoDB
mongoose.connect(env.MONGO).then(()=> console.log("conectado"))
.catch((e)=> console.log("fracasso"+e))
//rotas
app.get('/',async (req,res)=>{
    try {
     
       const posts=  await postagem.find().populate("categoria").sort({data:"desc"}).exec().then((l)=>l.map((p)=>p.toJSON({getters:true})))
        res.render( "user/index",{posts:posts} )
    } catch (error) {
        req.flash("error_msg","houve um erro interno")
        res.redirect("/404")
    }
   
})

app.get("/404",(req,res)=>{
    res.send("conteúdo não encontrado")
})
app.use("/admin",verficaAdmin,admin)
app.use("/user",user)


app.listen(port, hostname, ()=>{
console.log(`http://${hostname}:${port}`)
})