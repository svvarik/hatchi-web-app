const messageSchema = new Schema({
    user: [ObjectID],
    reported: Boolean, 
    text: String,
    course: [ObjectID],
    reported: Boolean
});
