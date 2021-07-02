const express= require('express');
const router = express.Router();

const Book = require('../../models/Book');

router.post('/', async(req, res) => {

    try
    {
        let book = new Book(req.body);   
        await book.save();
        res.json({"message" : "Book added successfully!"});
    }
    catch(e)
    {
        return  res.status(500).send('Server error')
    }


});

module.exports = router;