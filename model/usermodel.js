const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/user');

const Schema=mongoose.Schema;

const userSchema= new Schema({
    fullname:String,
    email:{type:String,unique:true},
    password:{type:String,minlength:8,maxlength:20},
    hash:String
})

var userData= mongoose.model('userdata',userSchema);

module.exports=userData;