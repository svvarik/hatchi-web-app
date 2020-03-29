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
            for(const u in usersInfo){
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
                for (const g in usersInfo[u].courses){
                    // const cId = usersInfo[u].courses[g][0]
                    const courseCode = usersInfo[u].courses[g][1]
                    const mute = usersInfo[u].courses[g][2]
                    user.groups.push({
                        key : courseCode,
                        value: mute
                    });
                }
                // console.log(user.groups)
                allUsers.push(user);
            }
            res.send(allUsers)
        },
        (error)=>{res.status(500).send(error)} // server error
    )

})

    }


})

module.exports = router;