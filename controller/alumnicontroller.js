const mongoose = require('mongoose');

const bcrypt=require('bcrypt');
var crypto = require('crypto');


const alumni = require('../models/alumnimodel')


const algorithm = 'aes-256-ctr';
const passwordforencrypt = 'RJ23edrf';


module.exports.register = (req, res, next) => {
    console.log('Inside register fuction');

    crypto.scrypt(passwordforencrypt, 'salt', 32, (err, key) => {
        // if (err) throw err;
        try {
            const iv = '8319187798918317';
            const cipher = crypto.createCipheriv(algorithm, key, iv);

            let encrypted = cipher.update(req.body.email, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            // console.log( encrypted);
            const encrypteddata = encrypted;


            console.log(encrypteddata)

            alumni.find({ email: encrypteddata })
                .exec()
                .then(user => {
                    if (user.length >= 1) {
                        console.log(user)
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
                                const user = new alumni({
                                    _id: new mongoose.Types.ObjectId(),
                                    name: req.body.name,
                                    yop: req.body.yop,
                                    email: encrypteddata,
                                    password: hash,
                                    companyname: req.body.companyname,
                                    role: req.body.role,
                                    skillset: req.body.skillset,
                                    domain: req.body.domain
                                });
                                user
                                    .save()
                                    .then(result => {
                                        console.log(result);
                                        return res.status(201).json({
                                            message: "User created"
                                        });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        return res.status(500).json({
                                            error: err
                                        });
                                    });
                            }
                        });
                    }
                });
        }
        catch (err) {
            return res.json({message:"UNABle to proceSS"});
        }
    })


}

module.exports.update = (req, res, next) => {
    // alumni.findById(req.params.id, (err, employee) => {
    //     if (!employee) {
    //         return next(new Error('Could not load'));
    //     }
    //     else {
    //         employee.name = req.body.name;
    //         employee.yop = req.body.yop;
    //         employee.email = req.body.email;
    //         employee.password = req.body.password;
    //         employee.companyname = req.body.companyname;
    //         employee.role = req.body.role;
    //         employee.save().then(student => {
    //             res.json("Update done");
    //         }).catch(err => {
    //             res.status(400).send('Update Failed');
    //         })
    //     }
    // });
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


            alumni.find({ email: encrypteddata })
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


    alumni.findById(decoded._id, (err, result) => {
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