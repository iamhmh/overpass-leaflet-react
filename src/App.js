import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Map from './components/Map';
import POIStats from './components/POIStats';
import './styles.css';
import './assets/fonts/fonts.css';

function App() {
  const [pois, setPois] = useState([]);
  return (
    <div className='app-container'>
      <Header />
      <div className='map-container'>
        <Map setPois={setPois} />
        <POIStats pois={pois} />
      </div>
    </div>
  );
}

export default App;