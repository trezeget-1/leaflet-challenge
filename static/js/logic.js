var mymap = L.map('mapid').setView([51.505, -0.09], 13);


L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${API_KEY}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
.then(data=>{

    console.log(data.features)
    
    let earthquakes_list = []
    
    data.features.forEach(d=>{
        // console.log(d.geometry.coordinates[0])

        earthquakes_list.push(
            [d.geometry.coordinates[1], d.geometry.coordinates[0]]
            )
        })
        
    console.log(earthquakes_list)

    var earthquakes = L.layerGroup(earthquakes_list);

    var map = L.mymap('map', {
        layers: earthquakes
    });



    // L.geoJson(earthquakes_list,{
    //     // style: satellite-v9,
    //     // onEachFeature: mapLogic
    // }).addTo(mymap)
})
// .catch(e=>{
//     console.log(e)
// })