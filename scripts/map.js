const MAP_IDS = {
    CONTACTS: "ymap-contacts"
};

ymaps.ready(function () {
    var $map = $("#" + MAP_IDS.CONTACTS);

    var cx = Number($map.data("cx")),
        cy = Number($map.data("cy")),
        caption = $map.data("caption"),
        zoom = Number($map.data("zoom"));

    var myMap = new ymaps.Map(MAP_IDS.CONTACTS, {
        center: [cx, cy],
        zoom: zoom,
        controls: []
    });

    myMap.behaviors.disable('scrollZoom');

    myMap.geoObjects.add(new ymaps.Placemark([cx, cy], {
        balloonContent: '<strong>crocodile\'s nose</strong> color',
        iconCaption: caption
    }, {
        preset: 'islands#redDotIconWithCaption'
    }));

    // var myGeoObject = new ymaps.GeoObject({
    //     geometry: {
    //         type: "Point",
    //         coordinates: [cx, cy]
    //     },
    //     // Properties.
    //     properties: {
    //         // The placemark content.
    //         iconContent: 'I\'m draggable',
    //         hintContent: 'Come on, drag already!'
    //     }
    // }, {
    //     /**
    //      * Options.
    //      * The placemark's icon will stretch to fit its contents.
    //      */
    //     preset: 'islands#blackStretchyIcon',
    //     // The placemark can be dragged.
    //     draggable: false
    // });

    myMap.geoObjects.add(myGeoObject);
});
