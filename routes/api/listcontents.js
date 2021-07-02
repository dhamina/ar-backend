const express= require('express');
const router = express.Router();

const BookContent = require('../../models/BookContent');
const Book = require('../../models/Book');

router.post('/', async(req, res) => {

    let id = req.body._id;
  
    try
    {
        let bookContents = await BookContent.find({book : id}, 'name url');

      /*  if(Object.keys(bookContents).length === 0  )
        {
          return res.status(400).json({ error:[{msg:"No content available"}]}); 
        }*/

        let book = await Book.findById(id);

        res.json({"bookID" : id, "bookName": book.name, "contents" : bookContents});    
    }
    catch(e)
    {
        return  res.status(500).send('Server error')
    } 


});

module.exports = router;