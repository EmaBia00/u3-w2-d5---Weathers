import { useState } from "react";
import { Card, Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import WeathersWeek from "./WeathersWeek";

const Homepage = () => {
  // Dichiarazioni STATE
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!city) return;

    setLoading(true);
    setErrorMessage("");

    // API per ottenere latitudine e longitudine
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=b5f2ca6ae963061e9702a8d5d82f93da`)
      .then((response) => response.json())
      .then((geoData) => {
        if (geoData.length === 0) {
          setErrorMessage("City not found. Please check the name and try again.");
          setLoading(false);
          return;
        }

        // Destrutturo i dati e li salvo in modo da poterli riutilizzare come parametri nella chiamata API e nella chiamata del componente WeathersWeek
        const { lat, lon } = geoData[0];
        setLat(lat);
        setLon(lon);

        // API per ottenere i dettagli del meteo
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=b5f2ca6ae963061e9702a8d5d82f93da`)
          .then((response) => response.json())
          .then((weatherData) => {
            setWeatherData(weatherData);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching weather data", error);
            setErrorMessage("There was an error fetching weather data. Please try again.");
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error fetching geo data", error);
        setErrorMessage("There was an error fetching city data. Please try again.");
        setLoading(false);
      });
  };

  // CLICCANDO la card principale porta alla pagina Details
  const handleCardClick = () => {
    if (weatherData) {
      // Route per la navigazione verso la pagina Details passando i dati presi dalla seconda fetch
      navigate(`/details/${weatherData.name}`, { state: { weatherData } });
    }
  };

  const handleInputChange = (e) => {
    setCity(e.target.value);
    setErrorMessage("");
  };

  return (
    <div className="homepage-bg">
      <Container style={{ maxWidth: "2000px" }}>
        <Row className="justify-content-center text-center mt-5">
          <Col md={6}>
            <h1 className="text-white mb-4">Weather WebApp</h1>

            {/* Alert di errore che viene nascosto in pagina e visualizzato nel caso si verifica un errore */}
            {errorMessage && (
              <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
                {errorMessage}
              </Alert>
            )}

            <Form onSubmit={handleSearch} className="search-form d-flex gap-3">
              <Form.Control type="text" placeholder="Enter city name" value={city} onChange={handleInputChange} className="search-input" />
              <Button variant="primary" type="submit" className="mt-2 py-1 px-2 search-button" disabled={loading}>
                {loading ? (
                  "Loading..."
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg>
                )}
              </Button>
            </Form>
          </Col>
        </Row>

        {weatherData && (
          <Row className="justify-content-center mt-4">
            <Col md={6}>
              <Card className="weather-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
                <Card.Body>
                  <Card.Title className="text-center">{weatherData.name}</Card.Title>
                  <Card.Text className="text-center">
                    <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="weather icon" />
                    <br />
                    <strong>Temperature:</strong> {Math.round(weatherData.main.temp - 273.15)}°C
                    <br />
                    <strong>Weather:</strong> {weatherData.weather[0].description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {lat && lon && <WeathersWeek lat={lat} lon={lon} />}
      </Container>
    </div>
  );
};

export default Homepage;
