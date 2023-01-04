/* eslint-disable */
export const displayMap = (locations) => {
  var myPoints = [];

  const myMap = L.map('map', { zoomControl: false });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    crossOrigin: '',
  }).addTo(myMap);

  locations.forEach((loc) => {
    const cor = [loc.coordinates[1], loc.coordinates[0]];
    myPoints.push([loc.coordinates[1], loc.coordinates[0]]);

    var newPopup = L.popup({
      closeOnClick: false,
      autoClose: false,
    }).setContent(`<p>Day ${loc.day}: ${loc.description}</p>`);

    L.marker(cor).addTo(myMap).bindPopup(newPopup).openPopup();
  });

  var bounds = L.latLngBounds(myPoints).pad(0.5);
  myMap.fitBounds(bounds);

  myMap.scrollWheelZoom.disable();
};
