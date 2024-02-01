import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Markers.css';

// Define custom icon options
const iconOptions = {
  iconUrl: process.env.PUBLIC_URL + '/assets/annonce/icon_annonce.png',
  iconSize: [20, 20],
};

// Create custom icon with the marker-icon class
const customIcon = new Icon({ ...iconOptions, className: 'marker-icon'}); 

function Markers({ mapRef, onMarkerClick }) {

  const markersData = [
    //Paris
    {
      position: [48.8589, 2.3469],
      name: 'Paris',
      subHeader: '📍 Eiffel Tower',
      description: 'marker test',
    },
    //Paris
    {
      position: [48.8566, 2.3522], 
      name: 'Marker 2',
      subHeader: '📍 Louvre Museum',
      description: 'marker test',
    },
    //Nice
    {
      position: [43.7031, 7.2661], 
      name: 'Marker 3',
      subHeader: '📍 Nice',
      description: 'marker test',
    },
    //Toulouse
    {
      position: [43.6047, 1.4442], 
      name: 'Marker 4',
      subHeader: '📍 Toulouse',
      description: 'marker test',
    },
    //Marseille
    {
      position: [43.2964, 5.3700], 
      name: 'Marker 5',
      subHeader: '📍 Marseille',
      description: 'marker test',
    },
    //Lyon
    {
      position: [45.7640, 4.8357], 
      name: 'Marker 6',
      subHeader: '📍 Lyon',
      description: 'marker test',
    },
    //Bordeaux
    {
      position: [44.8378, 0.5792], 
      name: 'Marker 7',
      subHeader: '📍 Bordeaux',
      description: 'marker test',
    },
    //Lille
    {
      position: [50.6292, 3.0573], 
      name: 'Marker 8',
      subHeader: '📍 Lille',
      description: 'marker test',
    },
    //Strasbourg
    {
      position: [48.5734, 7.7521], 
      name: 'Marker 9',
      subHeader: '📍 Strasbourg',
      description: 'marker test',
    },
    //Nantes
    {
      position: [47.2184, 1.5536], 
      name: 'Marker 10',
      subHeader: '📍 Nantes',
      description: 'marker test',
    },
    //Montpellier
    {
      position: [43.6108, 3.8767], 
      name: 'Marker 11',
      subHeader: '📍 Montpellier',
      description: 'marker test',
    },
    //Rennes
    {
      position: [48.1173, -1.6778], 
      name: 'Marker 12',
      subHeader: '📍 Rennes',
      description: 'marker test',
    },
    //Reims
    {
      position: [49.2583, 4.0317], 
      name: 'Marker 13',
      subHeader: '📍 Reims',
      description: 'marker test',
    },
    //Le Havre
    {
      position: [49.4944, 0.1079], 
      name: 'Marker 14',
      subHeader: '📍 Le Havre',
      description: 'marker test',
    },
    //Saint-Etienne
    {
      position: [45.4397, 4.3872], 
      name: 'Marker 15',
      subHeader: '📍 Saint-Etienne',
      description: 'marker test',
    },
    //Toulon
    {
      position: [43.1242, 5.9280], 
      name: 'Marker 16',
      subHeader: '📍 Toulon',
      description: 'marker test',
    },
  ];

  /*
  const createOverpassLayer = (position) => {
    if (mapRef.current) {
      const overpassLayer = new OverpassLayer({
        query: `
          [out:json][timeout:25];
          (
            node["amenity"](around:1000, ${position.lat}, ${position.lng});
            // Ajoutez ou modifiez les types de POI selon vos besoins
          );
          out body;
          >;
          out skel qt;
        `,
      });
      overpassLayer.addTo(mapRef.current);
    }
  };
  
  useEffect(() => {
    markersData.forEach(marker => {
      createOverpassLayer(marker.position);
    });
  }, [mapRef, markersData]);
  */

  return (
    <>
      {markersData.map((marker, index) => (
        <Marker 
        key={index} // clé unique de chaque marker
        position={marker.position} // position du marker
        icon={customIcon} // icone du marker
        eventHandlers={{ // eventHandlers permet de gérer les évènements sur les markers
          click: () => onMarkerClick(marker),
        }}
      >
          <Popup>
            <div className="marker-popup">
              <h4 className="marker-name">{marker.name}</h4> {/* nom du marker */}
              <h5 className="marker-subheader">{marker.subHeader}</h5> {/* sous-titre du marker */}
              <p className="marker-description">{marker.description}</p> {/* description du marker */}
            </div>
          </Popup>
          {/*createOverpassLayer(marker.position)*/}
        </Marker>
      ))}
    </>
  );
}

export default Markers;