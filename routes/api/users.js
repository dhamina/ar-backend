const express= require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const {check, validationResult} = require('express-validator');
const User= require(('../../models/User'));
const  config= require("config");
// GET api/users
//public
//@desc Test route
router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','email is required').not().isEmpty().isEmail(),
    check('password','Password must be at least 8 characters and maximum length is 15').not().isEmpty().isLength({min: 5, max:15}),
],async(req,res)=>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
     return res.status(400).json({ error:errors.array()})
    }


   const {name, email,password} = req.body;

     try{
         let user= await User.findOne({email});
        
         if(user){
          return res.status(400).json({ error:[{msg:"User already Exists"}]})   
         }      
            user= new User({
                name,
                email,
                password
            })
            const salt = await bcrypt.genSalt(10);
            user.password= await bcrypt.hash(password,salt);
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
            console.log(e.message);
           return  res.status(500).send('Server error')

     }

  
});

module.exports= router;