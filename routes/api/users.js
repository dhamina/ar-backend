const express= require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');

const router = express.Router();
const {check, validationResult} = require('express-validator');
const User= require(('../../models/User'));
const  config= require("config");
// GET api/users
//public
//@desc Test route
router.post('/', async(req,res)=>{

   const {name, email, password} = req.body;

     try{
  
            if(name.isEmpty)
            {
                return res.status(400).json({ error:[{param: "name", msg:"Name is required"}]}); 
            }

            var emailWords = crypto.enc.Base64.parse(email);
            const emailDecoded = crypto.enc.Utf8.stringify(emailWords);

            var passwordWords = crypto.enc.Base64.parse(password);
            const passwordDecoded = crypto.enc.Utf8.stringify(passwordWords);

        
            const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            if(!emailDecoded.match(emailRegexp))
            {
                return res.status(400).json({ error:[{param: "email", msg:"Please enter a valid mail address"}]}); 
            }

            if(passwordDecoded.length < 8 || passwordDecoded.length > 15)
            {
                return res.status(400).json({ error:[{param: "password", 
                msg:"Password must be at least 8 characters and maximum length is 15"}]}); 
            }

            console.log(emailDecoded);

         let user= await User.findOne({emailDecoded});
        
         console.log(user);
         
         if(user){
          return res.status(400).json({ error:[{msg:"User already Exists"}]})   
         }      

            user= new User({
                name,
                email,
                password
            })
            const salt = await bcrypt.genSalt(10);
            user.passwordDecoded= await bcrypt.hash(passwordDecoded,salt);
            user.email = await emailDecoded;

            await user.save();
            const payload={
                user:{
                    id:user.id
                }
            }
            jwt.sign(payload,config.get('jwtSecret'),(err,token)=>{
                if(err) throw err;
               return  res.json({token});

            })
         }
            catch(e){
                console.log(e);
           return  res.status(500).send('Server error')

     }

  
});

module.exports= router;