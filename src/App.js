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
    { id: 1, name: 'Emma', distance: '200m', type: 'business', avatar: '👩‍💼', lat: 48.8566, lng: 2.3522 },
    { id: 2, name: 'Lucas', distance: '350m', type: 'friendly', avatar: '👨‍🎨', lat: 48.8576, lng: 2.3532 },
    { id: 3, name: 'Sophie', distance: '450m', type: 'business', avatar: '👩‍💻', lat: 48.8586, lng: 2.3542 },
  ];

  // Generate nearby users around user location
  const generateNearbyUsers = (userLat, userLng) => {
    if (!userLat || !userLng) return nearbyUsers;
    
    return [
      { id: 1, name: 'Emma', distance: '150m', type: 'business', avatar: '👩‍💼', lat: userLat + 0.001, lng: userLng + 0.001 },
      { id: 2, name: 'Lucas', distance: '250m', type: 'friendly', avatar: '👨‍🎨', lat: userLat - 0.001, lng: userLng + 0.0015 },
      { id: 3, name: 'Sophie', distance: '350m', type: 'business', avatar: '👩‍💻', lat: userLat + 0.0015, lng: userLng - 0.001 },
      { id: 4, name: 'Marc', distance: '400m', type: 'friendly', avatar: '👨‍💼', lat: userLat - 0.002, lng: userLng - 0.001 },
      { id: 5, name: 'Léa', distance: '500m', type: 'business', avatar: '👩‍🎨', lat: userLat + 0.002, lng: userLng + 0.002 },
    ];
  };

  const [users, setUsers] = useState(nearbyUsers);

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
            zoomControl: true,
            zoomControlOptions: {
              position: window.google.maps.ControlPosition.RIGHT_BOTTOM
            },
            panControl: true,
            panControlOptions: {
              position: window.google.maps.ControlPosition.RIGHT_BOTTOM
            },
            gestureHandling: 'auto',
            scrollwheel: true,
            draggable: true,
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
          users.forEach(user => {
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

          setDebugInfo('Carte prête ! ' + users.length + ' utilisateurs trouvés.');
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
  }, [mapLoaded, userLocation, users]);

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
        
        // Generate nearby users around user location
        const nearbyUsersList = generateNearbyUsers(location.lat, location.lng);
        setUsers(nearbyUsersList);
        
        // Center map on user location
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(location);
          mapInstanceRef.current.setZoom(16);
        }
        
        setDebugInfo('Position trouvée ! ' + nearbyUsersList.length + ' utilisateurs proches.');
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
    <div className="h-screen w-screen fixed overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Compact */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200/50 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                <img src={logo} alt="CatchinCup" className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  CatchinCup™
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={toggleAvailability}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 ${
                  isAvailable 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="flex items-center space-x-1">
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isAvailable ? 'bg-white animate-pulse' : 'bg-slate-400'}`}></div>
                  <span className="hidden sm:inline">{isAvailable ? 'Disponible' : 'Disponible'}</span>
                  <span className="sm:hidden">🟢</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Map Container - Takes 80% of screen */}
      <div className="fixed top-16 left-0 right-0 bottom-20 z-10">
        <div className="w-full h-full bg-white/80 backdrop-blur-sm rounded-t-2xl shadow-xl border border-slate-200/50 overflow-hidden">
          <div className="w-full h-full relative">
            <div 
              ref={mapRef} 
              className="w-full h-full"
              style={{ minHeight: '100%' }}
            />
            {debugInfo && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-slate-200/50 z-20">
                <p className="text-xs text-slate-600">{debugInfo}</p>
              </div>
            )}
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
        </div>
      </div>

      {/* Bottom Info Bar - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-lg border-t border-slate-200/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-slate-900">
                  {users.length} personnes dispo
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-600">
                <MapPin className="w-3 h-3" />
                <span>Rayon 500m</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {locationLoading && (
                <div className="flex items-center space-x-1 text-blue-600">
                  <Navigation className="w-3 h-3 animate-spin" />
                  <span className="text-xs">GPS...</span>
                </div>
              )}
              {locationError && (
                <div className="flex items-center space-x-1 text-red-600">
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs">GPS KO</span>
                </div>
              )}
              {userLocation && !locationLoading && (
                <div className="flex items-center space-x-1 text-green-600">
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs">Position OK</span>
                </div>
              )}
            </div>
            
            {/* USER MARKERS RENDER */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {users.map(user => (
                <div key={user.id} className="flex flex-col items-center bg-white rounded-lg p-3 shadow-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {user.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-600">{user.distance}</div>
                      <div className="text-xs text-slate-600">{user.type === 'business' ? '☕ Business' : '☕ Friendly'}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert(`☕ Invitation envoyée à ${user.name} !`)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Envoyer invitation
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
export default App;
