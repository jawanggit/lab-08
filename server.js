'use strict';

//Bring outside variables and libraries through dotenv, express, cors
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { response } = require('express');
const superagent = require('superagent')
const PORT = process.env.PORT;

//Create an "instance" of express as our app
const app = express();

app.use(cors());

Feature 

app.get('/location', (request,answer) => {

const url = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${request.query.city}=json`

superagent.get(url)
  .then(data =>{
    let finaldata = new Location(data.body[0], request.query.city);
    answer.status(200).send(finalData);
  })
  .catch(() => {
    response.status(500).send('So sorry, something went wrong.');
  });

// app.get('/location', (request,answer) => {
//   let data = require('./data/location.json');
//   // Transform data to match the app.js format
//   let finalData = new Location(data[0],request);
//   // Send transformed data to webpage
//   answer.status(200).json(finalData);
//   }
// );

function Location(obj, searchQuery) {
  this.search_query = searchQuery.query.city;
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


app.listen( PORT, () => console.log('Server Port: ', PORT));

