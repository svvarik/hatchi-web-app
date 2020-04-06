var express = require('express');
const app = express();
var router = express.Router();
var db = require("../db/mongoose");
const log = console.log
const { ObjectID } = require('mongodb')
// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// import the mongoose models
const { User } = require('../models/user')
const { Course } = require('../models/course')
const { Message } = require('../models/message')
const { Admin } = require('../models/admin')


function generateColor(){
    const color = "rgb(" + generateColorValue().toString() + ", " +
                        generateColorValue().toString() + ", " + 
                        generateColorValue().toString() +
            ")";
    return color;
}
function generateColorValue(){
    return Math.floor(Math.random() * 255);
}


// a GET route to get a user by userID (for displaying courses)
router.get('/views/courses/courses.html/user/:userID', (req, res) => {
    const userID = req.params.userID
    if (!ObjectID.isValid(userID)) {
        res.status(404).send()
        return; 
    }
 
    User.findById(userID).then((user) => {
       if(user === null){
           res.status(404).send() // could not find this user
       }else{
           //find the course codes
           const courseCodeList = []
           let counter = user.courses.length
           user.courses.map((course) => {
               
                Course.findById(new ObjectID(course.courseId)).then((courseFound) => {
                    courseCodeList.push({
                        courseCode: courseFound.courseCode,
                        courseID: courseFound._id,
                        courseTitle: courseFound.courseName
                    })
                    counter -= 1
                    if(counter === 0){
                        res.send({ courses: courseCodeList })
                    }
                }, (error) => {
                    res.status(500).send()  // course does not exist=> server err?
                })
           })
       }
    }).catch((error) => {
        res.status(500).send()  // server error
    })
 })

// a POST route to add a course 
router.post('/views/courses/courses.html/addCourse', (req, res)=> {
    
    Course.findOneAndUpdate({courseCode: req.body.courseCode, courseName: req.body.courseName}, 
                            {$push: {enrolledUsers: new ObjectID(req.body.userID)}}).then((course) => {
        const userIDobj=new ObjectID(req.body.userID)
        let courseID = null
        if(course === null){// a new course
            const newCourse = new Course({
                courseCode: req.body.courseCode,
                courseName: req.body.courseName,
                enrolledUsers: [userIDobj],
                color: generateColor()
            })
            newCourse.save().then((result) => {
                courseID = result._id
                const userCourse = {
                    muted:false,
                    courseId : new ObjectID(courseID),
                    courseCode: req.body.courseCode,
                    courseTitle: req.body.courseName,
                    tasks: []
                }
                User.findByIdAndUpdate(userIDobj, {$push: {courses: userCourse}}).then((user) => {
                    console.log('user', user)
                    res.send({courseID: courseID})
                }, (err) => {
                    res.status(400).send()
                })
            }, (err) => {
                res.status(400).send()
            })
        }else{
            courseID = course._id
            const userCourse = {
                muted:false,
                courseId : new ObjectID(courseID),
                courseTitle: req.body.courseName,
                courseCode: req.body.courseCode,
                tasks: []
            }
            User.findByIdAndUpdate(userIDobj, {$push: {courses: userCourse}}).then((user) => {
                console.log('user', user)
                res.send({courseID: courseID})
            }, (err) => {
                res.status(400).send()
            })
        }
        console.log(courseID)
        
        
    }, (err) => {
        res.status(400).send()
    })


    User.findById(new ObjectID(req.body.userID)).then((user) => {
        
        
        
    }, (err) => {
        res.status(400).send()
    })
})


router.get('/displayAssessments/:userID', (req, res) => {
    const userID = req.params.userID
    if (!ObjectID.isValid(userID)) {
        res.status(404).send()
        return;
    }
    log("display assessments server")
    const courseID = req.body.courseID
    User.findById(userID, function (err, user) {
        if (err) {
            res.status(404).send("user not found")
        } else {
            const courses = []
            for (const each of user.courses) {
                log(each)
                const oneCourse = {
                    courseID: each.courseId,
                    courseCode: each.courseCode,
                    courseName: each.courseTitle,
                    assessments: []
                };
                
                    for (const eachAss of each.tasks) {
                        const oneAss = {
                            assessment: eachAss.title,
                            weight: eachAss.weight,
                            mark: eachAss.mark,
                        }
                        oneCourse.assessments.push(oneAss)
                    }
                    courses.push(oneCourse)
                    
                
            }
            res.send(courses);
            res.status = "success";
        }
    }).catch((err) => {
        res.status(500).send();
    })
})




module.exports = router






// /* get admin page */
// router.get('/courseInfo', (req, res) => {
//     userID = req.body.userID
//     log("course page")
//     // const courses = [
//     //     {
//     //         courseCode: "CSC309",
//     //         courseName: "Web Development",
//     //         assessments: [
//     //             { assessment: "A1", weight: 5, mark: 90 },
//     //             { assessment: "A2", weight: 5, mark: 85 },
//     //             { assessment: "midterm", weight: 10, mark: null }
//     //         ]

//     //     }
//     // ]

//     // find the user
//     User.findById(userID, function (err, user) {
//         if (!user) {
//             res.status(404).send("user not found");
//         } else {
//             var courses = [];

//             // TODO: find tasks for each course of the user??
//             // for (){
//                 const newCourse = {
//                     courseCode: '',
//                     courseName: '',
//                     assessments: []
//                 }
//                 courses.push(newCourse)
//             // }
//             res.status = "success";
//             res.send(courses);
//         }
//     }).catch((err)=>{
//         res.status(500).send(err)
//     })

// })































module.exports = router
