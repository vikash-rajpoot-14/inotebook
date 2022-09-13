const express = require('express')
const router = express.Router();
const User = require("../models/User")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = "Vikash is a smart child";
var fetchuser = require('../middleware/fetchuser')

//ROUTE 1::create a user using Post:"api/auth/login"   don't require auth
router.post('/createUser', [
  body('name', 'enter altleat 5 character name').isLength({ min: 5 }),
  body('email', "enter a valid email").isEmail(),
  body('password', 'enter at least 5 charcter password').isLength({ min: 5 }),
], async (req, res) => {
  //seee if there is error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Check whether user with the email exist already
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "sorry a user with this email already exist" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    //create user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })

    //returning token to user to simplify login. 
    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    res.send({ authToken })
  } catch (error) {
    console.error(error.message)
    res.status(500).send("internal server error occured")
  }
})


//ROUTE 2::Authenticat a user using :Post "api/auth/login"  NO LOGIN REQUIRED
router.post('/login', [
  body('email', "enter a valid email").isEmail(),
  body('password', 'enter at least 5 charcter password').exists()
], async (req, res) => {

  //if there are error return bad request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: "please try to login with correct credentials" })
    }
    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
      return res.status(400).json({ error: "please try to login with correct credentials" })
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    res.send({ authToken })
  } catch (error) {
    console.error(error.message)
    res.status(500).send("internal server error occured")
  }
});

//ROUTE 3::Get logged in user details using port:"api/auth/getuser"  login required

router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password')
    res.send(user)
  } catch (error) {
    console.error(error.message)
    res.status(500).send("internal server error occured")
  }
})

module.exports = router