const { Types } = require( "mongoose" );
const mongoose = require("mongoose");
const hashear = require( "../helpers/hash" );
// mongoose.connect("mongodb://localhost:27017/blogApp_db")
const {Schema}  = mongoose

const usuario = new Schema({
    nome:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true
    },
    admin:{
        type:Number,
        default:0
    },
    senha: {
        type: String,
        required: true
    }
})
let modelUsuario= mongoose.model("usuario",usuario)

//   new modelUsuario({
//     nome:"emanuel",
//     email:"emanuel.admin@email.com",
//     senha:hashear("123"),
//     admin:1
// }).save().then((e)=>{
//     console.log(e.toJSON())
// })

 module.exports =modelUsuario