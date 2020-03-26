var express = require('express');
var router = express.Router();
var db = require("../db/mongoose");
var userDB = require("../models/user");

/* get admin page */
router.get('/userInfo', (req, res) => {
    const c1 = {
        courseCode: 'csc309',
        courseName: 'web Programming',
        enrolledUsers: 'yun',
        messages: []
    }
    const c2 = {
        courseCode: 'sta247',
        courseName: 'probability',
        enrolledUsers: 'yun',
        messages: []
    }
    const user1 = {
        userid: 1,
        username: 'yun',
        email: 'yun@mail.com',
        groups: [{c1: true}, {c2: false}]
    }
    const msg1 = {
        userid: 1,
        reported: true,
        text: "reported!!",
        courseCode: 'csc309'
    }
    const result = {
        username: [user1],
        reportedMessage: [msg1]
    }

    console.log(db.mo)

    res.send(result); //
})

module.exports = router;