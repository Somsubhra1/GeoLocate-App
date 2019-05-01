//Grabbing DOM elements:
const locationForm_form = document.getElementById("location-form");
const locationInput_input = document.getElementById("location-input");
const formattedAddress_div = document.getElementById("formatted-address");
const addressComponents_div = document.getElementById("address-components");
const geometry_div = document.getElementById("geometry");
const mapImg_div = document.getElementById("map-image");

// adding eventlisteners
locationForm_form.addEventListener("submit", geoCode);

function geoCode(event) {
    // prevent default form submission
    event.preventDefault();

    // setting zoom value for map
    var zoom = "5";

    // getting user input
    var location = locationInput_input.value;

    // if (location.includes('road')) {
    //     zoom = '14';
    // }
    axios
        .get("https://us1.locationiq.com/v1/search.php?", {
            params: {
                key: "90e5c08064449e",
                q: location,
                format: "json"
            }
        })
        .then(function(response) {
            // logging response
            console.log(response);

            var formattedAddress = response.data[0].display_name;
            var lat = response.data[0].lat;
            var lng = response.data[0].lon;

            // format response
            var formattedAddressOutput = `
                <ul class="list-group mt-4">
                    <li class="list-group-item">${formattedAddress}</li>
                </ul>`;

            // address components
            var addressComponents = response.data[0];

            if (addressComponents["osm_type"] === "way") {
                zoom = "14";
            }
            var addressComponentsOutput = `<ul class="list-group">`;

            addressComponentsOutput += `
                    <li class="list-group-item"><strong>bounding box</strong>: ${
                        addressComponents["boundingbox"]
                    }</li>`;
            addressComponentsOutput += `
                    <li class="list-group-item"><strong>Class</strong>: ${
                        addressComponents["class"]
                    }</li>`;
            addressComponentsOutput += `
                    <li class="list-group-item"><strong>Type</strong>: ${
                        addressComponents["type"]
                    }</li>`;
            addressComponentsOutput += `
                    <li class="list-group-item"><strong>Open Street Map (OSM) type</strong>: ${
                        addressComponents["osm_type"]
                    }</li>`;

            // getting nearby places
            axios
                .get("https://us1.locationiq.com/v1/nearby.php", {
                    params: {
                        key: "90e5c08064449e",
                        lat: lat,
                        lon: lng,
                        tag: "restaurant",
                        format: "json"
                    }
                })
                .then(function(res) {
                    var nearby = "";
                    for (let index = 0; index < 5; index++) {
                        nearby += res.data[index].name + ", ";
                    }
                    console.log(addressComponentsOutput);

                    addressComponentsOutput += `
                    <li class="list-group-item"><strong>Nearby restaurants</strong>: ${nearby}</li>`;
                    addressComponentsOutput += `</ul>`;
                    addressComponents_div.innerHTML = addressComponentsOutput;
                })
                .catch(function(err) {
                    addressComponentsOutput += `</ul>`;
                    addressComponents_div.innerHTML = addressComponentsOutput;
                });

            // geometry
            var geometryOutput = `
                <ul class="list-group">
                    <li class="list-group-item"><strong>Latitude</strong>: ${lat}</li>
                    <li class="list-group-item"><strong>Longitude</strong>: ${lng}</li>
                </ul>`;

            // Display map
            var mapImg = `
            <h2 class="mt-4 mb-5">Map:</h2>
            <img src="https://maps.locationiq.com/v2/staticmap?key=90e5c08064449e&center=${lat},${lng}&zoom=${zoom}&markers=icon:small-red-cutout|${lat},${lng}" alt="${formattedAddress}" style="display: block; margin: 0 auto; width: 50%; border: 2px solid #000; padding: 10px" class="rounded">`;

            // output to app
            formattedAddress_div.innerHTML = formattedAddressOutput;
            addressComponents_div.innerHTML = addressComponentsOutput;
            geometry_div.innerHTML = geometryOutput;
            mapImg_div.innerHTML = mapImg;
        })
        .catch(function(error) {
            console.log(error);
            formattedAddress_div.innerText =
                "Some error occurred.. Please try again later... :(";
        });
}
