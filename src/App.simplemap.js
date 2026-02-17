import React, { useState, useEffect, useRef } from 'react';
import { MapPin, User, Heart, Navigation } from 'lucide-react';

function App() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);

  const nearbyUsers = [
    { id: 1, name: 'Emma', distance: '200m', type: 'business', avatar: '👩‍💼' },
    { id: 2, name: 'Lucas', distance: '350m', type: 'friendly', avatar: '👨‍🎨' },
    { id: 3, name: 'Sophie', distance: '450m', type: 'business', avatar: '👩‍💻' },
  ];

  useEffect(() => {
    // Check if Google Maps is loaded
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setMapLoaded(true);
        
        // Initialize map
        if (mapRef.current) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 48.8566, lng: 2.3522 }, // Paris
            zoom: 15,
            styles: [
              {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{ "visibility": "off" }]
              }
            ]
          });

          // Add user marker
          new window.google.maps.Marker({
            position: { lat: 48.8566, lng: 2.3522 },
            map: map,
            title: 'TOI',
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#3B82F6',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2
            }
          });

          // Add nearby users
          const positions = [
            { lat: 48.8576, lng: 2.3532 }, // Emma
            { lat: 48.8586, lng: 2.3542 }, // Lucas  
            { lat: 48.8596, lng: 2.3552 }, // Sophie
          ];

          nearbyUsers.forEach((user, index) => {
            const marker = new window.google.maps.Marker({
              position: positions[index],
              map: map,
              title: user.name,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: user.type === 'business' ? '#10B981' : '#F97316',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2
              }
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px; font-family: Arial, sans-serif;">
                  <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${user.avatar} ${user.name}</h3>
                  <p style="margin: 4px 0; font-size: 14px; color: #666;">${user.distance} • ${user.type === 'business' ? '💼 Business' : '🤝 Friendly'}</p>
                  <button onclick="window.sendPing('${user.name}')" style="background: #10B981; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">☕ ?</button>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
          });
        }
      } else {
        // Retry after 500ms
        setTimeout(checkGoogleMaps, 500);
      }
    };

    checkGoogleMaps();
  }, []);

  // Global function for ping
  useEffect(() => {
    window.sendPing = (userName) => {
      alert(`☕ ? envoyé à ${userName} !`);
    };
  }, []);

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    alert(isAvailable ? 'Plus disponible' : 'Dispo pour 1h !');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-amber-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              CatchinCup® - Le temps d'un café à côté
            </h1>
            <button
              onClick={toggleAvailability}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                isAvailable 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {isAvailable ? '🟢 Dispo' : 'Dispo'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('map')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'map'
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Carte
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Profil
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {isAvailable ? 'Personnes dispo autour de vous' : 'Carte'}
              </h2>
              
              {!isAvailable ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Personne ne peut vous voir quand vous n'êtes pas "Dispo"
                  </p>
                  <button
                    onClick={toggleAvailability}
                    className="bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold"
                  >
                    Devenir Dispo
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    {nearbyUsers.length} personnes dispo dans 500m
                  </p>
                  
                  {/* Google Maps */}
                  <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      ref={mapRef} 
                      className="w-full h-full"
                      style={{ minHeight: '400px' }}
                    />
                    {!mapLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <Navigation className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-gray-600">Chargement de la carte...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span>Business</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                      <span>Friendly</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mon Profil</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                  👨‍💻
                </div>
                <div>
                  <h3 className="text-xl font-bold">Thomas</h3>
                  <p className="text-gray-600">Dev qui aime le café</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    💼 Business
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Statut Actuel</h4>
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>{isAvailable ? 'Dispo pour 60min (rayon 500m)' : 'Non disponible'}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Préférences</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>📍 Rayon: 500m (fixe pour la beta)</p>
                  <p>⏰ Durée: 1h (fixe pour la beta)</p>
                  <p>☕ Type: Business</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
