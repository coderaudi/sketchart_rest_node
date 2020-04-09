
//  express API
const mongoose = require('mongoose');
let _ = require('lodash');

const express = require('express');
const app = express.Router();
app.use(express.json()); //  middleware function

const user = require('../modules/user')
const admin = require('../modules/admin')
const superadmin = require('../modules/superadmin')

const { validateMobileProduct } = require('../validate')


// need schema to  create the json db structure
const timesheetSchema = new mongoose.Schema({

    // mongoose validation 
    userid: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    hours: { type: String, required: true },
    task: { type: String, required: true },
    project: { type: String, required: true },
    status: { type: String, required: true },
})

const Timesheet = mongoose.model('timesheets', timesheetSchema); // collection class



//1.  API FUNCTION  GET 
app.get('/', async (req, res) => {

    try {
        // throw new Error("product not found !"); 
        const timesheets = await Timesheet.find()
            .catch(err => res.send(`products not found : ${err.message}`))
        console.log(timesheets);
        res.send(timesheets);
    } catch (ex) {

        next(ex);
    }
})

app.get('/:id', async (req, res) => {
    try {
        const timesheet = await Timesheet.findById(req.params.id)
            .catch(err => res.send(`product not found : ${err.message}`))
        console.log(timesheet);
        res.send(timesheet);

    } catch (ex) {
        next(ex);
    }
})


app.post('/add', async (req, res) => {

    console.log("add new tiemsheet", req.body);
    try {
        const timesheet = new Timesheet(
            (_.pick(req.body,
                ['userid', 'date', 'description', 'hours',
                    'task', 'project', 'status'])));

        const result = await timesheet.save()
        res.send(result);

    } catch (ex) {
        res.send(ex.message)
    }

})

// delete timesheet
app.delete('/delete/:id', async (req, res) => {

    console.log("inside delete req", req.params.id);
    try {
        const timesheet = await Timesheet
            .findOneAndRemove({ _id: req.params.id })
            .exec(function (err, item) {
                if (err) {
                    return res.json({ success: false, msg: 'Cannot remove product' });
                }
                if (!item) {
                    return res.status(404).json({ success: false, msg: 'product not found' });
                }
                res.json({ success: true, msg: 'timesheet deleted.' });
            });
    } catch (ex) {

        next(ex);
    }

})


app.put('/update/:id', async (req, res) => {

    try {
        // look the id is or not 
        const timesheet = await Timesheet.findById(req.params.id)
            .catch(err => res.send(`product not found : ${err.message}`))

        timesheet.set(
            (_.pick(req.body,
                ['userid', 'date', 'description', 'hours',
                    'task', 'project', 'status']))
        )


        const timesheetResult = await timesheet.save() // save the update changes in db
            .catch(err => res.send(` unable to update the product : ${err.message}`))
        res.send(timesheetResult);
    } catch (ex) {

        res.send(ex.message)
    }

})


module.exports = app;