const mongoose = require("mongoose");
 const {ObjectId } = mongoose.Schema ;

 const PostSchema = new mongoose.Schema({
    text :{
        type:String,
        required:true
    }, 
    postedBy:{
        type: ObjectId,
        trim:"User" //trim to save string without whitespace
    },
    likes : [{type:ObjectId, ref:"User"}],
    Comments :[{
        type:String,
        created : {type:Date, default:Date.now},
        postedBy:{
            type: ObjectId,
            trim:"User" ,
        },
    },
],
 },
    { timestamps: true}
);
module.exports=mongoose.model("Post", PostSchema);