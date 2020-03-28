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

router.post('/views/setting/setting.html/changeName', (req, res) =>{
    if (!ObjectID.isValid(req.body.userid)){
        res.status(404).send()
        return;
    }
    console.log(req.body.userid);

    User.exists({username: req.body.username}).then((exist) => {
        res.notice = null;
        if (exist) {
            res.notice = 'Username Occupied, Please Choose Another One.'
            res.status(200).send()
        } else {
            User.findByIdAndUpdate(req.body.userid, {username: req.body.newName}).then((user) => {
                res.newName = user.username;
                res.status(200).send()
            }).catch((error) => {
                res.status(500).send()
            })
        }
    }, (err) => {
        res.status(400).send()
    })
    
    
})


router.post('/views/setting/setting.html/changeEmail', (req, res) =>{
    if (!ObjectID.isValid(req.body.userid)){
        res.status(404).send()
        return;
    }
    console.log(req.body.userid);
    User.findByIdAndUpdate(req.body.userid, {email: req.body.newEmail}).then((user) => {
        res.newEmail = user.email;
        res.status(200).send();
    }).catch((error) => {
        res.status(500).send();
    })
    
})


router.post('/views/setting/setting.html/changePassword', (req, res) => {
    if (!ObjectID.isValid(req.body.userid)){
        res.status(404).send();
        return;
    }
    console.log(req.body.userid);
    res.notice = null;
    User.findById(req.body.userid).then((user) => {
        if (user === null) {
            res.status(400).send();
        } else {
            if (user.password == req.body.oldPassword) {
                User.findByIdAndUpdate(req.body.userid, {password: req.body.newPassword}).then((user) => {
                    res.status(200).send();
                }).catch((error) => {
                    res.status(500).send();
                })

            } else {
                res.notice = 'Wrong Password, Please Try Again.'
                res.status(200).send();
            }
        }
    }).catch((error)=> {
        res.status(500).send();
    })
    
})

router.post('/views/setting/setting.html/getUsername', (req, res) => {
    if (!ObjectID.isValid(req.body.userid)){
        res.status(404).send();
        return;
    }
    console.log(req.body.userid);
    User.findById(req.body.userid).then((user) => {
        if (user === null) {
            res.status(400).send();
        } else {
            res.username = user.username;
        }
    }).catch((error)=> {
        res.status(500).send();
    })
})

router.post('/views/setting/setting.html/getEmail', (req, res) => {
    if (!ObjectID.isValid(req.body.userid)){
        res.status(404).send();
        return;
    }
    console.log(req.body.userid);
    User.findById(req.body.userid).then((user) => {
        if (user === null) {
            res.status(400).send();
        } else {
            res.email = user.email;
        }
    }).catch((error)=> {
        res.status(500).send();
    })
})
module.exports = router
