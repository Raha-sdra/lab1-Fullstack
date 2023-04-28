const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require ('dotenv').config()
const Album = require('./Album')

const port = process.env.PORT || 3000
const uri = process.env.URI


mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, dbName: "Music"})
.then(()=>console.log('MongoDB and Mongoose connected!'))
.catch(error =>console.error('Error in connection!', error))

app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/', async(req,res)=>
{
    try {
        const albums = await Album.find()
        res.json(albums)
    } catch (error) {
        res.status(500).json({message: "error in getting albums"})
    }
})

app.get("/:title", async (req, res) => {
    const searchTitle = req.params.title;
    try {
      const album = await Album.find({ title: { $regex: new RegExp(`${searchTitle}`, "i") } }).exec();
      if (album.length === 0) {
        res.status(404).send(`No such album with title ${searchTitle} in the database!`);
        return;
      }
      res.json(album);
    } catch (err) {
      res.status(500).send(err.message);
    }
});

app.put("/:id", async (req, res) => {
    const id = req.params.id;
    if (albumById(id, res)) {
      const album = await albumById(id, res)
      try {
        album.title = req.body.title;
        album.artist = req.body.artist;
        album.year = req.body.year;
        const result = await album.save();
        res.json(result);
      } catch (err) {
        res.status(500).send(err.message);
      }
    }    
})

app.delete("/:id", async (req, res) => {
    const id = req.params.id;
    if (albumById(id, res)) {
      const album = await albumById(id, res)
      try {
        await album.deleteOne();
        res.json({message: "Deleted Successfully"});
      } catch (err) {
        res.status(500).send(err.message);
      }
    }    
})

app.post('/', async (req, res) => {
    try {
      const newAlbum = {
        title: req.body.title,
        artist: req.body.artist,
        year: req.body.year
      }
      const albums = await Album.find(newAlbum).exec();
      if (albums.length > 0) {
        res.status(409).json({ message: "This album is registered into the database!" })
        return;
      }
  
    //   let newId = await generateID()
  
      const album = new Album({
        // id:newId,
        ...newAlbum,
      });
  
      try {
        const a1 = await album.save();
        console.log(a1);
        res.status(201).json([a1]);
      } catch (err) {
        res.sendStatus(400);
        return;
      }
    } catch (error) {
      console.log('err', error);
    }
  })

async function albumById(id, res){
    let album = await Album.find({id:id}).exec();
    if(album.length === 0){
        return res.status(404).send('No such album')
    }
    album=album[0];
    return album
}

app.listen(port, console.log('The app is running on http://localhost:'+ port))