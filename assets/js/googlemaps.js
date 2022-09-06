function initMap() {
    "use strict";

    var location = {lat: 51.4378646, lng: 5.4810639};

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: location,
        disableDefaultUI: true,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'De Ballenbak'
    });
}
