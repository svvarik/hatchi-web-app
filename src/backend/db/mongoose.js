/* This module will hold our connection to 
   our mongo server through the Mongoose API.
   We will access the connection in our express server. */
const mongoose = require('mongoose');

/* Connnect to our database */
// Get the URI of the local database, or the one specified on deployment.
// const mongoURI = process.env.MONGODB_URI
const mongoURI = "mongodb+srv://admin_0:admin_0@hachi0-vbufp.azure.mongodb.net/Hachi?retryWrites=true&w=majority";

mongoose.connect(mongoURI, 
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

   module.exports = { mongoose }  // Export the active connection.