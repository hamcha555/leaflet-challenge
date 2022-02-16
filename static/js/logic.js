// Store our API endpoint as queryUrl. Significant Earthquakes Past 30 Days
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);

  // console.log(`This is ${data.features.length}`);

  // console.log(`This is depth`);
  // for (var i = 0; i < data.features.length; i++) {
  //   console.log(data.features[i].geometry.coordinates[2])
  // };
  // // console.log(`This is magnitude`);
  // for (var i = 0; i < data.features.length; i++) {
  //   console.log(data.features[i].properties.mag)
  // };
});


// The function that return circle radius
function circleRadius(feature) {
  return (feature.properties.mag**2);
}

// The function that will determine the color/opacity of a marker based on the depth that it belongs to
function choosefillOpacity(depth) {
  if (depth > 100) return 0.7;
  else if (depth > 80) return 0.65;
  else if (depth > 60) return 0.50;
  else if (depth > 40) return 0.35;
  else if (depth > 20) return 0.2;
  else return 0.10;
}

function choosefillColor(depth) {
  if (depth > 70) return "red";
  else if (depth > 50) return "orange";
  else if (depth > 40) return "yellow";
  else if (depth > 15) return "green";
  else if (depth > 10) return "grey";
  else return "white";
}

// MAP FEATURES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<
function createFeatures(earthquakeData) {
  //circle size by magnitude
  function circle(feature, latlng){
    var markers = {
        radius: circleRadius(feature),
        fillColor:  choosefillColor(feature.geometry.coordinates[2]),
        color: "black",
        weight: 1,
        fillOpacity: .50
    };
    return L.circleMarker(latlng, markers);
  }


  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><h4>Magnitude: ${feature.properties.mag} | Depth: ${feature.geometry.coordinates[2]}<hr><p>${new Date(feature.properties.time)}</p>`);
  }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: circle,
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}


// CREATE MAP >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<
function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [20, -37],
    zoom: 2.7,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// Add Legend ------------------------------------------------
// v2 -----------------------------------------------
//used by color and legend functions to define data breaks
  
  breaks = [0, 10, 15, 40, 50, 70];  
  labels = ['> 0','> 10','> 15','> 40','> 50','> 70'];
  //set color of marker function
  function getColor(d) {
    return d >= breaks[5] ? 'red' :
           d >= breaks[4] ? 'orange' :
           d >= breaks[3] ? 'yellow' :
           d >= breaks[2] ? 'green' :
           d >= breaks[1] ? 'grey' :
           "white";
    }

  var legend = L.control({position:'topleft'});

  legend.onAdd = function() {
      var div = L.DomUtil.create('div', 'info legend');
      //loop through items and generate legend
      legend_title = "Depth: Meters"
      console.log(`This is lengend title ${legend_title}`);
      // console.log(`This is breaks length ${breaks.length}`);
      for (var i = 0; i < breaks.length; i++)
        // console.log(`This is labels ${labels}`);
        {div.innterHTML += '<i style="background:' + getColor(breaks[i]) + ' "></i> ' + labels[i] + (breaks ? ' ' + '<br>' : '');
        }
      return div;  
    };
    
    legend.addTo(map);
// v1 -----------------------------------------------
    // var legend = L.control({position: 'bottomright'});
    // legend.onAdd = function() {

    //     var div = L.DomUtil.create('div', 'info legend');
    //     labels = [0, 10, 20, 50, 100, 200, 500, 1000],
    //     colors = ['white','grey','green','yellow','orange','red']

    //     legend_title = "Depth: Meters"
        
    //     div.innerHTML += '<div align = "center"><strong> Depth In Meters </strong></div> <br>'

    //     for (var i = 0; i < labels.length; i++) {
    //         div.innerHTML += 
    //             '<i class="circle" style="background:' + (colors[i]) + '"></i> ' +
    //         labels[i] + (labels[i+1] ? '-' + labels[i+1] + '<br>' : '+');
    //     }
    //   return div;
    // };
// 
    // legend.addTo(map);

}  


// // //////////////////