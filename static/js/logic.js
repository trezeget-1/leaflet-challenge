// Define variables for our tile layers
let satellite_layer = L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${API_KEY}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/satellite-v9',
    accessToken: 'your.mapbox.access.token'
});


let grayscale_layer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
});


let outdoor_layer = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});



d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
.then(data=>{

    let earthquakes_list = []
    
    data.features.forEach(d=>{

        earthquakes_list.push(
            [d.geometry.coordinates[1], d.geometry.coordinates[0], d.properties.mag, d.properties.time]
            )
        })
    
// THIS IS THE CODE TO ADD CIRCLES TO EACH OF THE POINTERS:

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

  let earthquakes_markers = []

  for (let i=0, n=earthquakes_list.length; i<n; i++){
     
    let milliseconds = earthquakes_list[i][3]
    let dateObject = new Date(milliseconds)
    let weekday = dateObject.toLocaleString("en-US", {weekday: "long"})
    let month = dateObject.toLocaleString("en-US", {month: "long"})
    let day_number = dateObject.toLocaleString("en-US", {day: "numeric"}) // 9
    let year_of_event = dateObject.toLocaleString("en-US", {year: "numeric"}) // 2019
    let time_of_event = dateObject.toLocaleString("en-US", {timeStyle: "full"})
    let full_date = `${weekday}, ${month} ${day_number} ${year_of_event} at ${time_of_event}`


    earthquakes_markers.push(
    L.circle([earthquakes_list[i][0],earthquakes_list[i][1]], {
        fillOpacity: 1,
        color: "black",
        fillColor: fillColor(earthquakes_list[i][2]),
            
        // Setting our circle's radius equal to the output of our markerSize function
        // This will make our marker's size proportionate to its population
        radius: markerSize(earthquakes_list[i][2])
      }).bindPopup("<h1> Time of earthquake: " + full_date + "</h1> <hr> <h2>Magnitude: " + earthquakes_list[i][2] + "</h2>")
    )
  }

  // Add all the cityMarkers to a new layer group.
// Now we can handle them as one group instead of referencing each individually
let earthquakesLayer = L.layerGroup(earthquakes_markers);

var tectonicPlates = new L.LayerGroup();
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(plateData=>{
  L.geoJSON(plateData,
    {
      color: 'orange',
      weight: 5
    })
    .addTo(tectonicPlates);
});



// Only one base layer can be shown at a time
var baseMaps = {
    Satellite: satellite_layer,
    Grayscale: grayscale_layer,
    Outdoors: outdoor_layer
  };


// Overlays that may be toggled on or off
var overlayMaps = {
    "Tectonic Plates": tectonicPlates,
    Earthquakes: earthquakesLayer
  };
  
// Create map object and set default layers
var mymap = L.map("mapid", {
    center: [19.42732435386946, -99.12652721189019],
    zoom: 5,
    layers: [satellite_layer, earthquakesLayer]
  });

 
  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps,{collapsed:false}).addTo(mymap);
  

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


})
.catch(e=>{
    console.log(e)
})
