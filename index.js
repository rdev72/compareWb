const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const articleSchema = require('./models/articleSchema');
const ensureLoggedIn = require('./ensureLoggedIn');
const auth = require('./routes/auth');
const article = require('./routes/article');

const port = 3000;

//Middlewares

//for express
const app = express();

//For template Engine
app.set('view engine', 'ejs');          //keep all ejs files in views directory

//For body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//For mongoose
mongoose.connect('mongodb://localhost:27017/nodekb',{
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.once('open', ()=>console.log('mongo connected'));
db.on('error', err => console.log(err));

//For session
app.use(session({
    secret: "i love programming",
    resave: true,
    saveUninitialized: true,
    //cookie:{maxAge:1000*20}
}));

//using inherited routes
app.use('/auth',auth);
app.use('/article',article);

app.get('/',(req,res)=>{
    articleSchema.find().populate('auther','name -_id').exec()
    .then(articles => res.render('index',{tittle:'Root', data:articles, user:req.session.user}))
    .catch(err => console.log(err))
    
});

app.get('/about',(req,res)=>res.send('hello about'));

app.get('/console',ensureLoggedIn, (req,res)=>{
    articleSchema.find({auther:req.session.user._id}).exec().then(userArticles => {
        res.render('console',{user:req.session.user,userArticles:userArticles});
    }).catch(err => console.log(err))
});

app.get('/logout',(req,res)=>{
    req.session.destroy(err => {
        if(err){
            console.log(err);
        }
    });
    res.redirect('/');
});
app.listen(port,()=>console.log(`server is running at http://localhost:${port}`))