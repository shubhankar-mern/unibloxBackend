const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const routes = require('./routes/index');
const DB = require('./config/db');

// Initialize the database

(()=>{
    new DB();
})();


app.use(express.json());
app.use(cors());
app.use('/', routes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


module.exports = {app};