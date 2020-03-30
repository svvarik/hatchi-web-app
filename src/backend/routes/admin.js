var express = require('express');
var router = express.Router();
var db = require("../db/mongoose");
const log = console.log

// import the mongoose models
const { User } = require('../models/user') // get user status
const { Course } = require('../models/course')
const { Message } = require('../models/message')
const { Admin } = require('../models/admin') // get report message

/* get admin page */
router.get('/userInfo', (req, res) => {
    log("admin page")
    // const c2 = {
    //     courseCode: 'sta247',
    //     courseName: 'probability',
    //     enrolledUsers: 'yun',
    //     messages: []
    // }
    // const user1 = {
    //     userid: 1,
    //     username: 'yun',
    //     email: 'yun@mail.com',
    //     groups: [{c1: true}]
    // }
    // const result = {
    //     username: [user1],
    //     reportedMessage: [msg1]
    // }
    // array of object
    User.find({}).then(
        (usersInfo) => {
            const allUsers = [];
            for (const u in usersInfo) {
                const user = {
                    userid: '',
                    username: '',
                    email: '',
                    groups: [],
                }
                user.userid = usersInfo[u]._id;
                user.username = usersInfo[u].username;
                user.email = usersInfo[u].email;
                // get user groups
                for (const g in usersInfo[u].courses) {
                    // const cId = usersInfo[u].courses[g][0]
                    const courseCode = usersInfo[u].courses[g][1]
                    const mute = usersInfo[u].courses[g][2]
                    user.groups.push({
                        key: courseCode,
                        value: mute
                    });
                }
                // console.log(user.groups)
                allUsers.push(user);
            }
            res.send(allUsers)
        },
        (error) => { res.status(500).send(error) } // server error
    )

})



router.post('/updateUserInfo', (req, res) => {
    log("update user information")
    const body = req.body
    const username = body.username
    const newName = body.newName
    const newEmail = body.newEmail
    log("update username:" + username)
    log("new username:" + newName)
    log("new email:" + newEmail)

    log(username, newName, newEmail)
    /* 
        A.findOneAndUpdate(conditions, update, options, callback)
        var query = { name: 'borne' };
        Model.findOneAndUpdate(query, { name: 'jason bourne' }, options, callback)
    */
    User.findOneAndUpdate(
        { username: `${username}` },
        { username: `${newName}`, email: `${newEmail}` },
    ).then(
        (userFound) => {
            if (!userFound) {
                res.status(404).send()
            } else {
                res.send("success")
                log("info changed")
            }
        }
    ).catch((error) => {
        res.status(500).send()
    })
})


router.post('/deleteUser', (req, res) => {
    log("delete user", req.body.username)
    const username = req.body.username
    User.findOneAndDelete({ username: username }).then(
        (userFound) => {
            if (!userFound) {
                res.status(404).send()
            } else {
                res.send("success")
                log("user deleted")
            }
        }
    ).catch((error) => {
        res.status(500).send()
    })
})

module.exports = router;