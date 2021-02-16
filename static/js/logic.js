var mymap = L.map('mapid').setView([51.505, -0.09], 5);


L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${API_KEY}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    tileSize: 512,
    // maxZoom: 12,
    zoomOffset: -1,
    id: 'mapbox/satellite-v9',
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
.then(data=>{

    let earthquakes_list = []
    
    data.features.forEach(d=>{

        earthquakes_list.push(
            [d.geometry.coordinates[1], d.geometry.coordinates[0], d.properties.mag, d.properties.time]
            )
        })
    
// THIS IS THE CODE TO ADD CIRCLES TO EACH OF THE POINTERS:

// Loop through the countries array

function markerSize(magnitude) {
    return magnitude * 25000;
  }
  

  let color = ""

  function fillColor(magnitude_of_earthquake) {
    if (magnitude_of_earthquake<1){
      color = "#b7f34d"
    }else if (magnitude_of_earthquake<2){
      color = "#e1f34d"
    }else if (magnitude_of_earthquake<3){
      color = "#f3db4d"
    }else if (magnitude_of_earthquake<4){
        color = "#f3ba4d"
    }else if (magnitude_of_earthquake<5){
        color = "#f0a76b"
    }else if (magnitude_of_earthquake>5){
        color = "#f06b6b"
    }
    
    return color;
  }


  for (let i=0, n=earthquakes_list.length; i<n; i++){
     
    let milliseconds = earthquakes_list[i][3]
    let dateObject = new Date(milliseconds)
    let weekday = dateObject.toLocaleString("en-US", {weekday: "long"})
    let month = dateObject.toLocaleString("en-US", {month: "long"})
    let day_number = dateObject.toLocaleString("en-US", {day: "numeric"}) // 9
    let year_of_event = dateObject.toLocaleString("en-US", {year: "numeric"}) // 2019
    let time_of_event = dateObject.toLocaleString("en-US", {timeStyle: "full"})
    let full_date = `${weekday}, ${month} ${day_number} ${year_of_event} at ${time_of_event}`



    L.circle([earthquakes_list[i][0],earthquakes_list[i][1]], {
        fillOpacity: 1,
        color: "black",
        fillColor: fillColor(earthquakes_list[i][2]),
            
        // Setting our circle's radius equal to the output of our markerSize function
        // This will make our marker's size proportionate to its population
        radius: markerSize(earthquakes_list[i][2])
      }).bindPopup("<h1> Time of earthquake: " + full_date + "</h1> <hr> <h2>Magnitude: " + earthquakes_list[i][2] + "</h2>").addTo(mymap);
  }

})


  /*Legend specific*/
  var legend = new L.control({ position: "bottomright" });

  legend.onAdd = function(map) {
  
  var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h2>Magnitude of Earthquakes</h2>";
    div.innerHTML += '<i style="background:#b7f34d"></i><span>0-1</span><br>';
    div.innerHTML += '<i style="background: #e1f34d"></i><span>1-2</span><br>';
    div.innerHTML += '<i style="background: #f3db4d"></i><span>2-3</span><br>';
    div.innerHTML += '<i style="background: #f3ba4d"></i><span>3-4</span><br>';
    div.innerHTML += '<i style="background: #f0a76b"></i><span>4-5</span><br>';
    div.innerHTML += '<i style="background: #f06b6b"></i><span>5+</span><br>';
  
    return div;
  };
  
  legend.addTo(mymap);
  
  


// .catch(e=>{
//     console.log(e)
// })


// 0-1 #b7f34d
// 1-2 #e1f34d
// 2-3 #f3db4d
// 3-4 #f3ba4d
// 4-5 #f0a76b
// 5+ #f06b6b







