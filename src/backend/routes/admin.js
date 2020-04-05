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
            for (const u of usersInfo) {
                const user = {
                    userid: '',
                    username: '',
                    email: '',
                    password: '',
                    groups: [],
                }
                user.userid = u._id;
                user.username = u.username;
                user.password = u.password;
                user.email = u.email;
                // get user groups
                for (const obj of u.courses) {
                    // const cId = usersInfo[u].courses[g][0]
                    log("!!!!!!!!!!!!!!!!loop!!!!!!!!!!!!!!!!!!!!")
                    var courseCode = obj.courseCode;
                    var mute = obj.muted
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

router.post('/changeStatus', (req, res) => {
    log("change status")
    // const courseCode = req.params.courseCode;
    // log(username, courseCode)
    const body = req.body
    const username = body.username
    const courseCodeList = body.courseCode.split(',')
    log("courseCodeList")
    log(courseCodeList)

    User.findOne({ username: `${username}` }, function (err, doc) {
        if (doc) {
            log(doc.username)
            log(doc.courses)
            // courseCodeList = ['csc373', 'false', 'csc108', 'true']
            var count = 0;
            for (var docCourse of doc.courses) {
                var inside = []
                const courseChange = docCourse.courseCode
                const statusIndex = courseCodeList.indexOf(courseChange)+1
                var muted = courseCodeList[statusIndex] === 'true';
                
                docCourse.muted = muted
                log(docCourse)
                // inside.push(docCourse[0])  // course id
                // inside.push(courseCodeList[count * 2])  // course code
                // inside.push(courseCodeList[count * 2 + 1] == 'true')  // course status
                count++;
            }
            // log("result: ")
            // log(result)
            // log(doc.courses[0][0])
            // doc.courses = result
            doc.save(function (err){
                if(err){
                    res.status(400).send("cannot save changing status")
                }
            }) 

            res.send("success")
        } else {
            log("cannot find user")
            res.send(err)
        }
    })
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

router.get('/reportMessage', (req, res) => {
    log("reportMessage")
    Admin.find({}).then(async function (adminList) {
        const msgGet = adminList[0].notifications // array of message object
        const allMsg = [];
        // log(msgGet)
        for (const i of msgGet) {
            var msg = {
                username: '',
                groupCode: '',
                msg: i.msgContent,
            }
            
            // find username of user
            await User.findById(i.userID, function(err, user){
                if(err){
                    res.status(404).send("user not found")
                } else {
                    msg.username = user.username
                }
            })

            // get the message's group code
            await Course.findById(i.courseID, function (err, course) {
                if(err){
                    res.status(404).send("course not found")
                } else {
                    msg.groupCode = course.courseCode
                    // log(msg)
                }
            })
            allMsg.push(msg);
        }
        // log(allMsg)
        res.send(allMsg)
    }).catch((error) => {
        res.status(500).send();
    })
})

router.post('/deleteMsg', (req, res) => {
    log("del message!!!!!!!!!!!!!!!!!!!!")
    const del = req.body.msg
    log(del)
    Admin.find({}).then(function (adminList) {
        var msgGet = adminList[0].notifications
        log("message get")
        log(msgGet)
        var index;
        for (const i of msgGet){
            if(i.msgContent === del){
                index = msgGet.indexOf(i)
                log(index)
            }
        }
        // var index = arr.indexOf(msg);
        if (index > -1) {
            msgGet.splice(index, 1);
        }
        adminList[0].save(function (err) {
            if (err) {
                res.status(400).send("cannot save delete msg");
            }
        })
        res.send("success")
    }).catch((err) => {
        res.status(500).send();
    })
})

module.exports = router;