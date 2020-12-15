const express=require('express');
const router =  express.Router();


// ADMIN CONTROLS STARTS

const admincontrolle=require('../controller/admincontroller')
router.post('/adminregister',admincontrolle.register)

// ADMIN CONTROLS ENDS

// ALUMNI CONTROLS STARTS
const alumnicontrol=require('../controller/alumnicontroller');

router.post('/alumniregister', alumnicontrol.register);

router.post('/alumnilogin', alumnicontrol.login)

router.get('/alumniprofile',alumnicontrol.profile)

router.post('/alumniupdate/:id', alumnicontrol.update);


// ALUMNI CONTROL ENDS

// STUDENT CONTROL STARTS

const studentcontroller=require('../controller/studentcontroller')

router.post('/studentregister',studentcontroller.register);


router.post('/studentlogin',studentcontroller.login);

router.get('/studentprofile',studentcontroller.profile)


// STUDENT CONTROL ENDS
module.exports=router;
