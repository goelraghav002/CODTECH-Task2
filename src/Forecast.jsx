import { useEffect, useState } from "react";
import { formatDate } from "./utils";
import { BeatLoader } from "react-spinners";

const Forecast = ({ location }) => {

  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleForecast = () => {
    setLoading(true);
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=e26e85517ccb447c9c2162926221706&q=${location}&days=3&aqi=yes&alerts=no
`)
      .then(response => response.json())
      .then(data => {
        setForecast(data.forecast.forecastday);
        setLoading(false);
      })
      .catch(error => console.log(error))

  }


  useEffect(() => {
    handleForecast();

  }, [location]);


  return <div>

    <h3 className="text-center text-2xl font font-extrabold m-4 my-8">3 Days Forecast</h3>
    <div className="flex justify-around flex-col sm:flex-row items-center pb-10">

      {!loading ? forecast && forecast.map((day, index) => (
        <div key={index} className="flex m-2 bg-white bg-opacity-5 p-5 rounded-xl items-center w-full h-36 justify-between px-8">

          <div className="font-bold">
            <h2 className="text-sm">{formatDate(day.date)}</h2>
            <p className="text-2xl">{day.day.condition.text}</p>
            <p className="text-sm">{day.day.mintemp_c}°C - {day.day.maxtemp_c}°C</p>
          </div>

          <div>
            <img src={day.day.condition.icon} alt="weather icon" />
          </div>



        </div>
      )) : 
        <BeatLoader size={10} color="white" />
      }

    </div>
  </div>;
};

export default Forecast;
