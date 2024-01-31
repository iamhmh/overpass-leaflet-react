import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, FeatureGroup, GeoJSON, Circle, Marker, Popup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import Markers from './Markers';

function Map(props) {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [pois, setPois] = useState([]);
  const [polygon, setPolygon] = useState(null);
  const [currentView, setCurrentView] = useState('FRANCE');
  const [departementsGeoJSON, setDepartementsGeoJSON] = useState(null);
  const [regionsGeoJSON, setRegionsGeoJSON] = useState(null);
  const mapRef = useRef(); 
  const parisCoordinates = [48.8566, 2.3522];
  const zoomLevel = 7;

  useEffect(() => {
    fetch('departements.geojson')
      .then(response => response.json())
      .then(data => setDepartementsGeoJSON(data))
      .catch(error => console.error('Error loading departements geojson:', error));
  
    fetch('regions.geojson')
      .then(response => response.json())
      .then(data => setRegionsGeoJSON(data))
      .catch(error => console.error('Error loading regions geojson:', error));
  }, []);
  
  const onMarkerClick = (marker) => {
    setSelectedMarker(marker);
    fetchOverpassData(marker.position);
  };

  const fetchOverpassData = (position) => {
    const overpassQuery = `
    [out:json][timeout:25];
    (
      node["highway"="bus_stop"](around:1000, ${position[0]}, ${position[1]});
      node["railway"="tram_stop"](around:1000, ${position[0]}, ${position[1]});
      node["railway"="subway_entrance"](around:1000, ${position[0]}, ${position[1]});
      node["amenity"="bakery"](around:1000, ${position[0]}, ${position[1]});
      node["amenity"="restaurant"](around:1000, ${position[0]}, ${position[1]});
      node["amenity"="supermarket"](around:1000, ${position[0]}, ${position[1]});
      node["leisure"="sports_centre"](around:1000, ${position[0]}, ${position[1]});
      );
      out body;
      >;
      out skel qt;
    `;
    
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    fetch(overpassUrl)
      .then(response => response.json())
      .then(data => {
        const loadedPois = data.elements.map(el => {
          const iconKey = el.tags.amenity || el.tags.highway || el.tags.railway || el.tags.leisure;
          return { id: el.id, lat: el.lat, lng: el.lon, iconKey: iconKey, ...el.tags };
        });
        setPois(loadedPois);
        props.setPois(loadedPois);
      })
      .catch(error => console.error('Erreur lors du chargement des données Overpass:', error));
  };

  const poiIcons = {
    "bus_stop": new L.Icon({ iconUrl: process.env.PUBLIC_URL + '/assets/poi-icons/bus_stop.png', iconSize: [25, 25] }),
    "tram_stop": new L.Icon({ iconUrl: process.env.PUBLIC_URL + '/assets/poi-icons/tramway.png', iconSize: [25, 25] }),
    "subway_entrance": new L.Icon({ iconUrl: process.env.PUBLIC_URL + '/assets/poi-icons/subway.png', iconSize: [25, 25] }),
    "bakery": new L.Icon({ iconUrl: process.env.PUBLIC_URL + '/assets/poi-icons/bakery.png', iconSize: [25, 25] }),
    "restaurant": new L.Icon({ iconUrl: process.env.PUBLIC_URL + '/assets/poi-icons/restaurant.png', iconSize: [25, 25] }),
    "supermarket": new L.Icon({ iconUrl: process.env.PUBLIC_URL + '/assets/poi-icons/supermarket.png', iconSize: [25, 25] }),
    "sports_centre": new L.Icon({ iconUrl: process.env.PUBLIC_URL + '/assets/poi-icons/sports.png', iconSize: [25, 25] }),
  };

  const defaultIcon = new L.Icon({ iconUrl: '/path/to/default-icon.png', iconSize: [25, 25] });

  const onCreated = (e) => {
    const { layer } = e;
    if (mapRef.current) {
      const map = mapRef.current;
      map.fitBounds(layer.getBounds()); 

      layer.remove();
      setPolygon(null);
    }
  };

  const onEdited = (e) => {
    //rien
  };

  const onDeleted = (e) => {
    setPolygon(null);
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        if (mapRef.current) {
          mapRef.current.fitBounds(layer.getBounds());
        }
      },
    });
  };

  return (
    <div style={{ height: '100vh', width: '50%' }}>
      <button onClick={() => setCurrentView('FRANCE')}>France</button>
      <button onClick={() => setCurrentView('REGIONS')}>Régions</button>
      <button onClick={() => setCurrentView('DEPARTEMENT')}>Départements</button>
      <MapContainer
        center={parisCoordinates}
        zoom={zoomLevel}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {currentView === 'REGIONS' && regionsGeoJSON && (
          <GeoJSON data={regionsGeoJSON} onEachFeature={onEachFeature} />
        )}
        {currentView === 'DEPARTEMENT' && departementsGeoJSON && (
          <GeoJSON data={departementsGeoJSON} onEachFeature={onEachFeature} />
        )}
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={onCreated}
            onEdited={onEdited}
            onDeleted={onDeleted}
            draw={{
              rectangle: false,
              polyline: false,
              circle: false,
              circlemarker: false,
              marker: false,
            }}
          />
        </FeatureGroup>
        <Markers mapRef={mapRef} onMarkerClick={onMarkerClick} />
        {selectedMarker && (
          <Circle
            center={selectedMarker.position}
            radius={1000}
            color="red"
          />
        )}
          {pois.map(poi => {
        const icon = poiIcons[poi.iconKey] || defaultIcon;
        return (
          <Marker 
            key={poi.id} 
            position={[poi.lat, poi.lng]}
            icon={icon}
          >
            <Popup>
              <div>
                <strong>{poi.name || 'POI'}</strong><br/>
                {poi.iconKey && <span>{poi.iconKey}</span>}
              </div>
            </Popup>
          </Marker>
        );
      })}
      </MapContainer>
    </div>
  );
  
}

export default Map;