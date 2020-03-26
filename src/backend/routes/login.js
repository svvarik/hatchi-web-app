var express = require('express');
var router = express.Router();
const database = '';//todo


const mongoose = require('mongoose')
const mongoURI = "mongodb+srv://admin_0:admin_0@hachi0-vbufp.azure.mongodb.net/test?retryWrites=true&w=majority"

function login(lusername, lpassword){
    let code = null;
    mongoose.connect(mongoURI, function(err, db){
        if (err) throw err;
        const dbo = db.db(database);
        const query = {username: lusername};
        dbo.collection('user').find(query).toArray(function(err, result){
            if (err) throw err;
            if (result.length == 0) {
                code = 'ACCT_NOT_EXISTS';
            } else if (result[0].password == lpassword){
                code = result[0].id;
            } else {
                code = 'WRONG_PASSWORD';
            }
        });
        db.close();
    });
    return code;
};

function adminLogin(lusername, lpassword){
    let code = null;
    mongoose.connect(mongoURI, function(err, db){
        if (err) throw err;
        const dbo = db.db(database);
        const query = {username: lusername};
        dbo.collection('admin').find(query).toArray(function(err, result){
            if (err) throw err;
            if (result.length == 0) {
                code = false;
            } else if (result[0].password == lpassword){
                code = result[0].id;
            } else {
                code = 'WRONG_PASSWORD';
            }
        });
        db.close();
    });
    return code;
};

function signup(susername, semail, spassword){
    let code = null;
    mongoose.connect(mongoose, function(err, db){
        if (err) throw err;
        const dbo = db.db(database);
        const query = {username: susername};
        dbo.collection('user').find(query).toArray(function(err, result){
            if (err) throw err;
            if (result.length != 0){
                code = 'USERNAME_OCCUPIED';
            } else {
                const newUser = {username: susername, email: semail, password: spassword};
                user.collection('user').insertOne(newUser, function(err, res){
                    if (err) throw err;
                    code = 'SUCCESS';
                });
            }
        });
        db.close();
    })
    return code;
}




