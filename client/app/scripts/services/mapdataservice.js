'use strict';

/* Service will
 - use here given coordinate to center map
 - locations entered by the user to find coordinates and center map
 - filter activities in a radius of 30km around this central coordinates
 */
angular.module('anorakApp')
  .service('mapdataservice', function mapdataservice() {

    console.log("AM IN MAPDATA SERVICE");

    var google_api_key_for_localhost = "ABQIAAAAvZMU4-DFRYtw1UlTj_zc6hT2yXp_ZAY8_ufC3CFXhHIE1NvwkxQcT1h-VA8wQL5JBdsM5JWeJpukvw";

    /*
     * app.service('geocoder',function() {
     this.geocode=function(address, outerCallback) {
     var geocoder = new google.maps.Geocoder();
     geocoder.geocode( { 'address': address}, function(results, status) {
     console.log(results);
     if (status == google.maps.GeocoderStatus.OK) {
     outerCallback({success: true, err: null, results: results});
     } else {
     outerCallback({success:false, err: new Error('Geocode was not successful for the following reason: ' + status), results: null});
     }
     });
     };
     });*/

    var geocoder;
    var map;
    var standardCenter = {
      "longitude": 8.01177978515625,
      "latitude": 45.12199086176226
    };

    function geoCodeAddress() {
      console.log("INIT 1", new google.maps.Geocoder());
      geocoder = new google.maps.Geocoder();
      console.log("INIT 2");
      geocoder.geocode({ 'address': "Torino" }, function (results, status) {
        console.log("TORINO: ", results, status);

        if (status == google.maps.GeocoderStatus.OK) {
          console.log("results 0 geometry location", results[0].geometry.location);
          map.center.latitude = results[0].geometry.location.d;
          map.center.longitude = results[0].geometry.location.e;

        } else {
          console.log("Status not OK!, failing", status);
          map.center = standardCenter;
        }

      });

    };

    /*function codeAddress() {
     var address = document.getElementById("address").value;
     geocoder.geocode( { 'address': address}, function(results, status) {
     if (status == google.maps.GeocoderStatus.OK) {
     map.setCenter(results[0].geometry.location);
     var marker = new google.maps.Marker({
     map: map,
     position: results[0].geometry.location
     });
     } else {
     alert("Geocode was not successful for the following reason: " + status);
     }
     });
     }*/

//   <body onload="initialize()">
//   <div id="map-canvas" style="width: 320px; height: 480px;"></div>
//   <div>
//   <input id="address" type="textbox" value="Sydney, NSW">
//   <input type="button" value="Encode" onclick="codeAddress()">
//   </div>
//   </body>

    console.log("CALLING GEOCODER", geoCodeAddress());

    var map = {
      center: {
        "longitude": 8.01177978515625,
        "latitude": 45.12199086176226
      },
      zoom: 9,
      markericon: "/img/mapicons/marker-sports.svg",
      templatedInfoWindow: {
        coords: {
          latitude: 44.93077975622578,
          longitude: 7.998046875
        },
        options: {
          disableAutoPan: true
        },
        show: true,
        templateUrl: 'views/map/templatedinfowindow.html',
        templateParameter: {
          message: 'passed in from the opener'
        }
      }
      /*,

       events: {
       click: function (mapModel, eventName, originalEventArgs) {
       // 'this' is the directive's scope
       debug("user defined event: " + eventName, mapModel, originalEventArgs);

       var e = originalEventArgs[0];

       if (!$scope.map.clickedMarker) {
       $scope.map.clickedMarker = {
       title: 'You clicked here',
       latitude: e.latLng.lat(),
       longitude: e.latLng.lng()
       };
       }
       else {
       $scope.map.clickedMarker.latitude = e.latLng.lat();
       $scope.map.clickedMarker.longitude = e.latLng.lng();
       }

       $scope.$apply();
       }
       }*/
    };

    // TODO this controller gets a location entered by the user
    // pass this location to mapdataservice
    // connect mapdataservice to google to find lat and lon for this location
    // set map center in mapdataservice
    // now display the newly centered map
    // fil

    return map;
  });

//src="https://maps.googleapis.com/maps/api/js?key=API_KEY&sensor=SET_TO_TRUE_OR_FALSE">
