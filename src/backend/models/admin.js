/* Admin mongoose model */
const mongoose = require('mongoose')

const Admin = mongoose.model('Admin', {
	adminName: {
		type: String,
		required: true,
		minlegth: 1,
		trim: true
	},
    password: {
        type: String,
        required: true,
        minlegth: 1

    },
    //notification is added when a message is reported
    //admin page need to show all the notifications
    notifications: {
        type: Array //of Message objects
    }
})

module.exports = { Admin }