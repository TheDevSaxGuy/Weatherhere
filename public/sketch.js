let lan, long;
  if ("geolocation" in navigator) {
    
    console.log("geolocalizacion disponible");
    navigator.geolocation.getCurrentPosition(async position => {
      let lat, long, weather,air;
      try{
    lat = position.coords.latitude.toFixed(2);
    long = position.coords.longitude.toFixed(2);
    document.getElementById("latitud").textContent = lat;
    document.getElementById("longitud").textContent = long;
    const api_url = `weather/${lat},${long}`;
    const response = await fetch(api_url);
    const json= await response.json();
    console.log(json);
    weather = json.weather.currently;
    air = json.air_quality.results[0].measurements[0];
    document.getElementById('aq_parameter').textContent = air.parameter;
    document.getElementById('aq_value').textContent = air.value;
    document.getElementById('aq_unit').textContent= air.unit;
    document.getElementById('aq_date').textContent= air.lastUpdated;
    document.getElementById('summary').textContent = weather.summary;
    document.getElementById('temperature').textContent = weather.temperature;

    const data = { lat, long, weather, air };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    const db_response = await fetch("/api", options);
    const db_json = await db_response.json();
    console.log(db_json);
      }
      catch(error){
        console.log('something went wrong');
        air = {value:-1};
      }
    });
  }
  else {
    console.log("geolocation not available");
  }