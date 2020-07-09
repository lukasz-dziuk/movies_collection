const express = require("express")
const app = express()
const Database = require("./utils/db_connector.js")
const db = new Database('./data/db.json')
const {
    genresValidator,
    prepereParams
} = require("./utils/tools.js")
const validator = require("validator")

const port = 3000


app.post('/addmovie', async (req, res) => {

    let movie = {};
    try {
        movie = await prepereParams(req.query, db) // validate and prepere parameters
    } catch (error) {
        res.status(error.status).send(error.message)
        return
    }
    try {
        res.send(await db.addMovie(movie))
    } catch (error) {
        res.status(error.status).send(error.message)
    }
})


app.get('/getmovie', async (req, res) => {

    let genres = req.query.genres
    let runtime = req.query.runtime

    if (genres) {
        genres = genres.split(",")
        try {
            genres = await genresValidator(genres, db)
        } catch (error) {
            res.status(error.status).send(error.message)
            return
        }

    }

    if (runtime) {
        if (!validator.isNumeric(runtime)) {
            res.status(400).send("Runtime parameter isn't a number")
            return
        }
        runtime = parseInt(runtime)
    }
    try {
        res.send(await db.getMovie(genres, runtime))
    } catch (error) {
        res.status(error.status).send(error.message)
    }

})

app.get('*', (req, res) => {
    res.send({
        error: "Wrong URL, there's no such an endpoint"
    })
})


app.listen(port, () => {
    console.log("Server is running on port " + port)
})