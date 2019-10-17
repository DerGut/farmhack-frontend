var map = L.map('map').setView([52.5545,7.9015], 13);
var accessToken = 'pk.eyJ1IjoiZGVyZ3V0IiwiYSI6ImNpdG5lMmE1bDAwMzQzMm83NHFpaTdlaW8ifQ.hp122jysRM5Ic7TziyYFow';
var tileServerUrl = 'https://api.mapbox.com/styles/v1/dergut/ck1tif3rb64un1cn6s2gszr90/tiles/256/{z}/{x}/{y}?access_token=' + accessToken;
L.tileLayer(tileServerUrl, {
    id: 'mapbox.light'
}).addTo(map);

var xhttp = new XMLHttpRequest();
xhttp.onload = function() {
    var data = JSON.parse(this.responseText);

    function getColor(d) {
        return d > 6 ? '#800026' :
            d > 5  ? '#BD0026' :
                d > 4  ? '#E31A1C' :
                    d > 3  ? '#FC4E2A' :
                        d > 2   ? '#FD8D3C' :
                            d > 1   ? '#FEB24C' :
                                d > 0   ? '#FED976' :
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

    var cultures = {
        0: "Winterhartweizen",
        1: "Sommerhartweizen",
        2: "Winterroggen",
        3: "Winterroggen",
        4: "Sommerroggen",
        5: "Wintergerste",
        6: "Sommergerste",
        7: "Winterhafer",
        8: "Sommerhafer",
        9: "Wintertriticale",
        10: "Sommertriticale",
        11: "Körnermais",
        12: "Rispenhirse",
        13: "Buchweizen",
        14: "Amarant",
        // 15:
        // 16: ""
        // 17
        18: "Erbsen",
        19: "Ackerbohnen",
        20: "Lupinen",
        // 21:
        22: "Linsen",
        // 23:
        // 24:
        25: "Winterraps",
        26: "Sommerraps",
        27: "Winterrübsen",
        28: "Winterrübsen",
        29: "Sonnenblumen",

    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Kultur</h4>' +  (props ?
            '<b>' + cultures[props.KULTURCODE] + '</b>' : 'Hover über a Feld');
    };

    info.addTo(map);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5, 6, 7, 8];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += '<i style="background:' + getColor(i) + '"></i> ' + cultures[i] + '<br>' ;
        }

        return div;
    };

    legend.addTo(map);

};
xhttp.open("GET", "https://farmhack-os.s3.eu-central-1.amazonaws.com/data.geojson", true);
xhttp.send();
