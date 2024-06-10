

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});


console.log(coordinates)
console.log(Location)
const marker1 = new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${Location}</h4><p>Exact location will be provide after booking</p>`)
    )
    .addTo(map)
