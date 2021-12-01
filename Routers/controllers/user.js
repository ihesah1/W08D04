const User = require("./../../db/models/post");
const _ =require("lodash");
const formidable = require("formidable");
const fs = require("fs");

const create = (req,res)=>{

    const {name ,email,password} = req.body;
    const user = new User({name ,email,password});
    user.save((err, user)=>{
        if(err) res.json({error:err});
        res.json(user);
    });
}

const getUser = (req,res,next,id) =>{
   req.profile.hashed_password = undefined
   req.profile.salt = undefined
   

}
 