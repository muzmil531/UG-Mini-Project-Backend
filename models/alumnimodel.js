const mongoose=require('mongoose');
const Schema=mongoose.Schema;
let alumnimodel=new Schema({
    name:{
        type:String
    },
    yop:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    companyname:{
        type:String
    },
    role:{
        type:String
    },
    skillset:{
        type:String
        },
    domain:{
        type:String
    },
    approvedalumni:{
        type:Boolean,
        default:false
    },
    roleid:{
        type:Number,
        default:2
    }
});
const alumni=mongoose.model('amsalumnis',alumnimodel);
module.exports=alumni;