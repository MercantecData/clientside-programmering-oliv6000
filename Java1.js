window.onload = ( () => {
    var cityNames = [];
    var api = "e96f0a76f2852500d6aad1e320b18194";
    
    document.getElementById('addCityNameToArray').addEventListener("submit", (e) => {
        e.preventDefault();
        cityToArray(cityNames);
        printCityFromName(cityNames);
    });;
    
    function removeCity (cityNames, cityForm) {
        var name = cityForm.elements["name"].value;

            var cityToRemove;
            for (let i = 0; i < cityNames.length; i++) {
                const element = cityNames[i];
                if (name = element) {
                    cityToRemove = element
                } 
            }
        delete cityNames[cityNames.indexOf(name)];
        printCityFromName(cityNames);
    };

    function FaultyCity (cityNames, cityName) {
        try {
            delete cityNames[cityNames.indexOf(cityName)];
        }
        catch(err) {
            alert(err);
        }
        if (cityNames.length < 0) {
            printCityFromName(cityNames);
        }
    };
    
    function cityToArray(cityNames) {
        var city = document.getElementById("CityName").value;
        if (city != "") {
            cityNames.push(city);
        }
    };
    
    function printCityFromName(cityNames) {
        var citiesContainer = document.getElementById("Cities");
        citiesContainer.innerHTML = "";
        cityNames.forEach(city => {
            var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}&units=metric`;
            var promise = fetch(url);
            var promise2 = promise.then(data=>data.json());
            promise2.then(data => getCityDays(data, citiesContainer));
        });
    };

    function getCityDays(cityData, citiesContainer) {
        var url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityData.name}&appid=${api}&units=metric`;
        var promise = fetch(url);
        var promise2 = promise.then(data=>data.json());
        promise2.then(data => printCities(cityData, data, citiesContainer));
    };
    
    function printCities (cityData, cityWeather, citiesContainer) {
        try {
        citiesContainer.innerHTML += 
            `
                <form id="removeCityForm">
                    <div class="City">
                        <div class="CityDays">
                            <button id="removeCityButton">x</button>
                            <input class="CityName" id="name" style="visibility: hidden;" value="${cityData.name}">
                            <h2 class="CityName" id="name">${cityData.name}</h2>
                            <h5 class="CityCord">coords: [lon: ${cityData.coord.lon}, lat: ${cityData.coord.lat}]</h5>
                            <div id="days" class="days">
                            </div>
                        </div>
                    </div>
                </form>
            `;

            document.getElementById('removeCityForm').addEventListener("submit", (e) => {
                e.preventDefault();
                var cityForm = e.target;
                removeCity(cityNames, cityForm);
            });;
        }
        catch(err) {
            FaultyCity(cityNames, cityData.name);
        }
        var CityWeatherContainer = document.getElementById("days");
        var i = 0;
        var ii = 0;
        var dates = [];
        var datesRegistered = [];
        var dateName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        cityWeather.list.forEach(element => {
            var date = new Date(Date.parse(cityWeather.list[i].dt_txt));
            var setDate = date.getDate();
            i ++;

            if (dates.includes(setDate) == false) {
                dates.push(setDate);
            };
        });
        console.log(cityWeather);
        cityWeather.list.forEach(city => {
            var date = new Date(Date.parse(cityWeather.list[ii].dt_txt));
            var setDate = date.getDate();
            ii ++;
            
            if (dates.includes(setDate) == true && datesRegistered.includes(setDate) == false) {
                datesRegistered.push(setDate);
                CityWeatherContainer.innerHTML += 
                `
                    <div id="dailyWeather">
                    <p class="CityTemp">Day: ${dateName[date.getDay()]}</p>
                    <p class="CityTemp">Temperature: ${city.main.temp}</p>
                    <p class="FeelsLike">Feels like: ${city.main.feels_like}</p>
                    </div>
                `;
            }
        });
    };
});