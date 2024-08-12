const mongoose = require("mongoose")
const {Schema} = mongoose

const categoriaS = new Schema({
    
    nome:{
        type:String,
        required:true,
    },
    slug: {
        type: String,
        required: true, 
        validate:{
            validator:(v)=>{
                return !/[^A-z\d][\\\^]?/g.test(v)
            },
            message:props => `${props.value} não e um Slug valido`
            
        }        
    },
    data:{
        type:Date,
        default:Date.now(), 
        get: val=> `${val.getDate()}/${val.getMonth()}/${val.getFullYear() }`
    }
})
let categoriaM= mongoose.model("categoria",categoriaS)

module.exports= categoriaM;