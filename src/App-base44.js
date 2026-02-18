import React, { useState, useEffect, useRef } from 'react';
import { MapPin, User, Heart, Navigation, Coffee, Users, Clock, Map, Search, Filter, Bell, Settings } from 'lucide-react';
import logo from './logo.svg';

function App() {
  // États - style Base44 moderne
  const [isAvailable, setIsAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Utilisateurs - design moderne
  const nearbyUsers = [
    { 
      id: 1, 
      name: 'Emma Laurent', 
      distance: '200m', 
      type: 'business', 
      avatar: '👩‍💼', 
      bio: 'Consultante en marketing, passionnée de café',
      lat: 48.8566, 
      lng: 2.3522,
      rating: 4.8,
      meetups: 12
    },
    { 
      id: 2, 
      name: 'Lucas Martin', 
      distance: '350m', 
      type: 'friendly', 
      avatar: '👨‍🎨', 
      bio: 'Designer graphique, créatif et ouvert',
      lat: 48.8576, 
      lng: 2.3532,
      rating: 4.9,
      meetups: 8
    },
    { 
      id: 3, 
      name: 'Sophie Dubois', 
      distance: '450m', 
      type: 'business', 
      avatar: '👩‍💻', 
      bio: 'Développeuse full-stack, tech et café',
      lat: 48.8586, 
      lng: 2.3542,
      rating: 4.7,
      meetups: 15
    },
    { 
      id: 4, 
      name: 'Marc Bernard', 
      distance: '500m', 
      type: 'friendly', 
      avatar: '👨‍💼', 
      bio: 'Entrepreneur, toujours partant pour un bon café',
      lat: 48.8596, 
      lng: 2.3552,
      rating: 4.6,
      meetups: 20
    },
  ];

  const [users, setUsers] = useState(nearbyUsers);

  // Géolocalisation
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

  // Google Maps
  useEffect(() => {
    if (window.google && window.google.maps && userLocation && mapRef.current && !mapLoaded) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 15,
        styles: [
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#e0f2fe" }] }
        ],
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      });
      
      mapInstanceRef.current = map;
      setMapLoaded(true);
    }
  }, [userLocation, mapLoaded]);

  // Marqueurs utilisateurs
  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current && window.google && window.google.maps) {
      // Clear existing markers
      mapInstanceRef.current.markers = [];
      
      users.forEach(user => {
        const marker = new window.google.maps.Marker({
          position: { lat: user.lat, lng: user.lng },
          map: mapInstanceRef.current,
          title: user.name,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="${user.type === 'business' ? '#3B82F6' : '#10B981'}" stroke="white" stroke-width="2"/>
                <text x="20" y="25" text-anchor="middle" fill="white" font-size="16">${user.avatar}</text>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20)
          }
        });
        
        mapInstanceRef.current.markers.push(marker);
      });
    }
  }, [mapLoaded, users]);

  // Filtrage utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || user.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Invitation avancée
  const handleInvite = (user) => {
    const message = `Bonjour ${user.name},\n\nJe suis à proximité et j'aimerais partager un café avec toi !\n\n${user.type === 'business' ? 'Pour discuter business' : 'Pour une rencontre amicale'}\n\nÀ bientôt,\nUn utilisateur CatchinCup™`;
    
    // Simuler envoi email
    console.log('Invitation envoyée:', message);
    alert(`Invitation envoyée à ${user.name} !`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header moderne style Base44 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CatchinCup™</h1>
                <p className="text-xs text-gray-500">Le temps d'un café</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                  isAvailable 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isAvailable ? '✓ Disponible' : 'Indisponible'}
              </button>
              
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation moderne */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'discover', label: 'Découvrir', icon: Map },
              { id: 'map', label: 'Carte', icon: Map },
              { id: 'messages', label: 'Messages', icon: Heart },
              { id: 'profile', label: 'Profil', icon: User }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des personnes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtres */}
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
              </button>
              
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous</option>
                <option value="business">☕ Business</option>
                <option value="friendly">☕ Friendly</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {locationLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Localisation en cours...</p>
          </div>
        )}

        {locationError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800">{locationError}</p>
          </div>
        )}

        {!locationLoading && !locationError && (
          <>
            {activeTab === 'discover' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map(user => (
                  <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    {/* Header carte */}
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{user.avatar}</div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <MapPin className="w-3 h-3" />
                              <span>{user.distance}</span>
                              <span>•</span>
                              <span>{user.type === 'business' ? '☕ Business' : '☕ Friendly'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-sm">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-medium">{user.rating}</span>
                          </div>
                          <div className="text-xs text-gray-500">{user.meetups} meetups</div>
                        </div>
                      </div>
                      
                      <p className="mt-3 text-gray-600 text-sm">{user.bio}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="px-6 pb-6">
                      <button
                        onClick={() => handleInvite(user)}
                        className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors transform hover:scale-105"
                      >
                        Inviter pour un café ☕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'map' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div ref={mapRef} className="w-full h-96 lg:h-[600px]"></div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Messages</h3>
                <p className="text-gray-600">Aucun message pour le moment</p>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Profil</h3>
                <p className="text-gray-600">Votre profil sera bientôt disponible</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Barre d'info moderne */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <span className="text-gray-600 flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{filteredUsers.length} personnes</span>
              </span>
              {userLocation && (
                <span className="text-green-600 flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>Position OK</span>
                </span>
              )}
            </div>
            <span className="text-gray-500 text-xs">
              CatchinCup™ • {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
