require("dotenv").config();
// dependancies
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const morgan = require('morgan');

// app object
const app = express();
// PORT+database url acsses
const {PORT = 5000, MONGODB_URL} = process.env;

// database connection=============================
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
// connection events--
mongoose.connection
.on("open", () => console.log("You are connected to mongodb"))
.on("close", () => console.log("You are disconnected from mongodb"))
.on("error", (error) => console.log(error));

// listener
app.listen(PORT, ()=> console.log("Express is listening on port:", PORT));
// data model====================================================
const ChordsSchema = new mongoose.Schema({
    author: String,
    title: String,
    tones: {
        bass: Number,
        tenor: Number,
        alto: Number,
        soprano: Number
    },
    colors: {
        bass: String,
        tenor: String,
        alto: String,
        soprano: String
    },
}, {timestamps: true });

const Chords = mongoose.model("Chords", ChordsSchema);
// middleware===================================
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies
// routes=============================================
// test route-----
app.get('/', (req, res) => {
    res.send("hello world");
});
// chords index route--------
app.get('/chords', async (req, res) => {
    try {
        res.json(await Chords.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});
// chord delete route-----------
app.delete('/chord/:id', async (req, res) => {
    try {
        res.json(await Chords.findByIdAndRemove(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
});
// chord update route------------
app.put('/chords/:id', async(req, res) => {
    try {
        res.json(await Chords.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        }));
    } catch (error) {
        res.status(400).json(error);
    }
});
// chords create route----------
app.post("/chords", async (req, res) => {
    try {
        res.json(await Chords.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});