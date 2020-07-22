var express = require('express');
const { validateUser,userModel ,genUserToken} = require('../models/users_models');
const bcrypt = require("bcrypt")
const _ = require("lodash");
const auth = require("../middleware/auth");


var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  userModel.find({})
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      // חשוב לשלוח סטטוס 400 כדי שבצד לקוח הוא יתפוס אותו בקצ' של הפיטץ'
      res.status(400).json(err)
    })
});
// הוספת משתמש חדש
router.post("/add",async(req,res) => {
  // בודק שנשלחו כל הפריטים בצורה נכונה לפי המודל גו'י שביקשנו
    let validUser = validateUser(req.body)
    if(validUser.error){
      return res.status(400).json(validUser.error.details[0]);
    }
// 10 מייצג רמת קידוד ואבטחה שזה סבבה בשבילנו ייקח כמה ימים לפרוץ
    const salt = await bcrypt.genSalt(10);
    req.body.pass = await bcrypt.hash(req.body.pass,salt)
    req.body.answer = await bcrypt.hash(req.body.answer,salt)

    try{
     let saveData = await userModel.insertMany([req.body]);
     res.json(_.pick(saveData[0], ["_id", "email", "date"]));
    }
    catch{
      res.status(400).json({ message: "error insert new user, check email" })
    }
})

router.post("/login",async(req,res) => {
  let user = await userModel.findOne({email:req.body.email});
  if(user){
    // מחזיר אמת או שקר כבוליאן 
    let validPass = await bcrypt.compare(req.body.pass,user.pass)

    if(validPass){
      // מייצר טוקן מהמאייל והאיידי של המשתמש
      let newToken = genUserToken({email:user.email,_id:user._id})
      res.json({token:newToken})
    }
    else{
      res.status(400).json({ message: "Problem login pass not match" });
    }
  }
  else{
    res.status(400).json({ message: "Problem login user not found" });
  }
})

// נשתמש לבדיקה ראשונית בצד לקוח
// אם למשתמש יש בכלל טוקן
router.get("/checkToken",auth,(req,res) => {
  res.json({message:"ok" , status:"login"})
})

module.exports = router;
