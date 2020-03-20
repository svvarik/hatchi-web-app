// const subTaskSchema = new Schema({
//     dueDate: Date,
//     completed: Boolean,
//     weight: Number,
//     mark: Number
// });

// const taskSchema = new Schema({
//     subtasks: [subTaskSchema],
//     dueDate: Date,
//     completed: Boolean,
//     weight: Number,
//     mark: Number
// });

// const userSchema = new Schema({
//     username: String, 
//     email: String, 
//     password: String, 
//     courses: [ObjectID],
//     tasks: [taskSchema]
// });

// const User = mongoose.model('User', userSchema)

// module.exports = { User }


/* User mongoose model */
const mongoose = require('mongoose')

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
        type: Array
    },
    tasks: {
        type: Array
    },
    //notificatin is added when a user is muted/unmuted 
    //(dashboard only display last n notifications in this notification list)
    notifications: {
        type: Array
    }
})

module.exports = { User }