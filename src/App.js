import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import CitiesTable from "./components/CitiesTable";
import CityDetails from "./components/CityDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CitiesTable />} />
        <Route path="/city/:cityName" element={<CityDetails/>}/>
  
      </Routes>
    </Router>
  );
}

export default App;
