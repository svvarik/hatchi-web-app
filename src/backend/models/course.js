// const courseSchema = new Schema({
//     users:[ObjectID], 
//     message: [ObjectID]
// });

// const Course = mongoose.model('Course', courseSchema)

// module.exports = { Course }


/* Course mongoose model */
const mongoose = require('mongoose')

const Course = mongoose.model('Course', {
	courseCode: {
		type: String,
		required: true,
		minlegth: 1
	},
	courseName: {
		type: String,
        required: true,
        minlegth: 1
    },
    enrolledUsers: {
        type: Array

    },
    messages: {
        type: Array
    },
    color: {
		type: String
	},
})

module.exports = { Course }