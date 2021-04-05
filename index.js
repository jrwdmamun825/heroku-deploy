const express = require('express') ;
const cors = require('cors') ;
const bodyParser = require('body-parser') ;
const dotenv = require('dotenv') ;
require('dotenv').config() ;

const app = express() ;
app.use(cors()) ;
app.use(bodyParser.json()) ;
const PORT =  process.env.PORT || 8080 ;
const MongoClient = require('mongodb').MongoClient;
const { restart } = require('nodemon')
const  ObjectID = require('mongodb').ObjectID ;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hsyzd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookCollection = client.db("bookStore").collection("books");
  const ordersCollection = client.db("bookStore").collection("orders");
  console.log('database connect')
    app.get('/bookList' , (req,res) =>{
        bookCollection.find({})
        .toArray((err ,data) => {
            res.send(data)
        })
    })
    app.get('/booKById/:id' , (req,res)=> {
      const id = ObjectID(req.params.id)
      bookCollection.findOne(id)
      .then((result) =>{
        res.send(result)
      })
    })

    app.post('/orderDetails' , (req,res) => {
      const order = req.body ;
      console.log(order)
      ordersCollection.insertOne(order)
      .then((err,data) =>{
        res.send(data[0])
      })
    })

    app.get('/orderDetails' , (req,res)=> {
      ordersCollection.find({email: req.query.email})
      .toArray((err,data) => {
        res.send(data)
      })
    })

    app.post('/addBook' , (req,res) => {
      const addNewBook = req.body ;
      bookCollection.insertOne(addNewBook)
      .then(result => {
        res.send(result)
        console.log(result)
      })
    })
   
    app.delete('/deleted/:id',(req,res) =>{
        const id= ObjectID(req.params.id);
        bookCollection.findOneAndDelete({_id : id})
        .then(result => {
          res.send(!!result.value)
        })
  })
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT)