const getConfig = () => {
    return fetch('./config.json')
        .then(response => response.json())
        .then(data => {
            return data;
        });
}

const addGMapsScript = () => {
    var script = document.createElement("script");
    script.src =
        "https://maps.googleapis.com/maps/api/js?" +
        "libraries=geometry&" +
        `key=${window.config.apiKey}&` +
        "callback=initMap";
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
}

let leavingCardEl, spinnerEl, orderCardEl, directionsCardEl, mapEl;
let name;

const initUI = () => {
    leavingCardEl = document.getElementById("leaving-card");
    leavingCardEl.style.display = "none";

    spinnerEl = document.getElementById("spinner");
    spinnerEl.style.display = "none";

    orderCardEl = document.getElementById("order-card");

    directionsCardEl = document.getElementById("directions-card");
    directionsCardEl.style.display = "none";

    mapEl = document.getElementById("map");
    mapEl.style.display = "none";

    document.getElementById("login-name").innerText = name;
}

const placeOrder = () => {
    orderCardEl.style.display = "none";
    spinnerEl.style.display = "block";
    setTimeout(() => {
        leavingCardEl.style.display = "block";
        spinnerEl.style.display = "none";
    }, 3000);
};

const leavingNow = () => {
    leavingCardEl.style.display = "none";
    document.getElementById("spinner-msg").innerText =
        "Calculating directions to Carmelit store.";
    spinnerEl.style.display = "block";
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            directionsCardEl.style.display = "block";
            mapEl.style.display = "block";
            driveRoute(pos);
        },
        (err) => {
            console.warn("Denied geolocation.");
        }
    );
};

const driveRoute = pos => {
    // throw away geolocator-derived pos, use fake pos for demo
    const randomSpreadExtent = 0.05; // distance in degrees
    pos = new google.maps.LatLng(
        chance.latitude({
            min: store.lat() - randomSpreadExtent,
            max: store.lat() + randomSpreadExtent,
        }),
        chance.longitude({
            min: store.lng() - randomSpreadExtent,
            max: store.lng() + randomSpreadExtent,
        })
    );
    var request = {
        origin: pos,
        destination: store,
        travelMode: "DRIVING",
    };
    directionsService.route(request, function (result, status) {
        spinnerEl.style.display = "none";
        if (status == "OK") {
            const origin = `${pos.lat()},${pos.lng()}`;
            console.log('origin', origin);
            const destination = `${store.lat()},${store.lng()}`;
            console.log('destination', destination);
            const gmapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
            document.getElementById("get-directions-link").href = gmapsDirectionsUrl;

            directionsRenderer.setDirections(result);
            const coordPairs = polylinesToCoordPairs(result);
            playRoute(coordPairs);
        }
    });
};

const polylinesToCoordPairs = directionsResult => {
    const legs = directionsResult.routes[0].legs;
    const path = legs.flatMap(leg => {
        return leg.steps.map(step => {
            return step.polyline.points;
        });
    });
    const coordPairs = path.flatMap(segment => {
        const points = google.maps.geometry.encoding.decodePath(segment);
        return points.map(pt => {
            return [pt.lat(), pt.lng()]
        });
    });
    return coordPairs;
}

const playRoute = async coordPairs => {
    const skipVertices = 2;
    const interval = 1;

    let counter = 0;
    const timer = setInterval(async () => {
        const evt = {
            orderId: name,
            eventLocation: {
                latitude: coordPairs[counter][0],
                longitude: coordPairs[counter][1]
            },
            eventTimestamp: parseInt(Date.now() / 1000),
            storeName: 'Carmelit'
        };

        await postEvent(`https://${window.config.geoawarenessRestApi}/events?key=${window.config.apiKey}`, evt).then(data => { });

        counter += skipVertices;
        if (counter === coordPairs.length) {
            clearInterval(timer);
        }
    }, interval * 1000);
}

const postEvent = async (url = '', data = {}) => {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response;
}

getConfig().then(config => {
    window.config = config;
    addGMapsScript();
    name = window.config.customerName || chance.first();
    initUI();
});