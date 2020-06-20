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
  console.log(url)
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

//Feature 3 of Lab 6:
app.get('/weather', (request,answer) => {
  let weatherData = require('./data/weather.json');

  let allWeather = [];
  weatherData.data.forEach(obj =>{
    let weather = new Weather(obj);
    allWeather.push(weather);
  });

  answer.status(200).json(allWeather)

});

function Weather(obj){
  this.forecast = obj.weather.description;
  let result = new Date(obj.datetime);
  this.time = result.toDateString();
}

app.use((error, request, answer, next) => {
  console.log(error);
  answer.status(500).send('Sorry, something went wrong');
});


app.listen( PORT, () => console.log(`Server Port: ${PORT}`));