import "./styles/variables.css";
import "./styles/globals.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cards from "./pages/Cards";
function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/card" element={<Cards />} />
        <Route path="*" element={<h1 style={
          {color: "red", fontSize: "2rem", textAlign: "center", marginTop: "10rem", marginBottom: "10rem", fontFamily: "Arial, sans-serif", backgroundColor: "antiquewhite", padding: "1rem", borderRadius: "0.5rem", border: "1px solid black", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", transform: "translateY(-50%)", transition: "all 0.3s ease-in-out", opacity: "0.9"}
        } >404 Not Found</h1>} />
      </Routes>
    //page not found 
  );
}

export default App;
