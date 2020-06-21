'use strict';

//Bring outside variables and libraries through dotenv, express, cors
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { response } = require('express');
const superagent = require('superagent');
const PORT = process.env.PORT;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;

//Create an "instance" of express as our app
const app = express();

app.use(cors());

app.get('/location', (request,response) => {
  
  const url = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${request.query.city}&format=json`;
  
  superagent.get(url)  
  .then(data =>{
    console.log(data.body[0]);
    let finalData = new Location(data.body[0], request.query.city);
    console.log(finalData)
    response.status(200).send(finalData);
    
  })
  .catch(() => {
    response.status(500).send('So sorry, something went wrong.');
  });
});

function Location(obj, searchQuery) {

  this.search_query = searchQuery;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
  this.formatted_query = obj.display_name;
}

//Feature 3 of Lab 7:
app.get('/weather', (request,response) => {
  const url = `https://api.weatherbit.io/v2.0/current`;
  console.log(request)
  const queryParams = {
    lat: request.query.latitude,
    lon: request.query.longitude,
  }

  superagent.get(url)
  .set('key', process.env.WEATHER_API_KEY)
  .query(queryParams)
  .then(weatherData =>{
    
    let output = weatherData.body.data.map(object => {
      return new Weather(object.weather,object.last_ob_time)
    })
    
    // let allWeather = [];
    // weatherData.body.data.forEach(obj =>{
    //   let weather = new Weather(obj);
    //  allWeather.push(weather);
    // });

    response.status(200).send(ouput);
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
  const url = `https://www.hikingproject.com/data/get-trails?lat=${coordinates.lat}&lon=${coordinates.lon}`
  superagent.get(url)
  .set('key', process.env.TRAIL_API_KEY)
  .then(data =>{
    let output = data.body.trails.map(object => {
      return new Trails(object)
    }
  })

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
  this.condition_date = new Date(object.conditionDate)
  this.condition_time = 
}


app.use((error, request, answer, next) => {
  console.log(error);
  answer.status(500).send('Sorry, something went wrong');
});

app.listen( PORT, () => console.log(`Server Port: ${PORT}`));