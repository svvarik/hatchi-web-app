// const messageSchema = new Schema({
//     user: [ObjectID],
//     reported: Boolean, 
//     text: String,
//     course: [ObjectID],
//     reported: Boolean
// });

// const Message = mongoose.model('Message', messageSchema)

// module.exports = { Message }

/* Message mongoose model */
const mongoose = require('mongoose')
const { ObjectID } = require('mongodb')

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

module.exports = { Message }