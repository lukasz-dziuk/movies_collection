const fs = require('fs').promises;
const {
    allCombinations
} = require('./tools.js')

class Database {


    constructor(dbPath) {

        this.dbPath = dbPath
    }

    async getdb() {
        let rawdata = await fs.readFile(this.dbPath, (err, data) => {
            if (err) throw {
                message: "Server problem",
                status: 500
            }

            return data
        })

        let data = JSON.parse(rawdata)

        return data // return db.json as an object JavaScript's Object
    }

    async addMovie(movie) {
        let db = null
        try {
            db = await this.getdb()
        } catch (error) {
            throw {
                message: error.message,
                status: error.status
            }
        }

        let nextId = Object.keys(db.movies).length + 1

        movie.id = nextId
        db.movies.push(movie)

        let updatedDb = JSON.stringify(db, null, 4)
        await fs.writeFile(this.dbPath, updatedDb, (err) => {
            if (err) throw {
                message: "Database problem",
                status: 500
            }
        })

        return movie
    }

    async getMovie(genres, runtime) {
        let db = null;
        try {
            db = await this.getdb()
        } catch (error) {
            throw {
                message: error.message,
                status: error.status
            }
        }

        if (genres) {

            let ids = []
            let movies = []
            let combinations = allCombinations(genres) // get array with all genres combinations

            combinations.forEach((combination) => {

                let currentMovies = db.movies.filter((movie) => { //filter out only matching movies
                    let isValid = true;
                    if (runtime) { // if runtime parameter is provided, then check if a movie has a proper runtime
                        if (!(parseInt(movie.runtime) >= (runtime - 10) && parseInt(movie.runtime) <= (runtime + 10))) {
                            return false
                        }
                    }

                    combination.forEach((genre) => { // check if genres of current movie matches current combination of genres 
                        if (!movie.genres.includes(genre)) {
                            isValid = false
                        }
                    })
                    if (isValid) { // check if this movie was taken before
                        if (ids.includes(movie.id)) {
                            isValid = false
                        }
                        ids.push(movie.id)
                    }
                    return isValid
                })
                movies = movies.concat(currentMovies)

            })



            return movies
        }
        if (!genres && runtime) {
            let movie = db.movies.filter((movie) => {
                return parseInt(movie.runtime) >= (runtime - 10) && parseInt(movie.runtime) <= (runtime + 10) // return only movie that meets condition

            })
            return movie[Math.floor(Math.random() * movie.length)] // return random movie from an array
        }
        if (!genres && !runtime) {
            let movie = db.movies[Math.floor(Math.random() * db.movies.length)] // single random movie
            return movie
        }
    }

}



module.exports = Database