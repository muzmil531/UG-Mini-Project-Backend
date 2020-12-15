const mongoose=require('mongoose');
const Schema=mongoose.Schema;
let adminmodel=new Schema({
    _id:{
        type:Schema.Types.ObjectId
    },
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    contactnumber:{
        type:String
    },
    jobiid:{
        type:String
    }
})

const admin=mongoose.model('amsadmins',adminmodel);
module.exports=admin;