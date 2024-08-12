const localStrategy = require( "passport-local" ).Strategy;
const mongoose = require( "mongoose" );
const hashear = require( "../helpers/hash" );
const user = require( "../models/usuario" );
function func ( passport )
{
    passport.use( new localStrategy( { usernameField: "email", passwordField: "senha" }, async ( email, senha, done ) =>
    {
        const usuario = await user.findOne( { email: email } ).exec();
        if ( !usuario )
        {
            return done( null, false, { message: "Conta não existente" } );
        }
        if ( hashear( senha ) === usuario.senha )
        {
            return done( null, usuario,{message:"logado com sucesso"} );
        } else
        {
            return done( null, false, { message: "Senha incorreta" } );
        }


    } ) );
    passport.serializeUser( ( user, done ) =>
    {
        done( null, user.id );
    } );
    passport.deserializeUser( ( id, done ) =>
    {
        user.findById( id ).then( ( us ) => done( null, us ) );
    } );
}
module.exports = func;
