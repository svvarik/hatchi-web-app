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

router.post('/changeStatus', (req, res) => {
    log("change status")    // const courseCode = req.params.courseCode;
    // log(username, courseCode)
    const body = req.body
    const username = body.username
    const courseCodeList = body.courseCode.split(',')

    User.findOne({ username: `${username}` }, function (err, doc) {
        if (doc) {
            // const doc.courses = [["5e7d5a1ba26605011613a087", "csc373", true], ["5e7d5a1935577101064fa229", "csc108", false]]
            // const courseCodeList = ['csc373', 'false', 'csc108', 'true']
            log(courseCodeList)
            var result = []
            var count = 0;
            for (var docCourse of doc.courses) {
                log(`----${count}----`)
                var inside = []
                inside.push(docCourse[0])  // course id
                inside.push(courseCodeList[count * 2])  // course code
                inside.push(courseCodeList[count * 2 + 1] == 'true')  // course status

                result.push(inside)
                count++;
            }
            log("result: ")
            log(result)
            log(doc.courses[0][0])
            doc.courses = result
            doc.save(function (err) {
                if (err) {
                    return handleError(err);
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
    Admin.find({}).then(function (adminList) {
        const msgGet = adminList[0].notifications
        const allMsg = [];
        for (const i of msgGet) {
            const msg = {
                username: i.userID,
                groupCode: i.courseID,
                msg: i.text,
            }
            allMsg.push(msg);
        }
        res.send(allMsg)
    })
})

router.post('/deleteMsg', (req, res) => {
    const msg = req.body.msg
    Admin.find({}).then(function (adminList) {
        var msgGet = adminList[0].notifications
        var index = arr.indexOf(msg);
        if (index > -1) {
            msgGet.splice(index, 1);
        }
        adminList[0].save(function (err) {
            if (err) {
                return handleError(err);
            }
        })
    })
})

module.exports = router;