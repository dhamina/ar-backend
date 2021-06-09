const express= require('express');
const router = express.Router();
const auth = require("../../middlewarre/auth")

const User= require("../../models/User")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
router.post('/',[
    check('email','email is required').not().isEmpty(),
    check('password','password is required').exists(),
],async(req,res)=>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
     return res.status(400).json({ error:errors.array()})
    }


   const {email,password} = req.body;

     try{
         let user= await User.findOne({email});
        
         if(!user){
          return res.status(400).json({ error:[{msg:"User doesnot Exist"}]})  ; 
         }      
   
         const isMatch = await bcrypt.compare(password,user.password);
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