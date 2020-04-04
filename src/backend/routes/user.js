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
    let result = {admin: false, notice: null, userid: null};

    Admin.find({adminName: username}).then((admins) => {
        // admin found
        if (admins.length != 0) {
            admin = admins[0]
            result.userid = admin._id;
            result.admin = true;
            if (admin.password == password){
                result.notice = null;
            } else {
                result.notice = 'WRONG_PASSWORD';
            }
            res.send(result)
        } else {
            result.admin = false;
            User.find({username: username}).then((users) => {         
                if (users.length === 0) {
                    result.notice = 'ACCT_NOT_EXISTS';
                    result.userid = null;
                    res.send(result)
                } else {
                    user = users[0];
                    result.userid = user._id;
                    if (user.password == password) {
                        result.notice = null;
                    } else {
                        result.notice = 'WRONG_PASSWORD';
                    }
                    res.send(result)
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
