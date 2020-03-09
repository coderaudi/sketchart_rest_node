
//  express API
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
let _ = require('lodash');

const express = require('express');
const app = express.Router();
app.use(express.json()); //  middleware function

const user = require('../modules/user')
const admin = require('../modules/admin')
const superadmin = require('../modules/superadmin')

const {validateMobileProduct , validateSketchartUser} = require('../validate')


// need schema to  create the json db structure
const userSchema = new mongoose.Schema({
    // mongoose validation 
    username: { type: String, required: true },
    useremail: { type: String, required: true },
})



const User = mongoose.model('sketchart_users', userSchema); // collection class

const Gallary = mongoose.model('sketchart_gallary', userSchema); // collection class



// login 


//2. API FUNCTION PUT Update Product
app.post('/login', (req, res) => {
    // Mock user
    const user = {
      id: 1, 
      username: 'brad',
      email: 'brad@gmail.com',
      isAdmin : false
    }
  
    jwt.sign({user}, 'secretkey', { expiresIn: '8000s' }, (err, token) => {
      res.json({
        token
      });
    });
  });


// post to sketchart user

//1.  API FUNCTION  GET 
app.get('/allusers', async (req, res) => {

    try {
        // throw new Error("product not found !"); 
        const allusers = await User.find()
            .catch(err => res.send(`products not found : ${err.message}`))
        console.log(allusers);
        res.send(allusers);
    } catch (ex) {
        winston.error(ex.message, ex);
        next(ex);
    }
})


//2. API FUNCTION PUT Update Product
app.post('/add', user , async (req, res) => {

    try {
      //  user object validation 
        // const { error } = validateSketchartUser(req.body); // object distructor like result.error
        // if (error) {
        //     // 400 bad req invalid input data
        //     res.status(400).send(error.details[0].message);
        //     return;
        // }

      //  lodash is used to pick up the req.body prop it is same as underscore lib

        const user = new User(
            (_.pick(req.body , ['username' , 'useremail']))  )

           
        // const user = new User( {
        //     username : req.body.username ? req.body.username : "def_username" ,
        //     useremail : req.body.useremail ? req.body.useremail : "def@gmal.com"
        // });

        const result = await user.save()
        res.send(result);
        console.log("user added")
        next();

    } catch (ex) {
        // winston.error(ex.message, ex);
        res.send(ex.message)
        next(ex);
    }

})


// post  pic 


app.post('/pic' , async (req, res) => {

    try {
    
        let img =  {
            src: "https://mymodernmet.com/wp/wp-content/uploads/2019/03/elements-of-art-6.jpg",
            alt: "img-title",
            description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
            price: "",
            offers: ""
        };

        let gallaryAry = Array(50).fill(img);
        const gallary = new Gallary({ gallary : gallaryAry})

        const result = await gallary.save()
        res.send(result);
    
        next();

    } catch (ex) {
        // winston.error(ex.message, ex);
        res.send(ex.message)
        next(ex);
    }

})










//1.  API FUNCTION  GET 
app.get('/', async (req, res) => {

    try {
        // throw new Error("product not found !"); 
        const products = await Product.find()
            .catch(err => res.send(`products not found : ${err.message}`))
        console.log(products);
        res.send(products);
    } catch (ex) {
        winston.error(ex.message, ex);
        next(ex);
    }
})

//1.  API FUNCTION  GET FOR SINGLE ID 
app.get('/:id', user, async (req, res) => {
    try {

        const products = await Product.findById(req.params.id)
            .catch(err => res.send(`product not found : ${err.message}`))
        console.log(products);
        res.send(products);

    } catch (ex) {
        winston.error(ex.message, ex);
        next(ex);
    }
})


//2. API FUNCTION PUT Update Product
app.put('/:id', admin, async (req, res) => {

    try {
        // look the id is or not 
        const product = await Product.findById(req.params.id)
            .catch(err => res.send(`product not found : ${err.message}`))


        // user object validation 
        const { error } = validateMobileProduct(req.body); // object distructor like result.error
        if (error) {
            // 400 bad req invalid input data
            res.status(400).send(error.details[0].message);
            return;
        }

        product.set((_.pick(req.body, ['company', 'model', 'screen_size', 'price',
            'camera_specifications', 'ram', 'isDiscountAvailable', 'imageUrl'])))

        const productResult = await product.save() // save the update changes in db
            .catch(err => res.send(` unable to update the product : ${err.message}`))
        res.send(productResult);
    } catch (ex) {
        winston.error(ex.message, ex);
        res.send(ex.message)
    }

})


//2. API FUNCTION PUT Update Product
app.post('/', admin, async (req, res) => {

    try {
        // user object validation 
        const { error } = validateMobileProduct(req.body); // object distructor like result.error
        if (error) {
            // 400 bad req invalid input data
            res.status(400).send(error.details[0].message);
            return;
        }


        // lodash is used to pick up the req.body prop it is same as underscore lib

        const product = new Product(
            (_.pick(req.body, ['company', 'model', 'screen_size', 'price',
                'camera_specifications', 'ram', 'isDiscountAvailable', 'imageUrl'])))

        const result = await product.save()
        res.send(result);

    } catch (ex) {
        winston.error(ex.message, ex);
        res.send(ex.message)
    }

})


// 4 API  FUNCTION DELETE deleteProduct

app.delete('/api/products/:id', superadmin, async (req, res) => {

    try {
        const product = await Product
            .findOneAndRemove({ _id: req.params.id })
            .exec(function (err, item) {
                if (err) {
                    return res.json({ success: false, msg: 'Cannot remove product' });
                }
                if (!item) {
                    return res.status(404).json({ success: false, msg: 'product not found' });
                }
                res.json({ success: true, msg: 'mobile product deleted.' });
            });
    } catch (ex) {
        winston.error(ex.message, ex);
        next(ex);
    }

})


module.exports = app;