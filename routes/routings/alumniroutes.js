const express=require('express');
const router =  express.Router();

const alumnicontrol=require();

router.post('/register',alumnicontrol.register);

module.exports=router;
