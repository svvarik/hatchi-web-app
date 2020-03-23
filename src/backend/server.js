/* server.js, with mongodb API and static directories */
'use strict';
const log = console.log
const path = require('path')

const express = require('express')
// starting the express server
const app = express();

// mongoose and mongo connection
const { mongoose } = require('./db/mongoose')

// import the mongoose models
const { User } = require('./models/user')
const { Course } = require('./models/course')
const { Message } = require('./models/message')

// Import routes
// app.use(require('./routes/user'))
app.use(require('./routes/admin'))

// app.use('/user', user);

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser') 
app.use(bodyParser.json())

// Setting up a static directory for the html file in /pub
// using Express middleware
// app.use(express.static(__dirname + '/pub'))

const frontendPath = path.join(__dirname, '../frontend');
const imagesPath = path.join(__dirname, '../../images');
log(__dirname)
log(imagesPath)
app.use('/images', express.static(imagesPath));
app.use(express.static(frontendPath))

app.get('/', (req, res) => {
   res.sendFile(frontendPath + '/index.html');
})

// will use an 'environmental variable', process.env.PORT, for deployment.
const port = process.env.PORT || 5000

app.listen(port, () => {
	log(`Listening on port ${port}...`)
})  // localhost development port 5000  (http://localhost:5000)
   // We've bound that port to localhost to go to our express server.
   // Must restart web server when you make changes to route handlers.