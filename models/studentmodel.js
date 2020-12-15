const mongoose=require('mongoose');
const Schema=mongoose.Schema;
let signUp=new Schema({
    _id:{
        type:Schema.Types.ObjectId
    },
    name:{
        type:String
    },
    rollno:{ 
        type:String
    },
    yop:{
        type:String
    },
    department:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    contactnumber:{
        type:String
    },
    roleid:{
        type:Number,
        default:1
    }
});
const user=mongoose.model('amsstudents',signUp);
module.exports=user;