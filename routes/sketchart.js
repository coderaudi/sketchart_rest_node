
//  express API
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
let _ = require('lodash');
const cors = require('cors');
const https = require('https');
const webPush = require('web-push');



const express = require('express');
const app = express.Router();
app.use(express.json()); //  middleware function
app.use(cors()); // to handle all the req
const user = require('../modules/user')
const admin = require('../modules/admin')
const superadmin = require('../modules/superadmin')

const { validateMobileProduct, validateSketchartUser } = require('../validate')


// need schema to  create the json db structure
const userSchema = new mongoose.Schema({
    // mongoose validation 
    username: { type: String, required: true },
    useremail: { type: String, required: true },
})



const User = mongoose.model('sketchart_users', userSchema); // collection class

const Gallary = mongoose.model('sketchart_gallary', userSchema); // collection class




// api regarding notification push ;
// to check the public and private key you need to run  ?


// Public Key:
// BCj54G9kp6-MuxVje45_rEdNd24WnFaDLOquVDqrdeqGy_NwwaeTovYJoKdP429zTri6hqypw4TXKMFF6a57aMQ

// Private Key:
// GpfiXbQhSh0PUQwULe4WOH0XZbI8lwNjT01acjA1Wv4
//******************************************* */
// Generate VAPID Keys
// The web-push library relies on a set of VAPID keys to work. VAPID keys are a pair of public and private keys which is used to restrict the validity of a push subscription to a specific application server, and also to identify the server that is sending the push notifications.

// You can generate the VAPID key pair by running the command below from the root of your project directory:

//     ./node_modules/.bin/web-push generate-vapid-keys



const publicVapidKey = "BCj54G9kp6-MuxVje45_rEdNd24WnFaDLOquVDqrdeqGy_NwwaeTovYJoKdP429zTri6hqypw4TXKMFF6a57aMQ";
const privateVapidKey = "GpfiXbQhSh0PUQwULe4WOH0XZbI8lwNjT01acjA1Wv4";

webPush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);



app.get('/notification', (req, res) => {
    res.send({
        message: "all ok wokring"
    });
})



app.post('/subscribe', (req, res) => {
    const subscription = req.body

    console.log("yes visited the server subscribetion!!!")

    res.status(201).json({
        message: "you received new notification from server"
    });

    const payload = JSON.stringify({
        title: "the notification from the server",
        icon: "https://cdn.pixabay.com/photo/2015/12/04/14/05/code-1076536__340.jpg",
        body: "this is the <p> for the server notification"
    });

    webPush.sendNotification(subscription, payload)
        .catch(error => console.error(error));

});


app.post('/notifyAllUsers', (req, res) => {

    let allSubscribers = [
        {
            endpoint: 'https://fcm.googleapis.com/fcm/send/ehUn52whVAA:APA91bFCl2CgS_2ziiaJIpgir4VIre08hS3y_U5RhSb8Z5ID5Z_O5u7-kkxoXUQQRKmZY1P953PWWnOnkC8BoCjBECh5CcdBCsNaR5KPiiuRP65VVaSPm7fFBPa651pXCmOAxctT5TI1',
            expirationTime: null,
            keys: {
                p256dh: 'BBPRmfNXOGjEr5bG-kOlfw_Aq2Qh_mQ0pHJE-GctYVwlKyjZc1N2LwVBoPk-xKkX-mYIa7ncwbhQ82nrmuRcQmI',
                auth: 'nne2k_kpVmmbn9IglGEyxQ'
            }
        },
        {
            endpoint: 'https://fcm.googleapis.com/fcm/send/ehUn52whVAA:APA91bFCl2CgS_2ziiaJIpgir4VIre08hS3y_U5RhSb8Z5ID5Z_O5u7-kkxoXUQQRKmZY1P953PWWnOnkC8BoCjBECh5CcdBCsNaR5KPiiuRP65VVaSPm7fFBPa651pXCmOAxctT5TI1',
            expirationTime: null,
            keys: {
                p256dh: 'BBPRmfNXOGjEr5bG-kOlfw_Aq2Qh_mQ0pHJE-GctYVwlKyjZc1N2LwVBoPk-xKkX-mYIa7ncwbhQ82nrmuRcQmI',
                auth: 'nne2k_kpVmmbn9IglGEyxQ'
            }
        }

    ];


    allSubscribers.forEach(function (subscription) {

        let payload = JSON.stringify({
            title: req.body.title ? req.body.title : "node Title",
            body: req.body.body ? req.body.body : "node Body server..."
        });

        webPush.sendNotification(subscription, payload)
            .catch(error => console.error(error));

    });

    res.status(201).json({
        message: "notification to allSubscribers ",
        sendTo: allSubscribers
    });

})

// login 




//2. API FUNCTION PUT Update Product
app.post('/login', (req, res) => {
    // Mock user
    const { email, password } = req.body;

    const user = {
        id: 1,
        username: 'audi',
        email: 'audi@gmail.com',
        isUser: true,
        isAdmin: true
    }

    jwt.sign({ user: user }, 'secretkey', (err, token) => {

        if (email == "audi@gmail.com") {
            res.json({
                token
            });
        } else {
            res.send("no access !! ");
        }

    });

});


// post to sketchart user

//1.  API FUNCTION  GET 
app.get('/allusers', user, async (req, res) => {

    try {
        // throw new Error("product not found !"); 
        const allusers = await User.find()
            .catch(err => res.send(`products not found : ${err.message}`))
        // console.log(allusers);
        res.send(allusers);
    } catch (ex) {
        winston.error(ex.message, ex);
        next(ex);
    }
})


//2. API FUNCTION PUT Update Product
app.post('/add', user, async (req, res) => {

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
            (_.pick(req.body, ['username', 'useremail'])))


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


app.post('/pic', async (req, res) => {

    try {

        let img = {
            src: "https://mymodernmet.com/wp/wp-content/uploads/2019/03/elements-of-art-6.jpg",
            alt: "img-title",
            description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
            price: "",
            offers: ""
        };

        let gallaryAry = Array(50).fill(img);
        const gallary = new Gallary({ gallary: gallaryAry })

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