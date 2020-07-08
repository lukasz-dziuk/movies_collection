const validator = require("validator")

const set_firsts_letters = (array) => { // make first letter capital in array of strings
    let new_array = array.map((element) => {
        element = element.trim()
        return element.charAt(0).toUpperCase() + element.slice(1)
    })
    return new_array
}


const genresValidator = async (userGenres, db) => {

    let database = null
    try {
        database = await db.getdb()
    } catch (error) {
        throw {message: "Server problem",
         status: 500}
    }
    userGenres = set_firsts_letters(userGenres) // All genres in database starts with capital letter so i do the same with users input

    for (genre of userGenres) {
        if (!database.genres.includes(genre)) {
            throw {
                message: "You can only search for theese geners :  Comedy, Fantasy, Crime, Drama, Music, Adventure, History, Thriller, Animation, Family, Mystery, Biography, Action, Film-Noir, Romance, Sci-Fi, War, Western, Horror, Musical, Sport",
                status: 400
            }
        }
    }
    return userGenres
}

const prepereParams = async (params, db) => {

    let parameters = {
        id: null
    }

    if (!(params.genres && params.title && params.runtime && params.director)) {
        throw {
            message: "Request must contains fields : genres,title,year,runtime,director",
            status: 400
        }
    }

    if (!(typeof params.title === "string") || !(params.title.length <= 255)) {
        throw {
            message: "title must be a string and contains max 255 characters",
            status: 400
        }
    }
    parameters.title = params.title

    if (!validator.isNumeric(params.year)) {
        throw {
            message: "year must be numeric",
            status: 400
        }
    }

    parameters.year = params.year

    if (!validator.isNumeric(params.runtime)) {
        throw {
            message: "runtime must be numeric",
            status: 400
        }
    }
    parameters.runtime = params.runtime

    try {
        parameters.genres = await genresValidator(params.genres.split(","), db) // genres validation
    } catch (error) {
        throw error
    }



    if (!(typeof params.director === "string") || !(params.director.length <= 255)) {
        throw {
            message: "director must be a string and contains max 255 characters",
            status: 400
        }
    }
    parameters.director = params.director

    if (params.posterUrl || params.plot || params.actors) {

        if (params.actors) {

            if (!(typeof params.actors === "string")) {
                throw {
                    message: "actors must be a string",
                    status: 400
                }
            }
            parameters.actors = params.actors
        }

        if (params.plot) {
            if (!(typeof params.plot === "string")) {
                throw {
                    message: "plot must be a string",
                    status: 400
                }
            }
            parameters.plot = params.plot
        }

        if (params.posterUrl) {
            if (!(typeof params.posterUrl === "string")) {
                throw {
                    message: "posterUrl must be a string",
                    status: 400
                }
            }
            parameters.posterUrl = params.posterUrl
        }


    }

    return parameters

}



const allCombinations = (array) => {
    let combinations = []
    let temp = []
    let slent = Math.pow(2, array.length)

    for (let i = 0; i < slent; i++) {
        temp = []
        for (let j = 0; j < array.length; j++) {
            if ((i & Math.pow(2, j))) {
                temp.push(array[j])
            }
        }
        if (temp.length) {
            combinations.push(temp)
        }
    }
    combinations.sort((a, b) => {

        return b.length - a.length

    })
    return combinations
}

module.exports = {
    allCombinations,
    genresValidator,
    prepereParams
}