const express = require('express');
const app = express();
const router = express.Router()
const { ObjectID } = require('mongodb')
//pusher initialization
const Pusher = require('pusher')
const pusher = new Pusher({
    appId: '975704',
    key: 'dcccc60c3687f9c8066f',
    secret: 'fbbcde194ee4d2eb0c58',
    cluster: 'us2',
    encrypted: true
})

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser') 
app.use(bodyParser.json())


// import the mongoose models
const { User } = require('../models/user')
const { Course } = require('../models/course')
const { Message } = require('../models/message')
const { Admin } = require('../models/admin')


// a GET route to get a user by userID (for displaying group chats)
router.get('/views/groupChats/groupChats.html/user/:userID', (req, res) => {
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
                        courseID: courseFound._id
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
 
 // a GET route to get a course object by courseID (for displaying messages and their users' info)
 router.get('/views/groupChats/groupChats.html/course/:courseID', (req, res) => {
    const courseID = req.params.courseID
    if (!ObjectID.isValid(courseID)) {
        res.status(404).send()
        return; 
    }
    Course.findById(new ObjectID(courseID)).then((course) => {
        if (course === null) {
            res.status(404).send()  // could not find this course
        } else {
            const msgList = []
            let counter = course.messages.length
            if(counter === 0){res.send({msgList})}
            let msgID
            for(let i = 0; i < course.messages.length; i++){
                
                 msgID = course.messages[i]
                //find message
                Message.findById(new ObjectID(msgID)).then((msg) => {
                    //find user
                    User.findById(new ObjectID(msg.userID)).then((user) => {
                        msgList.push({
                            msgID: msg._id,
                            text: msg.text,
                            userID: user._id,
                            username: user.username
                        })
                        counter -= 1
                        if(counter === 0){
                            msgList.sort((a, b) => {
                                if(a.msgID < b.msgID){return -1}
                                if(a.msgID > b.msgID){return 1}
                                return 0
                            })
                            res.send({ msgList })
                        }
                    }, (error) => {
                        res.status(400).send(error) // 400 for bad request??
                    })
                }, (error) => {
                    res.status(400).send(error) // 400 for bad request??
                })
            }
        }
    }).catch((error) => {
        res.status(500).send()  // server error
    })
 })
 
 // a POST route to add a notification to admin (a message is reported)
 router.post('/views/groupChats/groupChats.html/report', (req, res) => {
    
    const notification = req.body
 
   Admin.find().then((adminList) => {
        const admin = adminList[0]
        admin.notifications.push(notification)
        Admin.findOneAndUpdate({adminName: admin.adminName}, admin).then((result) => {
            res.status(200).send()
        }).catch((error) => {
            res.status(500).send()
        })
    }, (err) => {
        res.status(400).send()
    })
 
 })

// a POST route to send a message 
router.post('/views/groupChats/groupChats.html/sendMsg', (req, res)=> {
    const msg = req.body
    User.findById(new ObjectID(msg.userID)).then((user) => {
        
        const targetCourse = user.courses.filter(course => course[0] == new ObjectID(msg.courseID))
        const msgInfo = {
            username: user.username,
            userID: msg.userID,
            courseID: msg.courseID,
            text: msg.text,
            muted: targetCourse[2]
        }
        if(!msgInfo.muted){
            const newMsg = new Message(msg)
            newMsg.save().then((result) => {
                //get the id and put it in course document
                const msgID = result._id
                Course.findByIdAndUpdate(new ObjectID(msg.courseID), 
                                    {$push: {messages: msgID}})
                .then((result) => {
                    res.send({ msgInfo })
                    pusher.trigger('msg', 'send-msg', msgInfo);
                }, (error) => {
                    res.status(400).send(error) // 400 for bad request
                })
            }, (error) => {
                res.status(400).send(error) // 400 for bad request
            })
        }
        
    }, (err) => {
        res.status(400).send()
    })
})


 module.exports = router