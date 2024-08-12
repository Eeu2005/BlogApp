const mongo = require("mongoose")
const {Schema} = mongo

const PostagemS = new Schema({
    titulo:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
        validate: {
            validator: ( v ) =>
            {
                return !/[^A-z\d][\\\^]?/g.test( v );
            },
            message: props => `${props.value} não e um Slug valido`

        }    
    },
    descricao: {
        type: String,
        required: true
    },
    conteudo: {
        type: "String",
        required: true
    },
    categoria:{
        type:Schema.ObjectId,
        ref:"categoria",
        required:true
    },
    data:{
        type: Date,
        default :Date.now(),
        get: val => `${val.getDate()}/${val.getMonth()}/${val.getFullYear()}`
    }

})
let PostagemM = mongo.model("postagens",PostagemS)
module.exports = PostagemM