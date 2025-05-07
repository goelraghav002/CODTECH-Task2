import { useEffect, useState } from 'react';
import Forecast from './Forecast';
import { formatDateTime } from './utils';

function WeatherApp() {
  const [location, setLocation] = useState('');
  const [location1, setLocation1] = useState('');
  const [weather, setWeather] = useState(null);

  const [results, setResults] = useState(null);


  function handleLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("cannot get location");
    }
  }

  const handleSearch = (name) => {
    setLocation(name);

    fetch(`https://api.weatherapi.com/v1/current.json?key=e26e85517ccb447c9c2162926221706&q=${name}&aqi=yes`)
      .then(response => response.json())
      .then(data => {
        setWeather(data);
        console.log(data);
      })
      .then(setResults(null))
      .catch(error => console.log(error));

  }

  function handleNew(e) {
    setLocation1(e.target.value);

    if (location1.length >= 1) {


      fetch(`https://api.weatherapi.com/v1/search.json?key=e26e85517ccb447c9c2162926221706&q=${location1}`)

        .then(response => response.json())
        .then(data => {
          setResults(data);
          console.log(data);
        })
        .catch(error => console.log(error));

    }
  }

  function handle() {

    setLocation(location1);

    fetch(`https://api.weatherapi.com/v1/current.json?key=e26e85517ccb447c9c2162926221706&q=${location1}&aqi=yes`)
      .then(response => response.json())
      .then(data => {
        setWeather(data);
        console.log(data);
      })
      .catch(error => console.log(error));
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const num = latitude + "," + longitude;
    setLocation(num);
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    // Make API call to OpenWeatherMap
    fetch(`https://api.weatherapi.com/v1/current.json?key=e26e85517ccb447c9c2162926221706&q=${num}&aqi=yes`)
      .then(response => response.json())
      .then(data => {
        setWeather(data);
        console.log(data);
      })
      .catch(error => console.log(error));
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  useEffect(() => {
    handleLocationClick();
  }, [location])

  return (
    <div className='max-w-[340px] sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl m-auto min-h-screen'>

      <div className='text-center top-10 relative'>
        <input type="text" value={location1} onChange={handleNew} className='bg-black rounded-full py-2 px-4 m-2 outline-none w-80 text-white bg-opacity-30 font-semibold' placeholder='Enter Location' />

        <button onClick={handle} className='bg-black bg-opacity-30 py-2 px-4 rounded-full'>Search</button>
        <div className='absolute flex w-full justify-center'>
          <div className='shadow-md bg-neutral-100 text-black rounded-lg'>
            {results && results?.map((result, index) => (
              <div key={index} className='border-b p-1 w-96'>

                <button onClick={() => handleSearch(result.name)}><p>{result.name} {result.region} {result.country}</p></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <br /><br />
      <br /><br />


      <hr />






      {!location ? <button onClick={handleLocationClick}>Get Location</button> : null}
      {location && !weather ? <p>Loading weather data...</p> : null}
      {weather ? (




        <div className='text-center pt-10'>
          <h3 className='text-3xl font-extrabold'>{weather.location?.name}, {weather.location?.country}</h3>
          <p className='text-sm'>{formatDateTime(weather.location?.localtime)}</p>
          <div className='flex w-full justify-center mt-8 gap-3 items-end'>
            <h1 className='text-5xl font-extrabold'>{weather.current.temp_c} °C</h1>
            <h5 className=''>Feels like: {weather.current?.feelslike_c} °C</h5>
          </div>
          <div className='flex justify-center w-full items-center text-4xl font-bold'>{weather.current.condition.text}
            <span className='mt-2'><img src={`${weather.current.condition.icon}`} width={120} alt="" className='m-0 p-0' /></span>
          </div>
        </div>
      ) : null}<hr />
      {location && <button className='m-10 bg-black text-white p-5'>Show 10 day forecast</button> && <Forecast location={location} />}
    </div>
  );
}

export default WeatherApp;