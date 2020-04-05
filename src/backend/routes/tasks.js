var express = require('express');
var router = express.Router();
const app = express();
var bodyParser = require('body-parser')
app.use(express.json());
const cors = require('cors');
app.use(cors());

// mongoose and mongo connection
const { mongoose } = require('../db/mongoose');

// import the mongoose models
const { User } = require('../models/user');
const { Course } = require('../models/course');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });


/**
 * Get all a user's tasks
 */
router.get('/tasks/user-tasks/:userId', (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.userId);
    User.findById(id).then(student => {
        const allTasks = []
        for(let i = 0; i < student.courses.length; i++){
            let singleCourse = student.courses[i]
            const tasksInCourse = singleCourse.tasks
            for(let k = 0; k < tasksInCourse.length; k++){
                allTasks.push(tasksInCourse[k])
            }
        }
        res.send(allTasks);
    });
});

/**
 * Get a user's courses to access course based tasks
 */
router.get('/tasks/course-tasks/:userId', (req,res) => { 
    const id = mongoose.Types.ObjectId(req.params.userId);
    User.findById(id).then(student => {
        res.send(student.courses);
    });
})

/**
 * Get a task's course name from the courseId
 */
router.get('/tasks/task-info/:courseId', (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.courseId);
    Course.findById(id).then(course => {
        const courseName = course.courseName;
        res.json({name: courseName})
    });
});

/**
 * Add a task to a user
 */
router.post('/tasks/user-tasks/:userId', (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.userId);
    const cId = mongoose.Types.ObjectId(req.body.courseId);
    User.findById(id).then(student => {
        const newTask = {
            subTasks: [],
            course: cId,
            title: req.body.title,
            startDate: Date(req.body.startDate),
            endDate: Date(req.body.endDate),
            weight: req.body.weight,
            mark: req.body.mark
        }

        const courses = student.courses

        for(let i = 0; i < courses.length; i++){
            if(student.courses[i].courseId.toString() == cId.toString()){
                student.courses[i].tasks.push(newTask);
                student.save(function (err, data) {
                    res.json(data.courses[i].tasks);
                });
            }
        }
    });
});

/**
 * 
 */
router.delete('/tasks/user-tasks/:userId/:taskId', (req, res) => {
    const userId = mongoose.Types.ObjectId(req.params.userId);
    const taskId = mongoose.Types.ObjectId(req.params.taskId);
    User.findById(userId).then(student => {
        for(let i = 0; i < student.courses.length; i++){
            let singleCourse = student.courses[i]
            singleCourse.tasks.pull(taskId)
        }
        student.save();
        res.send(student);
    })
});

router.post('/tasks/user-tasks/:userId/:taskId', (req, res) => {
    const userId = mongoose.Types.ObjectId(req.params.userId);
    const taskId = mongoose.Types.ObjectId(req.params.taskId);
    console.log("HERE");
    User.findById(userId).then(student => {
        const newSubTask = {
            title: req.body.title,
            startDate: Date(req.body.startDate),
            endDate: Date(req.body.endDate),
            completed: req.body.completed
        }
        const studentCourse = student.courses
        for(let i = 0; i < studentCourse.length; i++){
            tasksInCourse = studentCourse[i].tasks
            for(let k = 0; k < tasksInCourse.length; k++){
                if(tasksInCourse[k].id.toString() == taskId.toString()){
                    tasksInCourse[k].subTasks.push(newSubTask);
                }
            }
        }
        student.save()
        // const task = student.courses.tasks.id(taskId)
        // task.subTasks.push(newSubTask);
        // student.save(function (err) {
        //     console.log(err)
        // });
    });
    res.send(200);
});

module.exports = router;
