import React, { useState, useEffect, useRef } from 'react';
import { MapPin, User, Heart, Navigation, Coffee, Users, Clock, Map } from 'lucide-react';
import logo from './logo.svg';

function App() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
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

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = () => {
      console.log('🗺️ initializeMap called');
      console.log('🗺️ window.google:', !!window.google);
      console.log('🗺️ window.google.maps:', !!window.google?.maps);
      console.log('🗺️ mapRef.current:', !!mapRef.current);
      console.log('🗺️ mapLoaded:', mapLoaded);
      
      setDebugInfo('Vérification Google Maps...');
      
      if (window.google && window.google.maps) {
        setDebugInfo('Google Maps trouvé ! Initialisation...');
        console.log('🗺️ Google Maps API loaded');
        
        if (mapRef.current && !mapLoaded) {
          console.log('🗺️ Creating map instance...');
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 48.8566, lng: 2.3522 },
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

          // Add user marker
          console.log('🗺️ Adding user marker...');
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

          // Add nearby users markers
          nearbyUsers.forEach((user, index) => {
            setDebugInfo(`Ajout de ${user.name}...`);
            console.log(`🗺️ Adding marker for ${user.name}...`);
            
            const marker = new window.google.maps.Marker({
              position: { lat: user.lat, lng: user.lng },
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
                <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 180px; border-radius: 8px;">
                  <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 20px; margin-right: 10px;">${user.avatar}</span>
                    <strong style="font-size: 16px; color: #1f2937;">${user.name}</strong>
                  </div>
                  <p style="margin: 4px 0; font-size: 13px; color: #6b7280;">${user.distance} • ${user.type === 'business' ? '💼 Business' : '🤝 Friendly'}</p>
                  <button onclick="window.sendPing('${user.name}')" style="background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; width: 100%; transition: all 0.2s;">☕ Envoyer une invitation</button>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });

            setDebugInfo(`${user.name} ajouté !`);
          });

          setDebugInfo('Tous les markers ajoutés !');
          console.log('🗺️ All markers added successfully');
        } else {
          console.log('🗺️ Map already loaded or ref not ready');
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
      console.log('🗺️ Cleaning up map interval');
      clearInterval(interval);
    };
  }, [mapLoaded]);

  // Global function for ping
  useEffect(() => {
    window.sendPing = (userName) => {
      alert(`☕ Invitation envoyée à ${userName} !`);
    };
  }, []);

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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                CatchinCup™
              </h1>
              <span className="text-sm text-slate-500 hidden sm:inline">Le temps d'un café à côté</span>
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
