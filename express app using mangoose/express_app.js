const mongoose = require("mongoose");

const express = require("express");

// 1 - connect to mongo server 
const connect = () => {
    return mongoose.connect("mongodb://127.0.0.1:27017/entertainment")
}

// 2 - create a schema for our DataTransfer
const movieSchema = new mongoose.Schema({
    id : {type: Number, required: true, unique:true},
    movie_name : {type: String, required: true}, // may or may not enter
    movie_genre : {type: String, required: false},
    production_year : {type: Number, required: true},
    budget : {type: Number, required: true}
},{versionKey: false, timestamps: true});

// 3 - create a model from the schema
const Movies = mongoose.model("movie", movieSchema); //movies table


const app = express();

app.use(express.json());

app.post("/movies", async(req, res) => {

    try {
        const movie = await Movies.create(req.body);
        console.log('req.body:', req.body)
    
        res.send(movie)
        // res.status(201).send(movie);    
    } catch (e) {
        res.status(500).json({ status: e.message }); //needs to object format for catch
    }
    
});

app.get("/movies/", async(req, res) => {

    try {
        const movie = await Movies.find().lean().exec(); //lean is for convert the data from mangoose format to json format, exec is denote end cmd

        res.send({movie});
    } catch (e) {
        res.status(500).json({ status: e.message }); //needs to object format for catch
    }
    
})

app.get("/movies/:id", async(req, res) => {
    console.log(req.params.id)

    try {
        const movie = await Movies.findById(req.params.id).lean().exec(); //lean is for convert the data from mangoose format to json format, exec is denote end cmd

        res.send({movie});
    } catch (e) {
        res.status(500).json({ error_message: e.message, status: "Failed" }); //needs to object format for catch
    }
    
})

app.patch("/movies/:id", async(req, res) => {

    //fetched -> updated -> don't fetch
    //when use new:true ---> fetched -> updated -> fetch
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body,{new: true}).lean().exec(); 

        res.send({movie});
    } catch (e) {
        res.status(500).json({ error_message: e.message, status: "Failed" }); //needs to object format for catch
    }
    
})

app.delete("/movies/:id", async(req, res) => {

    //fetched -> updated -> don't fetch
    //when use new:true ---> fetched -> updated -> fetch
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id, req.body,{new: true}).lean().exec(); 

        res.send({movie});
    } catch (e) {
        res.status(500).json({ error_message: e.message, status: "Failed" }); //needs to object format for catch
    }
    
})

app.listen("2347", async () => {
    await connect();
    console.log("Hai i am listening 2347")
})