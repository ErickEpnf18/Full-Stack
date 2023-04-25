const ListCountries = ({ countries }) => {
  return (
    <>
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
              <p>temperature {country.weather.main.temp} Celcius</p>
              <img
                src={country.weather.icon}
                alt={country.capital}
              />
              <p>wind {country.weather.wind.speed} m/s</p>
            </div>
          ))
        : countries.map((country) => (
            <p key={country.name.official}>{country.name.official}</p>
          ))}
    </>
  );
};

export default ListCountries;
