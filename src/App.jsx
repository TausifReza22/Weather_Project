import { useState, useEffect } from 'react';
import search from './assets/icons/search.svg';
import { useStateContext } from './Context';
import { BackgroundLayout, WeatherCard, MiniCard } from './Components';
import { useAuth0 } from "@auth0/auth0-react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [input, setInput] = useState('');
  const [isCelsius, setIsCelsius] = useState(true);
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const { weather, thisLocation, values, setPlace } = useStateContext();
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  useEffect(() => {
    const savedPlaces = JSON.parse(localStorage.getItem('favoritePlaces')) || [];
    setFavoritePlaces(savedPlaces);
  }, []);

  const onKeyUpHandler = (event) => {
    if (event.key === 'Enter') {
      setPlace(input);
      setInput('');
    }
  };

  const onChangeHandler = (event) => {
    setInput(event.target.value);
  };

  const toggleTemperature = () => {
    setIsCelsius(!isCelsius);
  };

  const saveFavoritePlace = () => {
    const newFavorites = [...favoritePlaces, thisLocation];
    setFavoritePlaces(newFavorites);
    localStorage.setItem('favoritePlaces', JSON.stringify(newFavorites));
  };

  const generateChartData = (values) => {
    return {
      labels: values.map(entry => entry.datetime),
      datasets: [
        {
          label: 'Temperature',
          data: values.map(entry => isCelsius ? entry.temp : entry.temp * 9/5 + 32),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  return (
    <div className='w-full h-screen text-white'>
      {!isAuthenticated ? (
        <div className='flex items-center justify-center h-full'>
          <div className='bg-white text-black shadow-2xl p-10 rounded-lg max-w-md mx-auto'>
            <h2 className='text-3xl font-bold mb-6 text-center'>Login</h2>
            <button 
              type="button" 
              onClick={() => loginWithRedirect()} 
              className='w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md flex items-center justify-center'
            >
              <i className="fa-regular fa-user mr-2"></i> Log in with Google
            </button>
          </div>
        </div>
      ) : (
        <>
          <nav className='w-full p-3 flex justify-between items-center'>
            <h1 className='font-bold tracking-wide text-3xl'>Weather App</h1>
            <div className='bg-white w-[15rem] overflow-hidden shadow-2xl rounded flex items-center p-2 gap-2'>
              <img src={search} alt="search" className='w-[1.5rem] h-[1.5rem]' />
              <input
                onKeyUp={onKeyUpHandler}
                type="text"
                placeholder='Search city'
                className='focus:outline-none w-full text-[#212121] text-lg'
                value={input}
                onChange={onChangeHandler}
              />
            </div>
            <div className='flex items-center'>
              <button 
                onClick={toggleTemperature} 
                className='bg-gray-500 text-white px-3 py-2 rounded mx-2'
              >
                {isCelsius ? 'Switch to °F' : 'Switch to °C'}
              </button>
              <button 
                onClick={saveFavoritePlace} 
                className='bg-green-500 text-white px-3 py-2 rounded mx-2'
              >
                Save Favorite Place
              </button>
              <button 
                onClick={() => logout({ returnTo: window.location.origin })} 
                className='bg-gray-500 text-white px-3 py-2 rounded'
              >
                Logout
              </button>
            </div>
          </nav>

          <BackgroundLayout />

          <main className='w-full flex flex-wrap gap-8 py-4 px-[10%] items-center justify-center'>
            <WeatherCard
              place={thisLocation}
              windspeed={weather.wspd}
              humidity={weather.humidity}
              temperature={isCelsius ? weather.temp : weather.temp * 9/5 + 32}
              heatIndex={isCelsius ? weather.heatindex : weather.heatindex * 9/5 + 32}
              iconString={weather.conditions}
              conditions={weather.conditions}
              isCelsius={isCelsius}
            />

            <div className='flex justify-center gap-8 flex-wrap w-[60%]'>
              {values?.slice(1, 7).map(current => (
                <MiniCard
                  key={current.datetime}
                  time={current.datetime}
                  temp={isCelsius ? current.temp : current.temp * 9/5 + 32}
                  iconString={current.conditions}
                  isCelsius={isCelsius}
                />
              ))}
            </div>

            <div className='w-full bg-gray-200 p-6 rounded-lg'>
              <Line data={generateChartData(values.slice(0, 7))} />
            </div>

            <div className='w-full mt-8'>
              <h2 className='text-2xl font-bold'>Favorite Places</h2>
              <ul>
                {favoritePlaces.map((place, index) => (
                  <li key={index}>{place}</li>
                ))}
              </ul>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
