const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
var crypto = require('crypto');

const jwt = require('jsonwebtoken')

// const alumni = require('../models/alumnimodel')
const studentmodel = require('../models/studentmodel')


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

            studentmodel.find({ email: encrypteddata })
                .exec()
                .then(student => {
                    console.log(student)
                    if (student.length >= 1) {
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
                                const student = new studentmodel({
                                    _id: new mongoose.Types.ObjectId(),
                                    name: req.body.name,
                                    rollno: req.body.rollno,
                                    yop: req.body.yop,
                                    department: req.body.department,
                                    email: encrypteddata,
                                    password: hash,
                                    contactnumber: req.body.contactnumber
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
        catch (err) {
            return res.json({ error: "Terminated at the process of encryption" })
        }
    })

}
function decryption(data){
    const key = crypto.scryptSync(passwordforencrypt, 'salt', 32);
    const iv = '8319187798918317';
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted
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


            studentmodel.find({ email: encrypteddata })
                .exec()
                .then(student => {
                    console.log(student)
                    if (student.length < 1) {
                        return res.json({
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
                                    res.json({ message: "Invalid Credentials" })
                                }
                            })
                        } catch (error) {
                            // res.json("UNABLE TO PROCESS")
                            res.json({ message: "UNABLE TO PROCESS" })
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
            res.json({ message: "UNABLE TO PROCESS" })
        }
    });
}

exports.profile = (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], 'secret')
    console.log(decoded._id);


    studentmodel.findById(decoded._id, (err, result) => {
        if (err) {
            console.log(err)
            res.json({ message: "Unable to load profile" })
        }
        else if (result) {
            // console.log(result)
            result.email=decryption(result.email)
            res.json(result)
        }
    })
}

