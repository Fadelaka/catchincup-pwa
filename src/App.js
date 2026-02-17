import React, { useState, useEffect, useRef } from 'react';
import { MapPin, User, Heart, Navigation, Coffee, Users, Clock, Map } from 'lucide-react';
import logo from './logo.svg';

function App() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState('Initialisation...');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const nearbyUsers = [
    { id: 1, name: 'Emma', distance: '200m', type: 'business', avatar: '👩‍💼', lat: 48.8576, lng: 2.3532 },
    { id: 2, name: 'Lucas', distance: '350m', type: 'friendly', avatar: '👨‍🎨', lat: 48.8586, lng: 2.3542 },
    { id: 3, name: 'Sophie', distance: '450m', type: 'business', avatar: '👩‍💻', lat: 48.8596, lng: 2.3552 },
  ];

  // Register Service Worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  // Initialize map with user location
  useEffect(() => {
    getUserLocation(); // Get location on app start
  }, []);

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = () => {
      console.log('🗺️ initializeMap called');
      console.log('🗺️ window.google:', !!window.google);
      console.log('🗺️ window.google.maps:', !!window.google?.maps);
      
      setDebugInfo('Vérification Google Maps...');
      
      if (window.google && window.google.maps) {
        setDebugInfo('Google Maps trouvé ! Initialisation...');
        console.log('🗺️ Google Maps API loaded');
        
        if (mapRef.current && !mapLoaded) {
          console.log('🗺️ Creating map instance...');
          const map = new window.google.maps.Map(mapRef.current, {
            center: userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : { lat: 48.8566, lng: 2.3522 },
            zoom: 16,
            styles: [
              {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{ "visibility": "off" }]
              },
              {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [{ "color": "#f5f5f5" }]
              },
              {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{ "color": "#e0f2fe" }]
              }
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
          });

          console.log('🗺️ Map created:', map);
          mapInstanceRef.current = map;
          setMapLoaded(true);
          setDebugInfo('Carte initialisée ! Ajout des markers...');

          // Add user marker if location available
          if (userLocation) {
            console.log('🗺️ Adding user marker...');
            new window.google.maps.Marker({
              position: { lat: userLocation.lat, lng: userLocation.lng },
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
          }

          // Add nearby users markers
          console.log('🗺️ Adding nearby users markers...');
          nearbyUsers.forEach(user => {
            const marker = new window.google.maps.Marker({
              position: { lat: user.lat, lng: user.lng },
              map: map,
              title: user.name,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: user.type === 'business' ? '#10B981' : '#F59E0B',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2
              }
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px; font-family: Inter, sans-serif;">
                  <div style="font-weight: bold; margin-bottom: 4px;">${user.avatar} ${user.name}</div>
                  <div style="font-size: 12px; color: #666;">${user.distance}</div>
                  <div style="font-size: 12px; color: #666;">${user.type === 'business' ? '☕ Business' : '☕ Friendly'}</div>
                  <button onclick="sendPing('${user.name}')" style="
                    margin-top: 8px;
                    padding: 4px 8px;
                    background: #3B82F6;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 12px;
                    cursor: pointer;
                  ">Inviter ☕</button>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
          });

          setDebugInfo('Carte prête ! ' + nearbyUsers.length + ' utilisateurs trouvés.');
        } else {
          setDebugInfo('Google Maps pas encore chargé...');
          console.log('🗺️ Google Maps not ready yet');
        }
      } else {
        setDebugInfo('Google Maps pas encore chargé...');
        console.log('🗺️ Google Maps not ready yet');
      }
    };

    initializeMap();

    const interval = setInterval(() => {
      if (!mapLoaded) {
        console.log('🗺️ Retrying map initialization...');
        initializeMap();
      } else {
        console.log('🗺️ Map loaded, stopping retry');
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [mapLoaded, userLocation]);

  // Global function for ping
  useEffect(() => {
    window.sendPing = (userName) => {
      alert(`☕ Invitation envoyée à ${userName} !`);
    };
  }, []);

  // Get user location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('La géolocalisation n\'est pas supportée par votre navigateur');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setLocationLoading(false);
        setLocationError(null);
        
        // Center map on user location
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(location);
          mapInstanceRef.current.setZoom(16);
        }
        
        setDebugInfo('Position trouvée ! Carte centrée sur votre position.');
      },
      (error) => {
        let errorMessage = 'Impossible d\'obtenir votre position';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Vous avez refusé la géolocalisation';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position indisponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Délai d\'attente dépassé';
            break;
        }
        setLocationError(errorMessage);
        setLocationLoading(false);
        setDebugInfo(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  };

  // Center map on user location
  const centerOnUser = () => {
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(userLocation);
      mapInstanceRef.current.setZoom(16);
      setDebugInfo('Carte recentrée sur votre position');
    } else {
      getUserLocation();
    }
  };

  // Add location status and GPS button
  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    alert(isAvailable ? 'Plus disponible' : 'Dispo pour 1h !');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                <img src={logo} alt="CatchinCup" className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  CatchinCup™
                </h1>
                <p className="text-sm text-slate-600 font-medium" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  Le temps d'un café à côté
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {locationLoading && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <Navigation className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Localisation...</span>
                </div>
              )}
              {locationError && (
                <div className="flex items-center space-x-2 text-red-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{locationError}</span>
                </div>
              )}
              {userLocation && !locationLoading && (
                <div className="flex items-center space-x-2 text-green-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Position trouvée</span>
                </div>
              )}
            </div>
            <button
              onClick={toggleAvailability}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                isAvailable 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-white animate-pulse' : 'bg-slate-400'}`}></div>
                <span>{isAvailable ? 'Disponible' : 'Disponible'}</span>
              </span>
            </button>
            <button
              onClick={centerOnUser}
              className="px-4 py-3 rounded-2xl font-semibold bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/30 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('map')}
              className={`py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'map'
                  ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Carte
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Profil
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {isAvailable ? 'Personnes disponibles' : 'Découvrir votre quartier'}
                </h2>
                <p className="text-slate-600 mb-6">
                  {isAvailable 
                    ? `${nearbyUsers.length} personnes prêtes pour un café dans un rayon de 500m`
                    : 'Activez votre disponibilité pour voir qui est autour de vous'
                  }
                </p>
                
                {!isAvailable ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Soyez visible</h3>
                    <p className="text-slate-600 mb-6">
                      Personne ne peut vous voir quand vous n'êtes pas disponible
                    </p>
                    <button
                      onClick={toggleAvailability}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                      Devenir disponible
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-600 text-sm font-medium">Total</p>
                            <p className="text-2xl font-bold text-blue-900">{nearbyUsers.length}</p>
                          </div>
                          <Users className="w-8 h-8 text-blue-500" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-emerald-600 text-sm font-medium">Business</p>
                            <p className="text-2xl font-bold text-emerald-900">{nearbyUsers.filter(u => u.type === 'business').length}</p>
                          </div>
                          <Coffee className="w-8 h-8 text-emerald-500" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-orange-600 text-sm font-medium">Friendly</p>
                            <p className="text-2xl font-bold text-orange-900">{nearbyUsers.filter(u => u.type === 'friendly').length}</p>
                          </div>
                          <Heart className="w-8 h-8 text-orange-500" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Google Maps */}
                    <div className="relative rounded-2xl overflow-hidden shadow-inner border border-slate-200/50">
                      <div 
                        ref={mapRef} 
                        className="w-full h-96"
                        style={{ minHeight: '400px' }}
                      />
                      {!mapLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                              <Navigation className="w-8 h-8 text-blue-500 animate-pulse" />
                            </div>
                            <p className="text-slate-600 font-medium">Chargement de la carte...</p>
                            <p className="text-slate-500 text-sm mt-1">{debugInfo}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Legend */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50">
                      <h3 className="font-semibold text-slate-900 mb-3">Légende</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-sm"></div>
                          <span className="text-slate-700">Business</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-orange-500 rounded-full shadow-sm"></div>
                          <span className="text-slate-700">Friendly</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Mon Profil</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                      👨‍💻
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Thomas</h3>
                      <p className="text-slate-600">Développeur passionné de café</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mt-2">
                        💼 Business
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200/50 pt-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Statut actuel</h4>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                          <span className="text-slate-700">
                            {isAvailable ? 'Disponible pour 60min (rayon 500m)' : 'Non disponible'}
                          </span>
                        </div>
                        <Clock className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200/50 pt-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Préférences</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-700">Rayon de recherche</span>
                        </div>
                        <span className="text-slate-900 font-medium">500m</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-700">Durée de disponibilité</span>
                        </div>
                        <span className="text-slate-900 font-medium">1 heure</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                        <div className="flex items-center space-x-3">
                          <Coffee className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-700">Type de rencontre</span>
                        </div>
                        <span className="text-slate-900 font-medium">Business</span>
                      </div>
                    </div>
                  </div>
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
