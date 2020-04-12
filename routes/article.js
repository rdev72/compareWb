const express = require('express');
const articleSchema = require('../models/articleSchema');
const ensureLoggedIn = require('../ensureLoggedIn');
const ensureCorrectAid = require('../ensureCorrectAid');
const router = express.Router();

router.post('/add',ensureLoggedIn,(req,res)=>{
    articleSchema.create({
        tittle:req.body.tittle,
        auther:req.session.user._id,
        description:req.body.description
    })
    .then(article => {
        res.redirect('/console');
    })
    .catch(err => console.log(err))
});

router.get('/edit/:aid', ensureLoggedIn, ensureCorrectAid, (req,res)=>{
        articleSchema.findById(req.params.aid).exec()
        .then(article => {
            if (article && article.auther == req.session.user._id) {
                res.render('editArticle',{user:req.session.user,article:article})
            } else {
                res.render('editArticle',{
                    user:req.session.user,
                    msg:'Either Article is no longer exit or You are not the auther of this article to manipulate'
                })
            }
        })
        .catch(err => console.log(err))
})

router.post('/edit/:aid', ensureLoggedIn, ensureCorrectAid, (req,res)=>{
    let toUpdate = {};
    req.body.tittle ? toUpdate['tittle'] = req.body.tittle : '';
    req.body.description ? toUpdate['description'] = req.body.description :'';
    articleSchema.findByIdAndUpdate(req.params.aid, {$set:toUpdate}).exec()
    .then(article => res.redirect('/console')).catch(err => console.log(err))
});

router.get('/delete/:aid', ensureLoggedIn, ensureCorrectAid, (req,res)=>{
    articleSchema.findByIdAndDelete(req.params.aid).exec()
    .then(article => res.redirect('/console')).catch(err => console.log(err))
})

module.exports = router;