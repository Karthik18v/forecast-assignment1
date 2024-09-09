import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./index.css";

const CitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

  const limit = 20;

  const fetchCities = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=${limit}&offset=${offset}`
      );
      const data = await response.json();
      const result = data.results;
      console.log(result);

      if (result && result.length > 0) {
        setCities((prevCities) => [...prevCities, ...result]);
        setOffset((prevOffset) => prevOffset + limit);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
    setLoading(false);
  }, [offset, loading, hasMore]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !loading
    ) {
      fetchCities();
    }
  }, [loading, fetchCities]);

  useEffect(() => {
    fetchCities();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, fetchCities]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = cities.filter(
        (city) =>
          city.ascii_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          city.cou_name_en?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities);
    }
  }, [searchTerm, cities]);

  return (
    <div className="main">
      <h1>Weather ForeCast</h1>
      <input
        type="text"
        placeholder="Search cities..."
        value={searchTerm}
        onChange={handleSearch}
        style={{
          marginBottom: "20px",
          marginTop: "30px",
          padding: "10px",
          width: "50%",
          alignSelf: "center",
        }}
      />

      <table className="table-container">
        <thead>
          <tr>
            <th>City</th>
            <th>Country</th>
            <th>Population</th>
          </tr>
        </thead>
        <tbody>
          {filteredCities.map((city, index) => (
            <tr key={index}>
              <Link to={`/city/${city.ascii_name}`}>
                <td>{city.ascii_name}</td>
              </Link>
              <td>{city.cou_name_en}</td>
              <td>{city.population}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && <div>Loading more cities...</div>}
      {!hasMore && <div>No more cities to load</div>}
    </div>
  );
};

export default CitiesTable;
