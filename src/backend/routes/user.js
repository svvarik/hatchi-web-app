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
           res.send({notice: 'USERNAME_OCCUPIED'});
           res.status(200).send()
       } else {
           User.create(req.body, function(err){
               if (err) {
                   res.status(400).send()
               } else {
                   res.send({notice:null});
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
        res.send({notice: 'User Not Found'})
        return;
    }
    User.exists({username: req.body.newName}).then((exist) => {
        if (exist) {
            res.send({notice: 'Username Occupied, Please Choose Another One.'});
        } else {
            User.findByIdAndUpdate(req.body.userid, {username: req.body.newName}).then((user) => {
                res.send({notice: null});
            }).catch((error) => {
                res.send({notice: 'Username Change Failed'})
            })
        }
    }, (err) => {
        res.send({notice: 'Bad Request'})
    })
    
    
})


router.post('/views/setting/setting.html/changeEmail', (req, res) =>{
    if (!ObjectID.isValid(req.body.userid)){
        return;
    }
    User.findByIdAndUpdate(req.body.userid, {email: req.body.newEmail}).then((user) => {
        res.send({notice: null});
    }).catch((error) => {
        res.send({notice: 'Email Change Failed'})
    })
    
})


router.post('/views/setting/setting.html/changePassword', (req, res) => {
    if (!ObjectID.isValid(req.body.userid)){
        res.send({notice: 'User Not Found'})
        return;
    }
    User.findById(req.body.userid).then((user) => {
        if (user === null) {
            res.send({notice: 'User Not Found'})
        } else {
            if (user.password == req.body.oldPassword) {
                User.findByIdAndUpdate(req.body.userid, {password: req.body.newPassword}).then((user) => {
                    res.send({notice: null})
                }).catch((error) => {
                    res.send({notice: 'Password Change Failed'})
                })

            } else {
                res.send({notice: 'Wrong Password, Please Try Again.'})
            }
        }
    }).catch((error)=> {
        res.send({notice: 'Bad Request'})
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
            res.send({username: user.username})
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
            res.send({email: user.email});
        }
    }).catch((error)=> {
        res.status(500).send();
    })
})
module.exports = router
