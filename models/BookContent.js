const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookContentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    book: {
      type: Schema.Types.ObjectId, 
      ref: 'book'
    },

    url:{
      type:String,
      required:true
    },
    
    date:{
      type:Date,
      default:Date.now
    }
});
module.exports = BookContent = mongoose.model('bookcontent', BookContentSchema);