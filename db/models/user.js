const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
 const {ObjectId } = mongoose.Schema ;


 const UserSchema = new mongoose.Schema({
    name :{
        type:String,
        required:true
    },
    image :{
        data : Buffer,
        contentTypy: String
    },
    email :{
        type:String,
        unique:true, //one email
        required:true
    },
    hashed_password : {
        type:String,
        required:true
    } ,  
}
     ,{
        timestamps:true,
    }
);
 module.exports=mongoose.model("User", UserSchema)