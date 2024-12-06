import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const Details = () => {
  // Dichiarazioni STATE
  const location = useLocation();
  const weatherData = location.state.weatherData;
  const navigate = useNavigate();

  if (!weatherData) {
    return <div>No weather data available.</div>;
  }

  return (
    <div className="details-bg">
      <Container className="mt-5">
        <Row className="justify-content-center text-center mt-5">
          <Col md={6}>
            <h2 className="text-white mb-4">Weather Details for {weatherData.name}</h2>
            <Card className="weather-details-card text-white">
              <Card.Body>
                <Card.Title>{weatherData.name}</Card.Title>
                <Card.Text>
                  <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="weather icon" />
                  <br />
                  <strong>Temperature:</strong> {Math.round(weatherData.main.temp - 273.15)}°C
                  <br />
                  <strong>Weather:</strong> {weatherData.weather[0].description}
                  <br />
                  <strong>Humidity:</strong> {weatherData.main.humidity}%
                  <br />
                  <strong>Wind Speed:</strong> {weatherData.wind.speed} m/s
                </Card.Text>
                <Button variant="primary" className="mt-4" onClick={() => navigate("/")}>
                  Back to Home
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Details;
