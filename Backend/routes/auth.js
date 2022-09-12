const express=require('express')
const router= express.Router();
const User=require("../models/User")
const { body, validationResult } = require('express-validator');

//create a user using Post:don't require auth
router.post('/',[
    body('name','enter altleat 5 character name').isLength({ min: 5 }),
    body('email',"enter a valid email").isEmail(),
    body('password','enter at least 5 charcter password').isLength({ min: 5 }),
],(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create({                                                                                                                                         
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      }).then(user => res.json(user))
      .catch(error=>{console.log(error)
        res.json({error:'please enter valid email',message:error.message})})
})
module.exports=router