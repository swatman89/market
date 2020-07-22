const express = require('express');
const router = express.Router();
const {prodsModel,validProd} = require("../models/prods_model")
const auth = require("../middleware/auth");

/* GET home page. */
router.get('/', (req, res, next) => {
  // סורט ממיין לפי המאפיין , אם כתוב מינוס אז לפי הגדול לקטן
  // ואם כתוב 1 מהקטן לגדול
  prodsModel.find({})
  .sort({_id:-1})
  .then(data => {
    res.json(data)

  })
});



router.get('/all', auth, (req, res, next) => {
  prodsModel.find({})
  .sort({_id:-1})
  .then(data => {
    res.json(data)

  })
});




// כדי שנוכל לערוך , אנחנו נרצה קודם לשלוף את כל המידע שיש על המוצר הספציפי
// ככה שיהיה רשום באינפוטים בהתחלה כבר  
router.get('/single/:id', (req, res, next) => {

  prodsModel.findOne({_id:req.params.id})
  .then(data => {
    res.json(data)
    
  })
  .catch(err => {
    res.status(400).json(err)
  })
});

router.post("/add", auth,async(req,res) => {
  let dataBody = req.body;
  dataBody.user_id = req.decoded._id;
  let prod = await validProd(dataBody);
  if(prod.error){
    res.status(400).json(prod.error.details[0])
  }
  else{
    try{
      let saveData = await prodsModel.insertMany([req.body]);
      res.json(saveData[0])
      
    }
    catch{
      // במקרה שקיים כבר מוצר עם אותו שם
      res.status(400).json({ message: "error insert new prod, already in data" })
    }
  }
})

router.post("/update",auth,async(req,res) => {
  let dataBody = req.body;
  let prod = await validProd(dataBody);
  if(prod.error){
    res.status(400).json(prod.error.details[0])
  }
  else{
    try{
      // באפדייט צריך למצוא איי די קודם , חוץ מזה די דומה להוספה
      let updateData = await prodsModel.updateOne({_id:req.body.id},req.body);
      res.json(updateData)
      
    }
    catch{
      res.status(400).json({ message: "error cant find id" })
    }
  }
})


/// בהפסקה לעשות גם המחיקה בריאקט והעריכה ישתמשו בטוקן

router.post("/del",auth,(req,res) => {
  let delId = req.body.del
  /// מחפש את מי למחוק לפי איי די שנשלח לו
  prodsModel.deleteOne({_id:delId})
  .then(data => {
    if(data.deletedCount > 0 ){
      res.json({message:"deleted",del:"ok"});
    }
    else{
      res.status(400).json({error:"error id not found"});
    }
  })
})

router.get("/cat/:catId",(req,res) => {
  let catId = req.params.catId;
  prodsModel.find({cat:catId})
  .then(data => {
    res.json(data);
  })
  .catch(err => {
    res.status(400).json(err)
  })
})

router.get("/search/",(req,res) => {
// מה שבא אחרי הסימן שאלה נקרא
// QUERY STRING and we collect it with req.query....
  //http://localhost:3000/prods/search/?q=Mil
  // משתמשים בריגולר מכיוון שאנחנו רוצים לעשות חיפוש
  // לחלק מהסטינג ושלא יהיה מדוייק
  const mySearch = new RegExp(`${req.query.q}`);
  //const mySearch = req.query.q;
  // prodsModel.find({name:mySearch})
  // $or = קווירי מיוחד של המונגו לחיפוש בכמה עמודות
  prodsModel.find({$or:[{name:mySearch},{cat:mySearch}]})
  .then(data => {
    res.json(data)
  })
})

//מחזיר את המחיר המנימלי
router.get("/price",(req,res) => {
  //gte == greate equal >=
  //http://localhost:3000/prods/price/?min=10
  prodsModel.find({price:{$gte:req.query.min}})
  .then(data => {
    res.json(data);
  })
})





module.exports = router;
