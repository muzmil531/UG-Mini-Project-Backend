const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
var crypto = require('crypto');


// const alumni = require('../models/alumnimodel')
// const studentmodel=require('../models/studentmodel')

const adminmodel=require('../models/adminmodel')


const algorithm = 'aes-256-ctr';
const passwordforencrypt = 'RJ23edrf';


module.exports.register = (req, res, next) => {


    crypto.scrypt(passwordforencrypt, 'salt', 32, (err, key) => {
        // if (err) throw err;
        try {
            const iv = '8319187798918317';
            const cipher = crypto.createCipheriv(algorithm, key, iv);

            let encrypted = cipher.update(req.body.email, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            // console.log( encrypted);
            const encrypteddata = encrypted;
            console.log(encrypteddata);


            adminmodel.find({ email:encrypteddata })
                .exec()
                .then(data => {
                    console.log(data)
                    if (data.length >= 1) {
                        return res.status(409).json({
                            message: "Mail exists"
                        });
                    } else {
                        bcrypt.hash(req.body.password, 10, (err, hash) => {
                            if (err) {
                                return res.status(500).json({
                                    error: err
                                });
                            } else {
                                const student = new adminmodel({
                                    _id: new mongoose.Types.ObjectId(),
                                    name: req.body.name,
                                    jobiid:req.body.jobid,
                                    email: encrypteddata,
                                    password: hash,
                                    contactnumber:req.body.contactnumber
                                });
                                student
                                    .save()
                                    .then(result => {
                                        res.status(201).json({
                                            message: "User created"
                                        });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });
                            }
                        });
                    }
                });

        }
        catch(err){
            res.json({message:"unable to process at step1"})
        }
    })
}


module.exports.login = (req, res, next) => {

    crypto.scrypt(passwordforencrypt, 'salt', 32, (err, key) => {
        // if (err) throw err;
        try {
            const iv = '8319187798918317';
            const cipher = crypto.createCipheriv(algorithm, key, iv);

            let encrypted = cipher.update(req.body.email, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            // console.log( encrypted);
            const encrypteddata = encrypted


            adminmodel.find({ email: encrypteddata })
                .exec()
                .then(student => {
                    console.log(student)
                    if (student.length < 1) {
                        return res.status(401).json({
                            message: "Not a registered user"
                        });
                    }

                    else {
                        console.log(student)
                        try {
                            bcrypt.compare(req.body.password, student[0].password, (err, response) => {
                                console.log(response)
                                if (response == true) {


                                    const token = jwt.sign(
                                        {
                                            email: student[0].email,
                                            _id: student[0]._id
                                        },
                                        'secret',
                                        {
                                            expiresIn: "1h"
                                        }
                                    );
                                    return res.status(200).json({
                                        token: token,
                                        message: "Success"
                                    });
                                }
                                else {
                                    // LOGIN FAILURE and SENDING MESSAGE CODE
                                    res.json({ message: 5 })
                                }
                            })
                        } catch (error) {
                            // res.json("UNABLE TO PROCESS")
                            res.json({ message: 3 })
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        } catch (err) {
            // res.json("UNABLE TO PROCESS")
            res.json({ message: 3 })
        }
    });
}

exports.profile = (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], 'secret')
    console.log(decoded._id);


    adminmodel.findById(decoded._id, (err, result) => {
        if (err) {
            console.log(err)
            res.json({ message: "Unable to load profile" })
        }
        else if (result) {
            // console.log(result)
            res.json(result)
        }
    })
}