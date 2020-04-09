
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

const { validateMobileProduct, validateSketchartUser } = require('../validate')


// need schema to  create the json db structure
const subscriberSchema = new mongoose.Schema({
    // mongoose validation 
    endpoint: { type: String, required: true, unique: true },
    expirationTime: { type: String },
    key_p256dh: { type: String, required: true },
    key_auth: { type: String, required: true }
})


const Subscriber = mongoose.model('pwa_subscriber', subscriberSchema); // collection class


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


app.get('/', (req, res) => {
    res.send({
        message: "working pwa/notification/"
    });
})


app.get('/notification', (req, res) => {
    res.send({
        message: "all ok wokring"
    });
})


app.post('/subscribe', async (req, res) => {
    const subscription = req.body

    let subData = {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        key_auth: subscription.keys.auth,
        key_p256dh: subscription.keys.p256dh
    }

    console.log("data ", subData);


    try {

        // lodash is used to pick up the req.body prop it is same as underscore lib4
        const subscriber = new Subscriber(subData);

        const result = await subscriber.save();
        let id = result.id;
        res.send({ subID: id, mess: "you are done with sub" });

        const payload = JSON.stringify({
            title: "PWA NOTIFICATION SUBSCRIBED SUCC",
            icon: "https://cdn.pixabay.com/photo/2015/12/04/14/05/code-1076536__340.jpg",
            body: `your sub id is : ${id}`
        });

        webPush.sendNotification(subscription, payload)
            .catch(error => console.error(error));


    } catch (ex) {
        const payload = JSON.stringify({
            title: "PWA SUBSCRIBED FAIL?",
            icon: "https://cdn.pixabay.com/photo/2015/12/04/14/05/code-1076536__340.jpg",
            body: "YOU WILL REC THE NOTIFICATION FROM THE SERVER ... !"
        });

        webPush.sendNotification(subscription, payload)
            .catch(error => console.error(error))

        res.send(ex.message)
    }


});


app.get('/subscribers', async (req, res) => {
    let allUser = [];

    try {
        // throw new Error("product not found !"); 
        const all_subscribers = await Subscriber.find()
            .catch(err => res.send(`products not found : ${err.message}`));

        allUser = _.uniqBy(all_subscribers, function (e) {
            return e.key_auth;
        })

        res.status(201).json(allUser);
    } catch (ex) {
        next(ex);
    }

})

app.post('/notifyAllUsers', async (req, res) => {

    let allUser = [];
    try {
        // throw new Error("product not found !"); 
        const all_subscribers = await Subscriber.find()
            .catch(err => res.send(`products not found : ${err.message}`));

        allUser = _.uniqBy(all_subscribers, function (e) {
            return e.key_auth;
        })

        allUser.forEach(function (subscription) {

            let payload = JSON.stringify({
                title: req.body.title ? req.body.title : "node Title",
                body: req.body.body ? req.body.body : "node Body server..."
            });

            let subObj = {
                endpoint: subscription.endpoint,
                expirationTime: subscription.expirationTime,
                keys: {
                    p256dh: subscription.key_p256dh,
                    auth: subscription.key_auth
                }
            }

            webPush.sendNotification(subObj, payload)
                .catch(error => console.error(error));
        });

        res.status(201).json({
            message: "notification to allSubscribers ",
            allUser
        });


    } catch (ex) {
        //  winston.error(ex.message, ex);
        next(ex);
    }

    res.status(201).json({
        message: "notification to allSubscribers "
    });

})

module.exports = app;