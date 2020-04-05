/* server.js, with mongodb API and static directories */
'use strict';
const log = console.log
const path = require('path')
const express = require('express');
const app = express();     // starting the express server
const port = process.env.PORT || 5000;    // will use an 'environmental variable', process.env.PORT, for deployment.
const bodyParser = require('body-parser');      // body-parser: middleware for parsing HTTP JSON body into a usable object
const frontendPath = path.join(__dirname, '../frontend');
const imagesPath = path.join(__dirname, '../../images');

// mongoose and mongo connection
const { mongoose } = require('./db/mongoose')
mongoose.connection.on('open', function (ref) {
   log("connected to mongoDB");
})
mongoose.connection.on('error', function (ref) {
   log("connection failed");
})

// import the mongoose models
const { User } = require('./models/user')
const { Course } = require('./models/course')
const { Message } = require('./models/message')
const { Admin } = require('./models/admin')

app.use(bodyParser.json()) //need to be placed before the imported routes

// Import routes
// app.use(require('./routes/user'))
app.use(require('./routes/admin'))
app.use(require('./routes/groupChat'))
app.use(require('./routes/user'))
app.use(require('./routes/courses'))
app.use(require('./routes/tasks'))

// app.use(require('./routes/index'))

// Setting up a static directory for the html file using Express middleware
app.use(express.static(frontendPath));
// app.use(express.static(frontendPath + '/images'))
app.use(express.static(frontendPath + '/views/admin'));

app.get('/', (req, res) => {
   res.sendFile(frontendPath + '/index.html');
})

// app.get('/admin', (req, res)=>{
//    res.sendFile(frontendPath + "/views/admin/admin.html")
// })

app.listen(port, () => {
   log(`Listening on port ${port}...`)
})  // localhost development port 5000  (http://localhost:5000)
   // We've bound that port to localhost to go to our express server.
   // Must restart web server when you make changes to route handlers.