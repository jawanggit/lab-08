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
  this.time = obj.datatime;
}



// // $('thing').on('something', () => {})
// app.get('/restaurants', (request, response) => {
//   let data = require('./data/restaurants.json');

//   let allRestaurants = [];
//   data.nearby_restaurants.forEach( restObject => {
//     let restaurant = new Restaurant(restObject);
//     allRestaurants.push(restaurant);
//   });

//   response.status(200).json(allRestaurants);
// });

// function Restaurant(obj) {
//   this.restaurant = obj.restaurant.name;
//   this.locality = obj.restaurant.location.locality;
//   this.cuisines = obj.restaurant.cuisines;
// }

// app.put(), app.delete(), app.post()

// app.use('*', (request,response) => {
//   response.status(404).send('Huh?');
// });

// app.use((error, request, response, next) => {
//   console.log(error);
//   response.status(500).send('server is broken');
// });

app.listen( PORT, () => console.log('Server Port: ', PORT));

// Handle a request for location data
// Get a city from the client
// Fetch data from an API
// Adapt the data, using a Constructor Function
// Send the adapted data to the client


// Locaton Constructor Function
// Take in some big object, turn it into something that matches the contract


// Handle a request for restaurant data
// Get location information from the client (lat,long,city-name)
// Fetch data from an API
// Adapt the data, using a Constructor Function
// Send the adapted data to the client

// Restaurant Constructor Function
// Take in some big object, turn it into something that matches the contract
