import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

// apis 
// https://openweathermap.org/current#min
// https://www.exchangerate-api.com/docs/free

const {
  VITE_API_COUNTRIES,
  VITE_API_OPEN_WEATHER,
  VITE_API_KEY_OPEN_WEATHER,
  VITE_API_ICON_OPEN_WEATHER,
} = import.meta.env;

function App() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [message, setMessage] = useState(null);
  const [image, setImage] = useState("");

  const fetchCountries = () => {
    const resCountries = ({ data }) => {
      if (data.length > 10) {
        setMessage("Too many matches, especify another filter");
        setCountries([]);
      }
      if (data.length <= 10 && data.length > 1) {
        setCountries(data);
        setMessage(null);
      }

      if (data.length === 1) {
      setMessage(null);
        const { latlng } = data[0];
        axios
          .get(
            `${VITE_API_OPEN_WEATHER}?lat=${latlng[0]}&lon=${latlng[1]}&appid=${VITE_API_KEY_OPEN_WEATHER}&units=metric`
          )
          .then((weather) => {
            setCountries([{ ...data[0], infoWeather: weather.data }]);
            // put imageof open weather
            setImage(`VITE_API_ICON_OPEN_WEATHER${weather.data.weather[0].icon}.png`)
          });
        return;
      } 
    };

    if (search) {
      axios.get(`${VITE_API_COUNTRIES}${search}`).then(resCountries);
    }
  };

  const fetchWeatherIcon = () => {
    if (countries.length === 1) {
      console.log(countries[0].infoWeather.weather[0].icon);
      const { icon } = countries[0].infoWeather.weather[0];
      console.log(icon);
      const url1 = "10d.png";

      const url2 = `${VITE_API_ICON_OPEN_WEATHER}${icon}@2x.png`;

      axios
        .get(url1)
        .then(async (resp) => {
          console.log("icon", resp.data);
          const iconblob = resp.data.blob();
          const imageObjectURL = URL.createObjectURL(iconblob);
          setImage(resp.data);
          return imageObjectURL;
        })
        .then((otherres) => console.log(otherres));
    }
  };

  useEffect(fetchCountries, [search]);

  const handleChange = ({ target }) => {
    console.log(target.value);
    setSearch(target.value);
  };

  return (
    <div className="App">
      <p>
        find countries: <input value={search} onChange={handleChange} />
        <p>{message}</p>
      </p>
      {countries.length === 1
        ? countries.map((country) => (
            <div key={country.name.official}>
              <h1>{country.name.common}</h1>
              <p>capital {country.capital}</p>
              <p>area {country.area}</p>
              <h4>languages:</h4>
              <ul>
                {Object.values(country.languages).map((lan) => (
                  <li key={lan}>{lan}</li>
                ))}
              </ul>
              <img src={country.flags.png} alt={country.capital} />
              <h3>Wheather in {country.capital}</h3>
              <p>temperature {country.infoWeather.main.temp} Celcius</p>
              <img src={`https://openweathermap.org/img/wn/10d@2x.png`} alt={country.capital} />
              <p>wind {country.infoWeather.wind.speed} m/s</p>
            </div>
          ))
        : countries.map((country) => (
            <p key={country.name.official}>{country.name.official}</p>
          ))}
    </div>
  );
}

export default App;
