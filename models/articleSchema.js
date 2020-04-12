const mongoose = require('mongoose');
const articleSchema = mongoose.Schema({
    tittle:{type:String, required: true},
    auther:{type:mongoose.Schema.Types.ObjectId, ref:'user', required: true},
    description:{type:String, required: true}
});

module.exports = mongoose.model('article', articleSchema);