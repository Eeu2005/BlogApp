const express = require( "express" );
const categoria = require("../models/Categoria")
const router = express.Router();
const usuario = require( "../models/usuario" );
const checarSeNulo = require( "../helpers/checarFunc" );
const hashear = require( "../helpers/hash" );
const Post = require("../models/Posts")
const passport = require( "passport" );
const markup = require( "marked" );
router.get( "/registro", ( req, res ) =>
{
    res.render( "user/userForm" );
} );
router.post( "/add", async ( req, res, next ) =>
{
    let erros = [];
    const { nome, email, senha, senha2 } = req.body;
    checarSeNulo( nome, "nome", erros );
    checarSeNulo( email, "email", erros );
    checarSeNulo( senha2, "senha2", erros );
    checarSeNulo( senha, "senhas", erros, senha2 );
    if ( senha.length < 4 )
    {
        erros.push( {
            mensagem: `senha muito curta`
        } );
    }

    if ( erros.length > 0 )
    {
        // res.json(erros)
        res.render( "user/userForm", { erros: erros } );
    } else
    {
        if ( await usuario.findOne( { email: email } ) )
        {
            req.flash( "error_msg", "ja consta um usuario com esse e-mail" );
            res.redirect( "/user/registro" );
        } else
        {

            try
            {
                let senhaHash = hashear( senha );
                new usuario( {
                    nome,
                    email,
                    senha: senhaHash
                } ).save().then( (user) =>
                {
                    req.logIn(user,{session:true,keepSessionInfo:true}, (err)=>{
                        if(err){console.error(err)}else{
                            req.flash( "succsses_msg", "cadastro concluído" );
                             res.redirect("/")
                        }
                    })  
                } );


            } catch ( error )
            {
                req.flash( "error_msg", "houve um erro no cadastro " + error );
                res.redirect( "/" );
            }
        }
    }
})// , ( req, res, next ) =>
// {   
// passport.authenticate( "local", {
//         successRedirect: "/",
//         failureRedirect: "/user/registro",
//         successMessage:"cadastrado com sucesso",
//         successFlash:true,
//         failureFlash: true,
//     } )(req,res,next)
// });
router.get( "/login", ( req, res ) =>
{
    res.render( "user/login" );
} );
router.post( "/login", ( req, res, next ) =>
{
  passport.authenticate( "local", {
        successRedirect: "/",
        failureRedirect: "/user/login",
        failureFlash: true,
    } )( req, res, next );
} ),
    ( req, res ) =>
    {
        let erros = [];
        const { email, senha } = req.body;
        checarSeNulo( email, "email", erros );
        checarSeNulo( senha, "senha", erros );
        if ( senha.length < 4 )
        {
            erros.push( {
                mensagem: "senha muito curta"
            } );
        }
        if ( erros.length > 0 )
        {
            res.json( erros );
        } else
        {
            res.json( { email, senha } );
        }
    };
    router.get("/logout",(req,res,next)=>{
        req.logout( ( err ) =>
        {
            if(err){next(err)}
            req.flash( 'succsses_msg ', "Deslogado com sucesso!" );
            res.redirect( "/" );
        } )
       
    })
        router.get("/categorias",async (req,res)=>{
            try {
                let   categorias =await categoria.find().lean()
                res.render("user/categorias",{categorias:categorias})
            }catch(e){
                console.error(e)
                req.flash("error_msg","erro em mostrar os posts")
                res.redirect("/")

            }
        })
        
        router.get("/categorias/:slug",async (req,res)=>{
            const {slug} = req.params
            try {
                let categorias = await categoria.findOne({slug:slug}).lean()
                let posts =await  Post.find({categoria:categorias._id}).populate("categoria").lean()
                res.render("user/postCat",{posts:posts,categoria:categorias}) 
            }catch(e){
                console.error(e)
                req.flash("error_msg","erro em mostrar os posts de categoria ")
                res.redirect("/")
            }
        })
        router.get("/post",async(req,res)=>{
            try
            {
            const posts= await Post.find().populate("categoria").exec()
            res.render("user/post",{posts:posts.map((e)=>e.toJSON({getters:true}))})
        }catch(e){
                console.error( e );
                req.flash( "error_msg", "erro em mostrar os posts " );
                res.redirect( "/" )
        }
        })
        router.get( "/post/:slug", async ( req, res ) =>
        {   
            try{
            const { slug } = req.params;
            let post = await Post.findOne( { slug: slug } ).exec();
            let markConteudo = markup.parse( post.conteudo );
            res.render( "user/postagem", { post: post.toJSON( { getters: true } ), markConteudo: markConteudo } );
        }catch(e){
                console.error( e );
                req.flash( "error_msg", "erro em mostrar os posts " );
                res.redirect( "/" )
        }
        } );
module.exports = router;
