const mongoose = require("mongoose");
const BookSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    
    date:{
      type:Date,
      default:Date.now
    }
});
module.exports =Book = mongoose.model('book', BookSchema);