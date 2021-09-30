const axios = require('axios');
const express = require('express');    
const bodyParser=require('body-parser'); 

const app = express()

const port = process.env.PORT || 3000;
// parse application/json 
app.use(bodyParser.json()); 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/updatelogintime', (req, res) => {

  const { email } = req.query;
  console.log('Request is ', req);  
  const eventData = {
    "portalId": 20500346,
    "email": email,
    "eventName": "pe20500346_member_login",
  };
  const data = { "properties": [] };
  const config = { // important!
    headers: {
      "Content-Type": "application/json",
    }
  };
  axios.post('https://api.hubspot.com/events/v3/send?hapikey=7590e65f-4eb4-4dcb-8dca-ebc6237f96bd', eventData,config ).then(response =>{
    console.log('Success', email);  
    res.send(response);
  }).catch(error => {
      console.error('There was an error!', error);
      res.send(error);
  });
})

app.get('/register', (req, res) => {

  const { email } = req.query;
  console.log('Request is ', req);  
  const eventData = {
    "portalId": 20500346,
    "email": email,
    "eventName": "pe20500346_member_registration",
  };
  const data = { "properties": [] };
  const config = { // important!
    headers: {
      "Content-Type": "application/json",
    }
  };
  axios.post('https://api.hubspot.com/events/v3/send?hapikey=7590e65f-4eb4-4dcb-8dca-ebc6237f96bd', eventData,config ).then(response =>{
    console.log('Success', email);  
    res.send(response);
  }).catch(error => {
      console.error('There was an error!', error);
      res.send(error);
  });
})


app.get('/services', async (req, res) => {
  const { type } = req.query;
  console.log('Request Query is ', req.query);
  const config = { // important!
    headers: {
      "Content-Type": "application/json",
    }
  };
  await axios.post(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=${type}&key=AIzaSyBed50ueGqOgJxRl0f4w_d1SiGhQINGpPU&location=13.19958,77.70939&radius=500&=`, config)
    .then(async (response) =>{
      const results = response.data.results;
      const data = [];
      await results.forEach(async(element,index) => {
          let resultObj = {};
          resultObj.name = element.name;
          resultObj.pricing_level = element.price_level;
          resultObj.rating = element.rating;
          resultObj.user_ratings_total = element.user_ratings_total;
          let photoRef = element.photos[0].photo_reference;
          resultObj.icon_background_color = element.icon_background_color;
          resultObj.location = element.geometry.location;
          axios.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=AIzaSyBed50ueGqOgJxRl0f4w_d1SiGhQINGpPU`)
          .then((photo) => { 
            //const buffer = Buffer.from(photo.data, 'base64');
            resultObj.photoRef = 'random';
          })

          data.push(resultObj);
          if(results.length == index){   
          }
      });
      res.send(data);
    })
    .catch(error => {
        console.error('There was an error!', error);
        res.send(error);
  });
})

app.get('/rsvp', async (req, res) => {
  const { email, eventName } = req.query;
  const eventData = {
    "portalId": 20500346,
    "email": email,
    "eventName": "pe20500346_rsvp",
    "hs_page_title": eventName,
    "pageName": eventName
  };
  const config = { // important!
    headers: {
      "Content-Type": "application/json",
    }
  };
  await axios.post('https://api.hubspot.com/events/v3/send?hapikey=7590e65f-4eb4-4dcb-8dca-ebc6237f96bd', eventData,config ).then(response =>{
      res.send(response);
  }).catch(error => {
      console.error('There was an error!', error);
      res.send(error);
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})