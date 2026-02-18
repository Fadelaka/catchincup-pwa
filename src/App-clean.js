import React, { useState, useEffect, useRef } from 'react';
import { MapPin, User, Heart, Navigation, Coffee, Users, Clock, Map } from 'lucide-react';
import logo from './logo.svg';

function App() {
  // États de base - version clean
  const [isAvailable, setIsAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Utilisateurs mockés - version clean
  const nearbyUsers = [
    { id: 1, name: 'Emma', distance: '200m', type: 'business', avatar: '👩‍💼', lat: 48.8566, lng: 2.3522 },
    { id: 2, name: 'Lucas', distance: '350m', type: 'friendly', avatar: '👨‍🎨', lat: 48.8576, lng: 2.3532 },
    { id: 3, name: 'Sophie', distance: '450m', type: 'business', avatar: '👩‍💻', lat: 48.8586, lng: 2.3542 },
  ];

  const [users, setUsers] = useState(nearbyUsers);

  // Géolocalisation - version clean
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLocationLoading(false);
          setLocationError(null);
        },
        (error) => {
          setLocationError('Localisation impossible');
          setLocationLoading(false);
        }
      );
    } else {
      setLocationError('Géolocalisation non supportée');
      setLocationLoading(false);
    }
  }, []);

  // Google Maps - version clean
  useEffect(() => {
    if (window.google && window.google.maps && userLocation && mapRef.current && !mapLoaded) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 15,
        styles: [
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
        ]
      });
      
      mapInstanceRef.current = map;
      setMapLoaded(true);
    }
  }, [userLocation, mapLoaded]);

  // Marqueurs utilisateurs - version clean
  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current && window.google && window.google.maps) {
      users.forEach(user => {
        new window.google.maps.Marker({
          position: { lat: user.lat, lng: user.lng },
          map: mapInstanceRef.current,
          title: user.name,
          icon: {
            path: "M 0,0 C -2,-2 -2,-6 0,-6 C 2,-6 2,-2 0,0 Z",
            fillColor: user.type === 'business' ? '#3B82F6' : '#10B981',
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 4
          }
        });
      });
    }
  }, [mapLoaded, users]);

  // Invitation simple - version clean
  const handleInvite = (userName) => {
    alert(`Invitation envoyée à ${userName} !`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coffee className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CatchinCup™</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isAvailable 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {isAvailable ? '✓ Disponible' : 'Indisponible'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('map')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'map'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Map className="w-4 h-4 inline mr-2" />
              Carte
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Liste
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-6xl mx-auto px-4 py-4">
        {locationLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Localisation en cours...</p>
          </div>
        )}

        {locationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{locationError}</p>
          </div>
        )}

        {!locationLoading && !locationError && (
          <>
            {activeTab === 'map' && (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div ref={mapRef} className="w-full h-96"></div>
              </div>
            )}

            {activeTab === 'list' && (
              <div className="space-y-3">
                {users.map(user => (
                  <div key={user.id} className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{user.avatar}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-500">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {user.distance} • {user.type === 'business' ? '☕ Business' : '☕ Friendly'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleInvite(user.name)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Inviter ☕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Barre d'info */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                <Users className="w-4 h-4 inline mr-1" />
                {users.length} personnes
              </span>
              {userLocation && (
                <span className="text-green-600">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Position OK
                </span>
              )}
            </div>
            <span className="text-gray-500 text-xs">
              CatchinCup™ - Le temps d'un café
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
