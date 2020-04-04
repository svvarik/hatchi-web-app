/* User mongoose model */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = {
    text: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
}

const subTaskSchema = {
    startDate: {
        type: Date,
    },
    title: {
        type: String,
    },
    endDate: {
        type: Date,
    },
    completed: {
        type: Boolean,
    }
}

const taskSchema = { 
    subTasks: [subTaskSchema],
    course: {
        type: mongoose.Schema.Types.ObjectId,
    },
    title: {
        type: String,
        required: true
    },
    startDate: {
		type: Date,
    },
    endDate: {
        type: Date,
    },
    completed: {
        type: Boolean,

    },
    weight: {
        type: Number
    },
    mark: {
        type: Number
    },
}

userCourseSchema = {
    courseTitle: {
        type: String,
    },
    muted: {
        type: Boolean,
        default: false
    },
    tasks: [taskSchema]
}

const User = mongoose.model('User', {
	username: {
		type: String,
		required: true,
		minlegth: 1,
		trim: true
	},
	email: {
		type: String,
        required: true,
        minlegth: 1
    },
    password: {
        type: String,
        required: true,
        minlegth: 1

    },
    courses: {
        type: [taskSchema]
    },
    //notificatin is added when a user is muted/unmuted 
    //(dashboard only display last n notifications in this notification list)
    notifications: {
        type: [notificationSchema]
    }
})

module.exports = { User }