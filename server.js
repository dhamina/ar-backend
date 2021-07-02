const express = require('express');
const connectDB = require('./config/db')

const app = express();

//DataBase connection
connectDB();

app.use(express.json({extended:false}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/addbook',require('./routes/api/addbook'));
app.use('/api/listbooks',require('./routes/api/listbooks'));
app.use('/api/addcontent',require('./routes/api/addcontent'));
app.use('/api/listcontents',require('./routes/api/listcontents'));

const PORT= process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.json({"message": "Welcome to AR BOOKS"});
});
