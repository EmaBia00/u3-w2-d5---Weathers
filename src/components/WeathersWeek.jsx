import { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";

const WeathersWeek = ({ lat, lon }) => {
  // Dichiarazioni STATE
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // componentDidUpdate usando useEffect (Hooks)
  useEffect(() => {
    if (!lat || !lon) return;

    setLoading(true);
    setErrorMessage("");

    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=b5f2ca6ae963061e9702a8d5d82f93da`)
      .then((response) => response.json())
      .then((data) => {
        setForecastData(data.list.slice(0, 5)); //Per adesso ne ho gestiti solamente 5, l'idea era di fare un carosello slick da implementare
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching forecast data", error);
        setErrorMessage("There was an error fetching forecast data. Please try again.");
        setLoading(false);
      });
  }, [lat, lon]);

  if (loading) return <div>Loading...</div>;
  if (errorMessage) return <div>{errorMessage}</div>;

  // Ho provato a usare il Date per poter recuperare il giorno della settimana
  const getDayOfWeek = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { weekday: "long" }; //imposto il fornato da visualizzare per il giorno "long","short" o "narrow"
    return date.toLocaleDateString("en-US", options);
  };

  // Ho provato a usare il Date per poter avere un formato orario diviso in Ore e Minuti
  const getTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  // Ho provato a convertire da kelvin a Celsius per avere i gradi corretti
  const kelvinToCelsius = (kelvin) => Math.round(kelvin - 273.15);

  return (
    <div className="weather-week">
      <Row className="justify-content-center mt-4">
        {forecastData.map((item, index) => (
          // ho provato ad usare item.weather[0].id per assegnare un id al posto di usare index, ma ho notato che nell'API erano presenti id uguali per giorni diversi
          <Col key={index} xs={12} md={6} lg={4} xl={2} className="mb-4">
            <Card className="weather-card">
              <Card.Body>
                <Card.Title className="text-center">{getDayOfWeek(item.dt)}</Card.Title>
                <Card.Subtitle className="text-center mb-2 text-warning">{getTime(item.dt)}</Card.Subtitle>
                <div className="text-center">
                  <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt="weather icon" />
                </div>
                <Card.Text className="text-center">
                  <strong>Temperature:</strong> {kelvinToCelsius(item.main.temp)}°C
                  <br />
                  <strong>Weather:</strong> {item.weather[0].description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default WeathersWeek;
