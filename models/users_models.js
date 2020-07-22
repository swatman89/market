const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const config = require("config");
// כדי להפוך בדאטא בייס את אחד מהפרופ לייחודי 
// db.users.createIndex({"email":1},{unique:true})

// const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
  email:String,
  pass:String,
  answer:String,
  date:{ type:Date, default:Date.now}
})

/// מייצא מודל שמחבר בין הקולקשן לסכמה שלו
exports.userModel = mongoose.model("users",userSchema);

// מחולל תוקן לפי מידע שמקבל
const genUserToken = (_item) => {
  // תחתום את המידע כסודי והשתמש במילה מאנקיס כסודית
  // ככה שיהיה קשה לפענח את הטוקן הנל
  const token = jwt.sign(_item,config.get("tokenKey"),{expiresIn:"10sec"});
  return token;
}

exports.genUserToken = genUserToken;



// בדיקה שרת לפני ששולחים למסד נתונים את המידע שגם שם יש בדיקה
// אחרונה
const validateUser = (_user) => {
  const schema = Joi.object({
    email:Joi.string().min(5).max(80).email().required(),
    pass:Joi.string().min(2).max(80).required(),
    answer:Joi.string().min(2).max(80).required()
  }) 

  return schema.validate(_user)
}

exports.validateUser = validateUser