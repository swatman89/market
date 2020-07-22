const jwt = require('jsonwebtoken');
const config = require("config")

const auth = async(req,res,next) => {
  const token = req.header("x-auth-token");
  // אומר שלא נשלח הידר בכלל ואז נציג שגיאה
  if(!token) {
    return res.status(400).json({ message: "error token you must send header 1" })
  }
  try{
    const decode = jwt.verify(token,config.get("tokenKey"));
    // מייצרים כדי שהפונקציה הבא שתעבוד תכיר את המידע
    // שיש בתוך הטוקן
    req.decoded = decode;
    // let nowUnix = Date.parse(new Date());
    // console.log(req.decoded,nowUnix/1000)
    next()
  }
  catch{
    // אם מגיע לקצ' אומר שהטוקן לא תקין ולא תואם לסיקריט שלנו
    return res.status(400).json({ message: "error token 2 not valid 2" })
  }
}

module.exports = auth;