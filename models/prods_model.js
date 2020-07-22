const mongoose = require("mongoose");
const Joi = require("@hapi/joi")

let prodsSchema = mongoose.Schema({
  cat: {
    type:String,
    required:true,
    minLength:2,
    maxLength:99
  },
  name: {
    type:String,
    required:true,
    minLength:2,
    maxLength:99
  },
  price: {
    type:Number,
    required:true,
    maxLength:99
  },
  image: {
    type:String,
    required:true,
    minLength:2,
    maxLength:200
  },
  user_id:{
    type:String,
    minLength:2,
    maxLength:200
  },
  date:{type:Date,default:Date.now()}
})

exports.prodsModel = mongoose.model("prods",prodsSchema);

const validProd = (_prod) => {
  let JoiSchema = Joi.object({
    id:Joi.string(),
    cat:Joi.string().min(2).max(99).required(),
    name:Joi.string().min(2).max(99).required(),
    price:Joi.number().max(99999999).required(),
    image:Joi.string().min(2).max(300).required(),
    user_id:Joi.string().min(2).max(200)
  })

  return JoiSchema.validate(_prod);
}

exports.validProd = validProd;