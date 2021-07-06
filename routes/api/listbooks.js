const express= require('express');
const router = express.Router();

const Book = require('../../models/Book');

router.get('/', async(req, res) => {

    try
    {
        let books = await Book.find({}, 'name');
        res.send(books);
    }
    catch(e)
    {
        return  res.status(500).send('Server error')
    }


});

module.exports = router;