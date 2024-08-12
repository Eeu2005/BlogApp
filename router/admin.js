const e = require( "express" );
let Router = e.Router();
let mongoose = require( "mongoose" );
let categoria = require( "../models/Categoria" );
let postagem = require( "../models/Posts" );
let checarSeNulo = require( "../helpers/checarFunc" );
//rotas categorias
Router.get( "/", ( req, res ) =>
{
    res.render( "admin/index" );
} );

Router.get( "/categorias", async ( req, res ) =>
{
    let list = ( await categoria.find().exec() ).map( ( obj ) => obj.toJSON( { getters: true } )
    );
    res.render( "admin/categorias", { categorias: list } );
} );
Router.get( "/categorias/add", ( req, res ) =>
{
    res.render( "admin/categoriasAdd" );
} );
Router.get( "/categorias/edit/:id", async ( req, res ) =>
{
    let { id } = req.params;
    let cat = await categoria.findById( id ).then( ( e ) => e.toJSON() );
    res.render( "admin/categoriasAdd", { edit: cat } );
} );
Router.post( "/categorias/edit/:id", async ( req, res ) =>
{
    const { slug, id, nome } = req.body;
    let erros = [];
    checarSeNulo( nome, "nome", erros );
    checarSeNulo( slug, "slug", erros );
    try
    {
        await categoria.findByIdAndUpdate( { _id: id }, {
            nome: nome,
            slug: slug,
        }, { runValidators: true } ).exec();
        req.flash( "succsses_msg", "categoria modificada com sucesso" );
        res.redirect( "/admin/categorias" );
    } catch ( err )
    {
        erros.push( { mensagem: err.message } );
        let cat = await categoria.findById( id ).then( ( e ) => e.toJSON() );
        res.render( "admin/categoriasAdd", { edit: cat, erros: erros } );
    }

} );
Router.get( "/categorias/delete/:id", ( req, res ) =>
{
    const { id } = req.params;
    categoria.deleteOne( { _id: id } ).exec().then( ( E ) =>
    {
        req.flash( "succsses_msg", "categoria deletada com sucesso" );
        res.redirect( "/admin/categorias" );
    } );

} );
Router.post( "/categorias/add", async ( req, res ) =>
{
    const { slug, nome } = req.body;
    const erros = [];
    checarSeNulo( nome, "nome", erros );
    checarSeNulo( slug, "Slug", erros );
    const novaCategoria = { nome, slug };
    let temp = new categoria( novaCategoria );
    const errors = temp.validateSync();
    if ( errors )
    {
        erros.push( { mensagem: errors.message } );
    }
    if ( erros.length > 0 )
    {
        res.render( "admin/categoriasAdd", { erros: erros } );
    } else
    {
        try
        {
            await temp.save();
            req.flash( "succsses_msg", "categoria Salvo com sucesso" );
            res.redirect( "/admin/categorias" );
        } catch ( e )
        {
            req.flash( "error_msg", "erro na hora de salvar tente mais tarde" );
            res.redirect( "/admin/categorias" );
        }
    }
} );
// Rotas postagens
Router.get( "/post", async ( req, res ) =>
{
    let post = ( await postagem.find().populate( "categoria" ) ).map( ( e ) => e.toJSON( { getters: true } ) );
    if ( req.headers.mode == "json" )
    {
        res.json( post );
    } else
    {
        res.render( "admin/postagens", { posts: post } );
    }
} );
Router.get( "/post/add", async ( req, res ) =>
{
    const categorias = await categoria.find().lean();
    res.render( "admin/postagensform", { categorias: categorias } );
} );
Router.post( "/post/add", async ( req, res ) =>
{
    console.log(req.body)
    if(req.body.categoria=="null"){
        req.flash("error_msg","cadastre uma categoria primeiro")
        res.redirect("/admin/categorias/add")
        return
    }
    const novoPost = req.body;
    let temp = new postagem( novoPost );
    let erros = temp.validateSync();
    if ( erros )
    {
        const categorias = await categoria.find().lean();
        res.render( "admin/postagensform", { categorias: categorias, erros, erros } );
    } else
    {
        try
        {
            await temp.save();
            req.flash( "succsses_msg", "post Salvo com sucesso" );
            res.redirect( "/admin/post" );
        } catch ( e )
        {
            req.flash( "error_msg", "erro na hora de salvar tente mais tarde" );
            res.redirect( "/admin/post" );
        }
    }
} );
Router.get( "/post/edit/:id", async ( req, res ) =>
{
    const { id } = req.params;
    const post = await postagem.findById( id ).populate( "categoria" ).lean();
    const categorias = await categoria.find().where( "_id" ).ne( post.categoria ).lean();
    res.render( "admin/postagensform", { categorias: categorias, post: post } );
} );
Router.post( "/post/edit/:id", async ( req, res ) =>
{
    const { id } = req.params;
    const body = req.body;
    try
    {
        let temp = await postagem.findByIdAndUpdate( { _id: id }, body, { runValidators: true } ).exec();
        req.flash( "succsses_msg", "post editado" );
        res.redirect( "/admin/post" );
    } catch ( e )
    {
        const post = await postagem.findById( id ).exec().then( ( e ) => e.toJSON() );
        const categorias = await categoria.find().lean();
        res.render( "admin/postagensform", { categorias: categorias, post: post, erros: e } );
    }
} );
Router.post( "/post/delete/:id", ( req, res ) =>
{
    postagem.findByIdAndDelete( req.params.id, ).then( () =>
    {
        req.flash( "succsses_msg", "post deletado com sucesso" );
        res.redirect( "/admin/post" );
    } ).catch( () =>
    {
        req.flash( "error_msg", "erro em deletar" );
    } );
} );


module.exports = Router;