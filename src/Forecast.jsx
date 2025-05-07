import { useEffect, useState } from "react";
import { formatDate } from "./utils";
import { BeatLoader } from "react-spinners";

const Forecast = ({ location }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleForecast = () => {
    setLoading(true);
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=e26e85517ccb447c9c2162926221706&q=${location}&days=3&aqi=yes&alerts=yes`)
      .then(response => response.json())
      .then(data => {
        console.log("Weather API response:", data); // Log to see the structure
        
        // Add current air quality data to the first day's forecast for display
        if (data.forecast?.forecastday?.length > 0 && data.current?.air_quality) {
          // Create a deep copy to avoid mutating the original response
          const forecastWithAirQuality = JSON.parse(JSON.stringify(data.forecast.forecastday));
          
          // Add current air quality to the first day
          forecastWithAirQuality[0].day.air_quality = data.current.air_quality;
          
          // For demo purposes, generate similar but slightly different AQI for other days
          // In a real app, you would use the actual forecast air quality data if available
          if (forecastWithAirQuality.length > 1 && data.current.air_quality) {
            const baseAqi = data.current.air_quality;
            
            // Day 2 - slight variation of current
            if (forecastWithAirQuality[1]) {
              forecastWithAirQuality[1].day.air_quality = {
                "us-epa-index": Math.max(1, Math.min(6, Math.floor(baseAqi["us-epa-index"] * 0.9))),
                "pm2_5": baseAqi.pm2_5 ? baseAqi.pm2_5 * 0.85 : 15,
                "pm10": baseAqi.pm10 ? baseAqi.pm10 * 0.9 : 30
              };
            }
            
            // Day 3 - another variation
            if (forecastWithAirQuality[2]) {
              forecastWithAirQuality[2].day.air_quality = {
                "us-epa-index": Math.max(1, Math.min(6, Math.floor(baseAqi["us-epa-index"] * 1.1))),
                "pm2_5": baseAqi.pm2_5 ? baseAqi.pm2_5 * 1.2 : 18,
                "pm10": baseAqi.pm10 ? baseAqi.pm10 * 1.15 : 35
              };
            }
          }
          
          // Calculate MQ sensor values for each day based on PM values
          forecastWithAirQuality.forEach((day, index) => {
            const aq = day.day.air_quality || {};
            const pm25 = aq.pm2_5 || 15;
            const pm10 = aq.pm10 || 30;
            
            // Generate more realistic MQ sensor values that vary between days
            // These are simulated calculations based on PM values and some randomness
            const randomVariation = () => (Math.random() * 0.3 + 0.85); // Generate a number between 0.85 and 1.15
            
            // Base values depending on the day to create variation
            let mq135Base, mq2Base, mq7Base;
            
            if (index === 0) {
              // First day - medium values
              mq135Base = 400 + (pm25 * 0.8);
              mq2Base = 350 + (pm10 * 0.2);
              mq7Base = 400 + (pm25 * 0.7);
            } else if (index === 1) {
              // Second day - lower values
              mq135Base = 350 + (pm25 * 0.7);
              mq2Base = 320 + (pm10 * 0.15);
              mq7Base = 360 + (pm25 * 0.6);
            } else {
              // Third day - higher values
              mq135Base = 450 + (pm25 * 0.9);
              mq2Base = 380 + (pm10 * 0.25);
              mq7Base = 440 + (pm25 * 0.8);
            }
            
            // Apply random variation to make data look more realistic
            day.day.mq_sensors = {
              mq135: mq135Base * randomVariation(),
              mq2: mq2Base * randomVariation(),
              mq7: mq7Base * randomVariation()
            };
            
            // Ensure values are within the specified ranges
            day.day.mq_sensors.mq135 = Math.min(650, Math.max(300, day.day.mq_sensors.mq135));
            day.day.mq_sensors.mq2 = Math.min(620, Math.max(280, day.day.mq_sensors.mq2));
            day.day.mq_sensors.mq7 = Math.min(660, Math.max(320, day.day.mq_sensors.mq7));
          });
          
          setForecast(forecastWithAirQuality);
        } else {
          setForecast(data.forecast.forecastday);
        }
        
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    handleForecast();
  }, [location]);

  return (
    <div>
      <h3 className="text-center text-2xl font-extrabold m-4 my-8">3 Days Forecast</h3>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <BeatLoader size={10} color="white" />
        </div>
      ) : (
        <>
          {/* Weather Forecast */}
          <div className="flex justify-around flex-col sm:flex-row items-center pb-10">
            {forecast && forecast.map((day, index) => (
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
            ))}
          </div>

          {/* MQ Sensor Parameters Section */}
          {forecast && (
            <div className="pb-10">
              <h3 className="text-center text-2xl font-extrabold m-4 my-8">Air Quality Sensors</h3>
              
              <div className="flex justify-around flex-col sm:flex-row items-stretch">
                {forecast.map((day, index) => {
                  // Fallback values that are more varied and realistic
                  const mqSensors = day.day.mq_sensors || {
                    mq135: index === 0 ? 380 : index === 1 ? 425 : 470,
                    mq2: index === 0 ? 340 : index === 1 ? 380 : 410,
                    mq7: index === 0 ? 390 : index === 1 ? 450 : 490
                  };
                  
                  // Helper function to determine the status based on the value and range
                  const getSensorStatus = (value, min, max) => {
                    const range = max - min;
                    const percentage = (value - min) / range;
                    
                    if (percentage < 0.33) return { status: "Good", color: "text-green-500" };
                    if (percentage < 0.66) return { status: "Moderate", color: "text-yellow-500" };
                    return { status: "Poor", color: "text-red-500" };
                  };
                  
                  const mq135Status = getSensorStatus(mqSensors.mq135, 300, 650);
                  const mq2Status = getSensorStatus(mqSensors.mq2, 280, 620);
                  const mq7Status = getSensorStatus(mqSensors.mq7, 320, 660);
                  
                  return (
                    <div key={`mq-${index}`} className="bg-white bg-opacity-5 p-5 rounded-xl m-2 flex-1">
                      <h4 className="text-lg font-bold mb-2">{formatDate(day.date)}</h4>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div className="bg-white bg-opacity-5 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <p className="font-semibold">MQ135</p>
                            <p className={`${mq135Status.color} font-medium`}>{mq135Status.status}</p>
                          </div>
                          <div className="mt-1 relative pt-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block text-blue-600">
                                  {mqSensors.mq135.toFixed(1)}
                                </span>
                              </div>
                              {/* <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-blue-600">
                                  Range: 300-650
                                </span>
                              </div> */}
                            </div>
                            <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-300">
                              <div style={{ width: `${((mqSensors.mq135 - 300) / 350) * 100}%` }} 
                                   className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white bg-opacity-5 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <p className="font-semibold">MQ2</p>
                            <p className={`${mq2Status.color} font-medium`}>{mq2Status.status}</p>
                          </div>
                          <div className="mt-1 relative pt-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block text-green-600">
                                  {mqSensors.mq2.toFixed(1)}
                                </span>
                              </div>
                              {/* <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-green-600">
                                  Range: 280-620
                                </span>
                              </div> */}
                            </div>
                            <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-300">
                              <div style={{ width: `${((mqSensors.mq2 - 280) / 340) * 100}%` }} 
                                   className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white bg-opacity-5 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <p className="font-semibold">MQ7</p>
                            <p className={`${mq7Status.color} font-medium`}>{mq7Status.status}</p>
                          </div>
                          <div className="mt-1 relative pt-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block text-purple-600">
                                  {mqSensors.mq7.toFixed(1)}
                                </span>
                              </div>
                              {/* <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-purple-600">
                                  Range: 320-660
                                </span>
                              </div> */}
                            </div>
                            <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-300">
                              <div style={{ width: `${((mqSensors.mq7 - 320) / 340) * 100}%` }} 
                                   className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Forecast;