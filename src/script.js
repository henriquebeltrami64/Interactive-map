let map;
let geocoder;
let isSidebarOpen = false;
let mapInitialized = false;
function initializeMap() {
    if (!mapInitialized) {
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: 0, lng: 0 },
            zoom: 3,
            restriction: {
                latLngBounds: {
                    north: 85,
                    south: -85, 
                    west: -180,
                    east: 180,
                },
                strictBounds: true,
            },
        });
        map.data.loadGeoJson('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json');
        map.data.setStyle({
            fillColor: 'transparent',
            strokeColor: 'transparent',
            strokeWeight: 0
        });
        map.data.addListener('click', function(event) {
            let latlng = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
            let countrie = "Undefined";
            let state = "Undefined";
            new google.maps.Geocoder().geocode({'latLng' : latlng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        for (var r = 0, rl = results.length; r < rl; r += 1) {
                            var result = results[r];
                            console.log(result.address_components[0]);
                            if(result.address_components[0].types[0] === "administrative_area_level_1")
                                state = result.address_components[0].long_name;
                            if(result.address_components[0].types[0] === "country")
                                countrie = result.address_components[0].long_name;
                        }
                    }
                }
                searchAndShowCountryInfo(countrie);            
            }); 
        });
        mapInitialized = true;
    }
}
function toggleOverlay(open = true) {
    const overlay = document.getElementById("overlay");
    if (open) {
        overlay.style.display = "block";
    } else {
        overlay.style.display = "none";
    }
}
function closeOverlay() {
    toggleOverlay(false);
}
function initMap() {
    google.maps.event.addDomListener(window, 'load', initializeMap);
    
    geocoder = new google.maps.Geocoder();
}
const subregionImages = {
    "South America": "/img/rio.jpg",
    "North America":"/img/canada.jpg",
    "Caribbean":"/img/bahamas.jpg",
    "Central America":"/img/costarica.jpg",

    "Central Europe": "/img/poland.jpg", 
    "Eastern Europe":"/img/russia.jpg", 
    "Northern Europe":"/img/dinamarca.jpg", 
    "Southeast Europe":"/img/macedonia.jpg",  
    "Southern Europe":"/img/portugal.jpg", 
    "Western Europe":"/img/franca.jpg", 

    "Southern Africa":"/img/southafrica.jpg", 
    "Middle Africa":"/img/southsuda.jpg",
    "Northern Africa":"/img/egito.jpg", 
    "Western Africa":"/img/nigeria.jpg",
    "Eastern Africa":"/img/etiopia.jpg", 
     
    "South-Eastern Asia":"/img/el-nido-philippines.jpg", 
    "Eastern Asia":"/img/asia.jpg", 
    "Central Asia":"/img/kazakhstan.jpg", 
    "Southern Asia":"/img/bangladesh.jpg", 
    "Western Asia":"/img/turquia.jpg",
    
    "Australia and New Zealand":"/img/australia.jpg",
    "Polynesia":"/img/polinesia.jpg",
    "Micronesia":"/img/micronesia.jpg",
    "Melanesia":"/img/papua.jpg",  
};
function showCountryInfo(country) {
    const commonName = country.name.common;
    const capital = country.capital;
    const population = country.population.toLocaleString();
    const languages = Object.values(country.languages).join(", ");
    const flagUrl = country.flags.png;
    const currencies = Object.values(country.currencies).map(currency => currency.name).join(", ");
    const continents = country.subregion;
    const infoHTML = `
        <h1 class="text-center">${commonName}</h2>
        <div class="my-5 d-flex justify-content-center">
            <img  src="${flagUrl}" alt="flag of ${commonName}" width="100">
        </div>
            <h2>Capital: ${capital}</h2>
        <h2>Population: ${population} people</h2>
        <h2>Language(s): ${languages}</h2>
        <h2>Currency: ${currencies}</h2>
        <h2>Continent: ${continents}</h2>
        ${subregionImages[continents] ? `<img class= "countryimg" src="${subregionImages[continents]}" alt="${continents} Image">` : ''}
    `;
    document.getElementById("countryInfo").innerHTML = infoHTML;
    if (!isSidebarOpen) {
        toggleOverlay(true);
        isSidebarOpen = true;
    }
}
function searchAndShowCountryInfo(countryName) {
    geocoder.geocode({ address: countryName }, function(results, status) {
        const errorMessageElement = document.getElementById("errorMessage");
        const countryInfoElement = document.getElementById("countryInfo");
        errorMessageElement.textContent = "";
        countryInfoElement.innerHTML = "";
        if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;
            map.setCenter(location); 
            map.setZoom(5);
            fetch(`https://restcountries.com/v3.1/name/${countryName}?lang=pt`)
                .then(response => response.json())
                .then(data => {
                    showCountryInfo(data[0]);
                    toggleOverlay();
                })
                .catch(error => {
                    errorMessageElement.textContent = "Erro ao obter informações do país.";
                    console.error("Erro ao obter informações do país:", error);
                });
        }  else {
            errorMessageElement.textContent = "Não foi possível encontrar o país.";
            console.error("Não foi possível encontrar o país:", status);
            toggleOverlay(true);
        }
    });
}
document.addEventListener("DOMContentLoaded", function() {
    const closeButton = document.querySelector(".close");
    if (closeButton) {
        closeButton.addEventListener("click", closeOverlay);
    }
});
function searchCountry() {
    const countryName = document.querySelector(".countryInput").value;
    searchAndShowCountryInfo(countryName);
}
