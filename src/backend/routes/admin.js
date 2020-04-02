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
    log("change status")
    // const courseCode = req.params.courseCode;
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
                var inside = []
                inside.push(docCourse[0])  // course id
                inside.push(courseCodeList[count * 2])  // course code
                inside.push(courseCodeList[count * 2 + 1] == 'true')  // course status

                result.push(inside)
                count++;
            }
            // log("result: ")
            // log(result)
            // log(doc.courses[0][0])
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
    /* 
    const Message = mongoose.model('Message', {
	userID: {
		type: ObjectID,
		required: true,
		minlegth: 1
	},
    text: {
        type: String,
        required: true
    },
    courseID: {
        type: ObjectID,
        required: true
    }
})
    */
    Admin.find({}).then(async function (adminList) {
        const msgGet = adminList[0].notifications // array of message object
        const allMsg = [];
        for (const i of msgGet) {
    //         /*
    //         {"_id":{"$oid":"5e7d5a1ba26605011613a088"},
    //         "notifications":[
    //                 {"_id":{"$oid":"5e7d5df24a9281021fe47479"},
    //                 "userID":{"$oid":"5e7d5a1ba26605011613a084"},
    //                 "text":"108: message 2",
    //                 "courseID":{"$oid":"5e7d5a1935577101064fa229"},
    //                 "__v":{"$numberInt":"0"}
    //             },
    //                 {"_id":{"$oid":"5e7d5df24a9281021fe47478"},
    //                 "userID":{"$oid":"5e7d5a1ba26605011613a084"},
    //                 "text":"108: message 1",
    //                 "courseID":{"$oid":"5e7d5a1935577101064fa229"},
    //                 "__v":{"$numberInt":"0"}
    //             }],
    //         "adminName":"admin",
    //         "password":"admin",
    //         "__v":{"$numberInt":"0"}}
    //         */
            var msg = {
                id: i._id,
                username: '',
                groupCode: '',
                msg: i.text,
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
        log(allMsg)
        res.send(allMsg)
    }).catch((error) => {
        res.status(500).send();
    })
})

router.post('/deleteMsg', (req, res) => {
    const id = req.body.mId
    Admin.find({}).then(function (adminList) {
        var msgGet = adminList[0].notifications
        var index;
        for (const i of msgGet){
            if(i._id == id){
                index = msgGet.indexOf(i)
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