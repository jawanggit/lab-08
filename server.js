'use strict';

//Bring outside variables and libraries through dotenv, express, cors
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pg = require('pg')
const superagent = require('superagent');
const PORT = process.env.PORT;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;

//Create an "instance" of express as our app
const app = express();
app.use(cors());

//create a SQL client connection
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => {throw err;});

let location = {};

client.connect()
  .then( () => {
    app.listen(PORT, () => {
      console.log(`Server is up on port ${PORT}.`);
    });
  })
  .catch(err => {
    throw `PG startup error: ${err.message}`;
  })

app.get('/location', (request,response) => {
  
  
  //check SQL database for inputted city 
  const query = [request.query.city]
  const SQL = 'SELECT * FROM city_explorer_1 WHERE cityname = $1'
  client.query(SQL,query)
  .then (results => {
    console.log(results);
    response.status(200).json(results);
  })
  .catch( error => {response.status(500).send(error)
  });
  
  // either use information from SQL database or do API call 
  if (location[request.query.city]){
    response.status(200).send(location[request.query.city]);
    
  }else{

    console.log('else statement ran')
    const url = `https://us1.locationiq.com/v1/search.php`;
    
    let queryObject = {
      key: process.env.GEOCODE_API_KEY,
      format: 'json',
      q: request.query.city
    }
    
    superagent.get(url)
    .query(queryObject)
    .then(data =>{
      // console.log(data.body[0]);
      let finalDataObj = new Location(data.body[0], request.query.city);
     
      location[request.query.city] = finalDataObj;
      // console.log(response)
      //send requested information to front-end
      response.status(200).send(finalDataObj);
      
      //after saving object to an array of objects, save/insert request to SQL table
      let cityName = request.query.city
      let latitude_value = request.query.latitude
      let longitude_value = request.query.longitude
      let safeQuery = [cityName, latitude_value, longitude_value]

      let SQL = 'INSERT INTO city_explorer_1 (cityName, latitude_value, longitude_value) VALUES ($1, $2, $3) RETURNING *'
      
      //safeQuery protects against SQL injection and merges $1 with safeQuery array
      client.query(SQL, safeQuery)
        .then(results => {
          console.log(results)
          response.status(200).send(results);
        })
        .catch(error => {response.status(500).send(error)});  
    })

    .catch((e) => {
      // console.log(e)
      response.status(500).send('So sorry, something went wrong.');
    });
  };
});

function Location(obj, searchQuery) {

  this.search_query = searchQuery;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
  
}

//Feature 3 of Lab 7:


app.get('/weather', (request,response) => {
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${request.query.latitude}&lon=${request.query.longitude}&key=${process.env.WEATHER_API_KEY}&days=8`
  // console.log(url)
  superagent.get(url)
  .then(weatherData =>{
      let output = weatherData.body.data.map(object => {
      return new Weather(object.weather,object.datetime)
    })
    
    response.status(200).send(output);
    
  })
  .catch(() => {
    response.status(500).send('So sorry, something went wrong with the weather.');

  });

});

function Weather(info, time){
  this.forecast = info.description;
  this.time = new Date(time).toDateString();
}

app.get('/trails', (request,response) => {
  const url = `https://www.hikingproject.com/data/get-trails?lat=${request.query.latitude}&lon=${request.query.longitude}&key=${process.env.TRAIL_API_KEY}`
  // console.log(url)
  superagent.get(url)
  .then(data => {
    let output = data.body.trails.map(object => {
      return new Trails(object)
      
    })

    response.status(200).send(output);
  })
  .catch((e) => {
    // console.log(e)
    response.status(500).send('So sorry, something went wrong with the trail info.');

  });

})

function Trails(object){
  this.name = object.name;
  this.location = object.location;
  this.length = object.length;
  this.stars = object.stars;
  this.stars_votes = object.starVotes;
  this.summary = object.summary;
  this.trail_url = object.url;
  this.conditions = object.conditionDetails
  this.condition_date = object.conditionDate.slice(0,10);
  this.condition_time = object.conditionDate.slice(11,19);
  // console.log(this.condition_time)
  // console.log(this.condition_date)
}


app.use((error, request, answer, next) => {
  console.log(error);
  response.status(500).send('Sorry, something went wrong');
});