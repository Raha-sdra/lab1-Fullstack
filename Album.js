const mongoose = require('mongoose')

const AlbumSchema = new mongoose.Schema(
    {
        id:{type: Number , require: true, unique: true},
        title:{type: String , require: true},
        artist:{type: String , require: true},
        year: {type: Number , require: true},

    }
)

module.exports =new mongoose.model("Album",  AlbumSchema)