
//  express API
const mongoose = require('mongoose');

let _ = require('lodash');

const express = require('express');
const app = express.Router();
app.use(express.json()); //  middleware function

const user = require('../modules/user')
const admin = require('../modules/admin')
const superadmin = require('../modules/superadmin')

const {validateMobileProduct } = require('../validate')


// need schema to  create the json db structure
const mobileSchema = new mongoose.Schema({
   
    // mongoose validation 
        company: { type : String , required : true},
        model : {type : String , required : true} ,
        screen_size: {type : Number , required : true},
        price: {type : Number , required : true},
        camera_specifications: { type: String, lowercase: true, trim: true  , required : true},
        ram: { type : Number , required : true},
        isDiscountAvailable: {type :Boolean , required : true},
        imageUrl: {type : String , required : true},
        modelYr :""

})

const Product = mongoose.model('Product', mobileSchema); // collection class



//1.  API FUNCTION  GET 
app.get('/'  , async ( req , res)=>{
   
    try{
    // throw new Error("product not found !"); 
    const products = await Product.find()
    .catch(err => res.send(`products not found : ${err.message}`))
    console.log(products);
    res.send(products);
    }catch(ex){
        winston.error(ex.message, ex);
        next(ex);
    }
})

//1.  API FUNCTION  GET FOR SINGLE ID 
app.get('/:id', user , async (req , res)=>{
    try{

    const products = await Product.findById(req.params.id)
    .catch(err => res.send(`product not found : ${err.message}`))
    console.log(products);
    res.send(products);

    }catch(ex){
        winston.error(ex.message, ex);
        next(ex);
    }
})


//2. API FUNCTION PUT Update Product
app.put('/:id', admin ,async (req ,res)=>{

    try{
    // look the id is or not 
    const product = await Product.findById(req.params.id)
    .catch(err => res.send(`product not found : ${err.message}`))


     // user object validation 
     const {error} = validateMobileProduct(req.body); // object distructor like result.error
     if(error){
         // 400 bad req invalid input data
         res.status(400).send(error.details[0].message);
         return;
     }
     
     product.set( (_.pick(req.body , ['company' , 'model' , 'screen_size' , 'price' , 
     'camera_specifications' ,'ram' ,'isDiscountAvailable' , 'imageUrl']))  )

  const productResult = await product.save() // save the update changes in db
  .catch(err => res.send(` unable to update the product : ${err.message}`))
    res.send(productResult);
}catch(ex){
    winston.error(ex.message, ex);
    res.send(ex.message)
}

})


//2. API FUNCTION PUT Update Product
app.post('/', admin ,async (req ,res)=>{

    try{
     // user object validation 
     const {error} = validateMobileProduct(req.body); // object distructor like result.error
     if(error){
         // 400 bad req invalid input data
         res.status(400).send(error.details[0].message);
         return;
     }

   
     // lodash is used to pick up the req.body prop it is same as underscore lib

       const product = new Product(
        (_.pick(req.body , ['company' , 'model' , 'screen_size' , 'price' , 
       'camera_specifications' ,'ram' ,'isDiscountAvailable' , 'imageUrl']))  )
 
          const result = await product.save()
          res.send(result);

    }catch(ex){
        winston.error(ex.message, ex);
        res.send(ex.message)
    }

})


// 4 API  FUNCTION DELETE deleteProduct

app.delete('/api/products/:id' , superadmin , async (req,res)=>{

    try{
    const product = await Product
    .findOneAndRemove({_id : req.params.id}) 
    .exec(function(err, item) {
        if (err) {
            return res.json({success: false, msg: 'Cannot remove product'});
        }       
        if (!item) {
            return res.status(404).json({success: false, msg: 'product not found'});
        }  
        res.json({success: true, msg: 'mobile product deleted.'});
    });
        }catch(ex){
            winston.error(ex.message, ex);
            next(ex);
        }

})


module.exports = app;