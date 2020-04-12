const express = require('express');
const userSchema = require('../models/userSchema');
const router = express.Router();

router.post('/register',(req,res)=>{
    if (req.body.password == req.body.cpassword) {
        userSchema.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        .then(user => {
            console.log(user);
            res.redirect('/');
        })
        .catch(err => console.log(err))
    } else {
        res.send(`<script>alert('Password did not match')</script>`)
    }
});

router.post('/login',(req,res)=>{
    userSchema.findOne({email: req.body.email}).exec().then(user => {
        if (user) {
            if (user.password == req.body.password) {
                req.session.user = user;
                res.redirect('/console');
            } else {
                res.send(`<script>alert('Incorrect password')</script>`)
            }
        } else {
            res.send(`<script>alert('USER not found')</script>`)
        }
    }).catch(err => console.log(err))
})

module.exports = router;