const express= require('express');
const router = express.Router();

const BookContent = require('../../models/BookContent');

router.post('/', async(req, res) => {

    const {name, url} = req.body;

    try
    {
        let bookContent = new BookContent({
            name,
            url
        });
        bookContent.book = req.body._id;
        await bookContent.save();
        res.json({"message" : "Book content added successfully!"});
    }
    catch(e)
    {
        return  res.status(500).send('Server error')
    }


});

module.exports = router;