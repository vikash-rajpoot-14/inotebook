var jwt = require('jsonwebtoken');
const JWT_SECRET="Viaksh is a smart child";

const fetchuser=(req,res,next)=>{
//Get user from the jwt token and add id to req obj
const token =req.header('auth-token')
if(!token){
    res.status(400).send({error:'please enter correct credentials'})
}
try{
    const data= jwt.verify(token,JWT_SECRET)
    req.user=data.user;
    next();
}catch(error){
    res.status(401).send({error:'please authenticate the valid token'})
}}
module.exports=fetchuser;
