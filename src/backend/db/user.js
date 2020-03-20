const subTaskSchema = new Schema({
    dueDate: Date,
    completed: Boolean,
    weight: Number,
    mark: Number
});

const taskSchema = new Schema({
    subtasks: [subTaskSchema],
    dueDate: Date,
    completed: Boolean,
    weight: Number,
    mark: Number
});

const userSchema = new Schema({
    username: String, 
    email: String, 
    password: String, 
    courses: [ObjectID],
    tasks: [taskSchema]
});
