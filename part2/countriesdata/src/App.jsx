import { useCallback, useState } from "react";
import "./index.css";
import ListCountries from "./components/ListCountries";
import useCountries from "./hooks/useCountries";
import debounce from "just-debounce-it";

function App() {
  const [search, setSearch] = useState("");
  const { countries, fetchCountries, infoMessage, loading } = useCountries({
    search,
  });

  const debouncedFetchCountries = useCallback(
    debounce((search) => {
      fetchCountries({search});
    }, 250),
    []
  );
  const handleSubmit = (event) => {
    event.preventDefault();
    const { query } = Object.fromEntries(new FormData(event.target));
    fetchCountries(query);
  };
  
  const handleChange = (ev) => {
    setSearch(ev.target.value);
    debouncedFetchCountries(ev.target.value);
  };


  console.log("countries", countries);

  return (
    <div className="main">
      <header>
        <h1>Countries Search</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            name="query"
            placeholder="Finland, Ecuador, France.."
            value={search}
            onChange={handleChange}
          />
          <button type="submit">Search</button>
        </form>
      </header>
      <main>
        {loading ? (
          <p>Loading data..</p>
        ) : (
          <>
            <ListCountries countries={countries} />
            <p>{infoMessage}</p>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
