'use strict';

//Bring outside variables and libraries through dotenv, express, cors
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { response } = require('express');
const PORT = process.env.PORT;

//Create an "instance" of express as our app
const app = express();

app.use(cors());

//Feature 2 of Lab 6:

app.get('/location', (request,answer) => {
  let data = require('./data/location.json');
  // Transform data to match the app.js format
  let finalData = new Location(data[0]);
  // Send transformed data to webpage
  answer.status(200).json(finalData);
  }
);

function Location(obj) {
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
  this.time = obj.datetime  
}

app.use((error, request, answer, next) => {
  console.log(error);
  answer.status(500).send('Sorry, something went wrong');
});


app.listen( PORT, () => console.log('Server Port: ', PORT));

