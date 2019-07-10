const MAP_IDS = {
    CONTACTS: "ymap-contacts"
};

ymaps.ready(function () {
    var myMap = new ymaps.Map(MAP_IDS.CONTACTS, {
      center: [55.76, 37.64],
      zoom: 10
    });
});
