/**
 * File for routing user authentication
 */

 
const express = require('express');
const app = express();
const router = express.Router();
const {ObjectID} = require('mongodb');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const {User} = require('../models/user');
const {Admin} = require('../models/admin');


router.post('/views/login/login.html/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    Admin.find({username: username}).then((admin) => {
        console.log(admin);
        
        if (admin !== null) {
            res.userid = admin._id;
            res.admin = true;
            if (admin.password == password){
                res.notice = null;
            } else {
                res.notice = 'WRONG_PASSWORD';
            }
        } else {
            res.admin = false;
            User.find({username: username}).then((user) => {
                console.log(user);
                
                if (user === null) {
                    res.notice = 'ACCT_NOT_EXISTS';
                    res.userid = null;
                } else {
                    res.userid = user._id;
                    if (user.password == password) {
                        res.notice = null;
                    } else {
                        res.notice = 'WRONG_PASSWORD';
                    }
                }
            }).catch((error) => {
                res.status(400).send()
            })
        }
    }, (err) => {
        res.status(400).send()
    })
})

router.post('/views/login/login.html/signup', (req, res) => {
   User.exists({username: req.body.username}).then((exist) => {
       if (exist) {
           res.notice = 'USERNAME_OCCUPIED'
           res.status(200).send()
       } else {
           User.create(req.body, function(err){
               if (err) {
                   res.status(400).send()
               } else {
                   res.notice = null
                   res.status(200).send()
               }
           })
       }
   }, (err) => {
       res.status(400).send()
   })
})

module.exports = router
