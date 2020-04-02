var express = require('express');
var router = express.Router();
var db = require("../db/mongoose");
const log = console.log

// import the mongoose models

const { User } = require('../models/user')
const { Course } = require('../models/course')
const { Message } = require('../models/message')
const { Admin } = require('../models/admin')

/* get admin page */
router.get('/courseInfo', (req, res) => {
    userID = req.body.userID
    log("course page")
    // const courses = [
    //     {
    //         courseCode: "CSC309",
    //         courseName: "Web Development",
    //         assessments: [
    //             { assessment: "A1", weight: 5, mark: 90 },
    //             { assessment: "A2", weight: 5, mark: 85 },
    //             { assessment: "midterm", weight: 10, mark: null }
    //         ]

    //     }
    // ]

    // find the user
    User.findById(userID, function (err, user) {
        if (!user) {
            res.status(404).send("user not found");
        } else {
            var courses = [];

            // TODO: find tasks for each course of the user??
            // for (){
                const newCourse = {
                    courseCode: '',
                    courseName: '',
                    assessments: []
                }
                courses.push(newCourse)
            // }
            res.status = "success";
            res.send(courses);
        }
    }).catch((err)=>{
        res.status(500).send(err)
    })

})































module.exports = router
