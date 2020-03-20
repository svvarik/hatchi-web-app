const courseSchema = new Schema({
    users:[ObjectID], 
    message: [ObjectID]
});

const Course = mongoose.model('Course', courseSchema)

module.exports = { Course }