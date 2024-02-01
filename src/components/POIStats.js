import React from 'react';

function POIStats({ pois }) {
  const countPois = type => pois.filter(poi => poi.iconKey === type).length; // Comptes le nombre de POIs de chaque type (POI = Point Of Interest (restaurant, bus, etc...))
  return (
    <div className="poi-stats" style={{ height: '100%', width: '50%' }}>
      <h3>Statistiques des POIs</h3>
      <ul>
        <li>Restaurant: {countPois("restaurant")}</li> {/* recuperation de la valeur du POI restaurant */}
        <li>Stations de bus: {countPois("bus_stop")}</li>
        <li>Métros: {countPois("tram_stop")}</li>
        <li>Supermarchés: {countPois("supermarket")}</li>
        <li>Boulangeries: {countPois("bakery")}</li>
        <li>Salles de sport: {countPois("sports_centre")}</li>
      </ul>
    </div>
  );
}

export default POIStats;