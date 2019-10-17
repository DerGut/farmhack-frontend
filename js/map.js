var map = L.map('map').setView([52.5545,7.9015], 11);
var accessToken = 'pk.eyJ1IjoiZGVyZ3V0IiwiYSI6ImNpdG5lMmE1bDAwMzQzMm83NHFpaTdlaW8ifQ.hp122jysRM5Ic7TziyYFow';
var tileServerUrl = 'https://api.mapbox.com/styles/v1/dergut/ck1tif3rb64un1cn6s2gszr90/tiles/256/{z}/{x}/{y}?access_token=' + accessToken;
L.tileLayer(tileServerUrl, {
    id: 'mapbox.light'
}).addTo(map);

var xhttp = new XMLHttpRequest();
xhttp.onload = function() {
    var data = JSON.parse(this.responseText);

    function getColor(d) {
        return d > 14 ? '#800026' :
            d > 12  ? '#BD0026' :
                d > 10  ? '#E31A1C' :
                    d > 8  ? '#FC4E2A' :
                        d > 6   ? '#FD8D3C' :
                            d > 4   ? '#FEB24C' :
                                d > 2   ? '#FED976' :
                                    '#FFEDA0';
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.KULTURCODE),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    var geojson;

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    geojson = L.geoJson(data, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Kulturcode</h4>' +  (props ?
            '<b>' + props.FLIK + '</b><br />' + props.KULTURCODE : 'Hover over a Feld');
    };

    info.addTo(map);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 2, 4, 6, 8, 10, 12, 14],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);

};
xhttp.open("GET", "https://farmhack-os.s3.eu-central-1.amazonaws.com/data.geojson", true);
xhttp.send();
