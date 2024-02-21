 // Initialize map
 const map = L.map('map').setView([28.2115, 83.999], 10);
// Add OSM Map
const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

 // Add Google hybrid Map
 const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
     maxZoom: 20,
     subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
 })

 var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
})

 // Add Nepal admin boundaries from Geoserver
 const province = L.Geoserver.wms('http://localhost:8080/geoserver/Nepal/wms', {
     layers: 'Nepal:Province',
     format: 'image/png',
     transparent: true,
 }).addTo(map);

 const district = L.Geoserver.wms('http://localhost:8080/geoserver/Nepal/wms', {
     layers: 'Nepal:Districts',
     format: 'image/png',
     transparent: true,
 }).addTo(map);

 // Add WFS
 const palika = L.Geoserver.wfs("http://localhost:8080/geoserver/Nepal/wfs", {
     layers: 'Nepal:Palika',
     style: {
         color: "black",
         fillOpacity: "0",
         opacity: "0.1",
     },
     onEachFeature: function (feature, layer) {
         layer.bindPopup(feature.properties.Address);
     },
 }).addTo(map);

 // Customized Icon for Hospitals
 const hospitalIcon = L.icon({
     iconUrl: 'images/hospitalLogo.jpg',
     iconSize: [20, 20] // Adjust according to the actual size of the image
 });

 // Create an array to hold hospital markers
 const hospitalMarkers = [];

 // Loop through the hospital GeoJSON data to create markers with custom icons
 dataview.features.forEach(function (feature) {
     const marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
         icon: hospitalIcon
     });
     hospitalMarkers.push(marker);
 });

 // Create MarkerClusterGroup and add the hospital markers to it
 const hospitalMarkerCluster = L.markerClusterGroup().addLayers(hospitalMarkers);


 // Add the MarkerClusterGroup to the map
 hospitalMarkerCluster.addTo(map);



 // Customized Icons
 const airportIcon = L.icon({
     iconUrl: 'images/atmlogo.jpg',
     iconSize: [20, 20], // Adjust according to the actual size of the image
 });

 // Create an array to hold airport markers
 const airportMarkers = [];

 // Loop through the airport GeoJSON data to get centroid and add markers with custom icons
 atm.features.forEach(function (feature) {
     const centroid = turf.centroid(feature);
     const airportMarker = L.marker([centroid.geometry.coordinates[1], centroid.geometry.coordinates[0]], {
         icon: airportIcon
     });

     // Calculate the area of the airport feature
     const area = turf.area(feature);

     // Bind a popup to the marker displaying the area
     airportMarker.bindPopup(`Area: ${area.toFixed(2)} square meters`);

     // Push the marker to the array
     airportMarkers.push(airportMarker);
 });

 // Create MarkerClusterGroup and add the airport markers to it
 const airportMarkerCluster = L.markerClusterGroup().addLayers(airportMarkers);

 // Add the MarkerClusterGroup to the map
 airportMarkerCluster.addTo(map);

 // Layer control
 const baseMaps = {
     "Google Hybrid": googleHybrid,
     "OpenStreetMap": osm,
     "Topo Map":OpenTopoMap 
 };

 const overlayMaps = {
     'Province': province,
     'District': district,
     'Palika': palika,
     'ATM': airportMarkerCluster,
     'Hospital': hospitalMarkerCluster,
     
 };

 const layerControl = L.control.layers(baseMaps, overlayMaps, { collapsed: true }).addTo(map);

 // Custom control for legend
 const legendControl = L.control({ position: 'bottomright' });

 legendControl.onAdd = function (map) {
     const div = L.DomUtil.create('div', 'legend');
     div.innerHTML += '<div class="legend-title">Legend</div>';
     // Resize the icons by specifying width and height in pixels
     div.innerHTML += '<div class="legend-item"><img src="images/hospitalLogo.jpg" class="legend-icon" style="width: 20px; height: 20px;"> Hospital</div>';
     
     div.innerHTML += '<div class="legend-item"><img src="images/atmlogo.jpg" class="legend-icon" style="width: 20px; height: 20px;"> ATM</div>';
     return div;
 };
 
 
 legendControl.addTo(map);
// mouse coordinate
map.on('mousemove',function(e){
 $('.map-coordinate').html(`lat:${e.latlng.lat}, Lng:${e.latlng.lng}`)
})
// print
// Print Option script
L.control.browserPrint({
         title: "Print current Layer",
         documentTitle: "Map",
         printModes: [
             L.control.browserPrint.mode.landscape("Tabloid VIEW", "Tabloid"),
             L.control.browserPrint.mode.landscape(),
             "PORTrait",
             L.control.browserPrint.mode.auto("Auto", "B4"),
             L.control.browserPrint.mode.custom("Selected area", "B5"),
         ],
         manualMode: !1,
         closePopupsOnPrint: !0,
     }).addTo(map);

// scale 
L.control.scale({
 position: 'bottomleft'
}).addTo(map)
// measure
// Adding Measure Tool
// Adding Measure Tool
var measureControl = new L.Control.Measure({
    primaryLengthUnit: 'kilometers',
    secondaryLengthUnit: 'miles',
    primaryAreaUnit: 'sqmeters',
    secondaryAreaUnit: 'acres',
    activeColor: "#ed3833",
    completedColor: "#63aabc"
});
measureControl.addTo(map);
    //  geocoder
var osmGeocoder = new L.Control.OSMGeocoder({
        collapsed: false,
        text: 'Find!',
    
    });
    osmGeocoder.addTo(map);
    