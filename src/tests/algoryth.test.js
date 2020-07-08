const fs = require('fs').promises;
const Database = require("../utils/db_connector.js")
const database = new Database('./data/db_test.json')

test('Get movies using genres and runtime parameters',async ()=>{
    
    let test_genres=["Crime","Drama","Music"]
    let test_runtime=90
    let result=null
    try {
        result = await database.getMovie(test_genres, test_runtime)
    } catch (error) {
        throw new Error (error.error)
    }

    for(movie of result){
        if(!(parseInt(movie.runtime) >= (80) && parseInt(movie.runtime) <= (100))){
            throw new Error("result includes a movie with inappropriate runtime")
        }
        let i=0; // testing if at least one of genres is in requested genres
        for(genre of movie.genres){
        
            if(test_genres.includes(genre)){
                i++;
            }
        }
        if(!i){
            throw new Error("result includes a movie with inappropriate genres")
        }

    }
    
    expect(result.length).toBe(8)
})

test('Get movies using genres without runtime parameters',async ()=>{
    
    let test_genres=["Crime","Drama","Music"]
    let result=null
    try {
        result = await database.getMovie(test_genres, null)
    } catch (error) {
        throw new Error (error.error)
    }

    for(movie of result){
        let i=0; // testing if at least one of genres is in requested genres
        for(genre of movie.genres){
        
            if(test_genres.includes(genre)){
                i++;
            }
        }
        if(!i){
            throw new Error("result includes a movie with inappropriate genres")
        }

    }
    expect(result.length).toBe(108)
})


test('Add movie',async ()=>{

    let result=null
    let db = null

    try {
        result = await database.addMovie({
            id:null,
            genres: ["Fantasy","Horror"],
            title:"Rambo",
            year:"1982",
            runtime:"100",
            director:"Sylvester Stallone",
            actors:"John Rambo, Sam Trautman, Hope Sheriff Will Teasle",
            plot:"The film First Blood takes place in December 1981, and begins with John Rambo (now a homeless, out-of-work drifter) searching for Delmar Barry, an old friend with whom he served in Vietnam.",
            posterUrl:"https://www.arthipo.com/image/cache/catalog/genel-tasarim/all-posters/sinema-cinema-film-postersleri/yabanci-filmler/pfilm394-rambo_3003a4e7-film-posteri-movie-poster-1000x1000.jpg"
    })

    } catch (error) {
        throw new Error (error.error)
    }

    try {
        db = await database.getdb()
    } catch (error) {
        throw new Error(error.error)
    }
    expect(db.movies.length).toBe(147)

    db.movies.pop()
    let updatedDb = JSON.stringify(db, null, 4)
    await fs.writeFile('./data/db_test.json', updatedDb, (err) => {
        if (err) throw {
            error: "Database problem"
        }
    })
})
test('Get single random movie without runtime parameter',async ()=>{
    
    let result=null
    try {
        result = await database.getMovie()
    } catch (error) {
        throw new Error (error.error)
    }
    expect(typeof result).toBe("object")
    if(!result.hasOwnProperty('id') || !result.hasOwnProperty('genres') || !result.hasOwnProperty('year') || !result.hasOwnProperty('title') || !result.hasOwnProperty('runtime') || !result.hasOwnProperty('director')){
        throw new Error('result object is not a valid object')
    }
})

test('Get single random movie with runtime parameter',async ()=>{
    
    let result=null
    try {
        result = await database.getMovie(null,100)
    } catch (error) {
        throw new Error (error.error)
    }
    expect(typeof result).toBe("object")
    if(!result.hasOwnProperty('id') || !result.hasOwnProperty('genres') || !result.hasOwnProperty('year') || !result.hasOwnProperty('title') || !result.hasOwnProperty('runtime') || !result.hasOwnProperty('director')){
        throw new Error('result object is not a valid object')
    }
})