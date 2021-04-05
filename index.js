const express = require('express') ;
const cors = require('cors') ;
const bodyParser = require('body-parser') ;
const dotenv = require('dotenv') ;
require('dotenv').config() ;

const app = express() ;
const PORT =  process.env.PORT || 8080 ;


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT)