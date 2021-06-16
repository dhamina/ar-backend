const express= require('express');
const router = express.Router();
const auth = require("../../middlewarre/auth")

const User= require("../../models/User")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');

const {check, validationResult} = require('express-validator');
const  config= require("config");
// GET api/auth
//public
//@desc auth route
router.get('/',auth,async (req,res)=>{
    try{
     const user= await User.findById(req.user.id).select('-password')
     res.json(user)
    }
    catch(e){
    console.error(e)
    return res.status(500).send('Server Error')
    }
});

// GET api/auth
//public
//@desc Test route
router.post('/', async(req,res)=>{


   const {email,password} = req.body;

     try{

        var emailWords = crypto.enc.Base64.parse(email);
        const emailDecoded = crypto.enc.Utf8.stringify(emailWords);

        var passwordWords = crypto.enc.Base64.parse(password);
        const passwordDecoded = crypto.enc.Utf8.stringify(passwordWords);
        console.log('passwordDecoded', passwordDecoded);
        console.log('emailDecoded:', emailDecoded);

    
        const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if(!emailDecoded.match(emailRegexp))
        {
            return res.status(400).json({ error:[{param: "email", msg:"Please enter a valid mail address"}]}); 
        }
        
         let user= await User.findOne({emailDecoded});
         console.log(user);
        
         if(!user){
          return res.status(400).json({ error:[{msg:"User doesnot Exist"}]})  ; 
         }      
   
         console.log('DB password:', user.password);
         const isMatch = await bcrypt.compare(passwordDecoded,user.password);
         if(!isMatch){
           return res.status(400).json({ error:[{msg:"Invalid credentials"}]})  
         }
            const payload={
                user:{
                    id:user.id
                }
            }
            jwt.sign(payload,config.get('jwtSecret'),(err,token)=>{
                if(err) throw err;
               return  res.json({token,
               id:user.id,
               name:user.name,
               email:user.email
            });

            })
         }
            catch(e){
            console.log(e.message);
            return  res.status(500).send('Server error')

     }

  
});

module.exports= router;