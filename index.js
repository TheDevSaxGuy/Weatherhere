const express = require('express');
const app = express();
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

app.listen(3000,()=>console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const database= new Datastore('databse.db');
database.loadDatabase();

app.get('/api',((request,response)=>{
    database.find({},(err, data)=>{
    if(err){
        response.end();
        return;
    }    
    response.json(data);
    });
}));



app.post('/api',(request,response)=>{
    console.log('I got a request');
    const data= request.body;
    const timestamp= Date.now();
    data.timestamp= timestamp;
    database.insert(data);
    response.json(data);
});

app.get('/weather/:latlon',async (request,response)=>{
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    const lat= latlon[0];
    const lon =latlon[1];
    console.log(lat,lon);

    const wheather_url = `https://api.darksky.net/forecast/42659372252dff6d1a029372d3377332/${lat},${lon}?units=si`;
    const weather_response = await fetch(wheather_url);
    const weather_data = await weather_response.json();
    const api_key = process.env.API_KEY;
    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();
    const data ={
        weather: weather_data,
        air_quality: aq_data
    };
    response.json(data);
});

