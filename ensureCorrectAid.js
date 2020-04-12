const mongoose = require('mongoose');
module.exports = (req,res, next)=>{
    if (mongoose.Types.ObjectId.isValid(req.params.aid)) {
        next();
    }else{
        res.send('params id is required which is a kind of mongodb id')
    }
}