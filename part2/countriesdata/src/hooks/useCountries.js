import { useCallback, useMemo, useRef, useState } from "react";
import { getCountries } from "../services/countries";

export default function useCountries({ search }) {
  const [countries, setCountries] = useState([]);
  const [infoMessage, setInfoMessage] = useState(null);
  const [loading, setLoading] = useState(null);
  const previousSearch = useRef(search);

  console.log(previousSearch);
  console.log(search);
  const fetchCountries = useMemo(() => {
    return async ({ search }) => {
      if (search === previousSearch.current) return;
      try {
        setLoading(true);
        previousSearch.current = search;
        const { msg, data } = await getCountries(search);
        setLoading(false);
        setInfoMessage(msg);
        setCountries(data);
      } catch (e) {
        setInfoMessage(e.message);
      } finally {
        setLoading(false);
      }
    };
  }, []);
  return { countries, fetchCountries, infoMessage, loading };
}
