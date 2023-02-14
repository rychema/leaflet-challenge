// Store URL of earthquake data (All past 7 days).
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Obtain and store the Promise object. 
let promiseObject = d3.json(url);

// Perform a GET request to the URL.
promiseObject.then(function (data) {
    // Store features in variable.
    let earthquakeFeatures = data.features;

    // Create functions.
    createMap(earthquakeFeatures);
});

// Create a function to plot earthquake features on a map.
function createMap(features) {
    console.log(features)

    // Create a map object.
    let map = L.map("map", {
        center: [37.09, -95.71],
        zoom: 3
    });

    // Add a tile layer.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create function to set size of marker.
    function setSize(magnitude) {
        return Math.sqrt(magnitude) * 50000;
    };

    // Color mapping based on depth of earthquak.
    function setColor(depth) {
        if (depth >= 90) {
            return '#FF0000';
        } else if (depth >= 70) {
            return '#FF6666';
        } else if (depth >= 50) {
            return '#FF8000';
        } else if (depth >= 30) {
            return '#FFFF00';
        } else if (depth >= 10) {
            return '#66CC00'
        } else {
            return '#66FF66'
        }
    };

    //  Add circles for each earthquak to the map.
    for (let i = 0; i < features.length; i++) {
        let feature = features[i];
        let geometry = feature.geometry;
        let lat = geometry.coordinates[1];
        let lng = geometry.coordinates[0];
        let depth = geometry.coordinates[2];
        let magnitude = Math.abs(feature.properties.mag);

        // Add circle to map with popup.
        L.circle([lat, lng], {
            color: setColor(depth),
            fillColor: setColor(depth),
            fillOpacity: 0.75,
            radius: setSize(magnitude)
        }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`).addTo(map);
    };

    // Create legend.
    let legend = L.control({
        position: "bottomleft"
    });

    // Add text and colorcoding to legend. 
    legend.onAdd = function(map) {
        let div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Color by Depth</h4>";
        div.innerHTML += '<i style="background: #FF0000"></i><span>More Than 90</span><br>';
        div.innerHTML += '<i style="background: #FF6666"></i><span>70-90</span><br>';
        div.innerHTML += '<i style="background: #FF8000"></i><span>50-70</span><br>';
        div.innerHTML += '<i style="background: #FFFF00"></i><span>30-50</span><br>';
        div.innerHTML += '<i style="background: #66CC00"></i><span>10-30</span><br>';
        div.innerHTML += '<i style="background: #66FF66"></i><span>Less Than 10</span><br>';
        return div;
    };

    // Add legend to map.
    legend.addTo(map);
};