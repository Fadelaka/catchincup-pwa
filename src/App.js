import React, { useState, useEffect, useRef } from 'react';
import { MapPin, User, Clock, Coffee, Navigation, Star, Timer, FootprintsIcon, Car, Train } from 'lucide-react';

function App() {
  // États pour ta vision
  const [userLocation, setUserLocation] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [availabilityTime, setAvailabilityTime] = useState(30); // minutes
  const [travelTime, setTravelTime] = useState(15); // minutes
  const [travelMode, setTravelMode] = useState('walk'); // walk, car, transit
  const [meetingType, setMeetingType] = useState('friendly'); // business, friendly
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Utilisateurs proches - selon ta vision
  const nearbyUsers = [
    {
      id: 1,
      name: 'Claire Dubois',
      avatar: '👩‍🎨',
      distance: '8 min à pied',
      intention: 'discussion',
      bio: 'Graphiste, passionnée d\'art et de conversations créatives',
      availability: 45,
      coffeePreference: 'Cappuccino',
      favoritePlace: 'Café Le Central'
    },
    {
      id: 2,
      name: 'Marc Laurent',
      avatar: '👨‍💼',
      distance: '12 min en vélo',
      intention: 'networking',
      bio: 'Consultant tech, toujours partant pour échanger sur les innovations',
      availability: 30,
      coffeePreference: 'Espresso',
      favoritePlace: 'Café Commerce'
    },
    {
      id: 3,
      name: 'Sophie Martin',
      avatar: '👩‍💻',
      distance: '5 min à pied',
      intention: 'culture',
      bio: 'Développeuse, aime parler de littérature et de voyages',
      availability: 60,
      coffeePreference: 'Latte',
      favoritePlace: 'Café Culture'
    }
  ];

  // Cafés partenaires
  const partnerCafes = [
    {
      id: 1,
      name: 'Café Le Central',
      discount: '20%',
      rating: 4.8,
      distance: '3 min à pied',
      hasQR: true,
      menu: 'Espresso, Cappuccino, Latte, Croissants'
    },
    {
      id: 2,
      name: 'Café Commerce',
      discount: '15%',
      rating: 4.6,
      distance: '8 min à pied',
      hasQR: true,
      menu: 'Cafés spécialisés, Salades, Sandwichs'
    }
  ];

  // Géolocalisation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => console.error('Erreur de localisation:', error)
      );
    }
  }, []);

  // Compte à rebours
  useEffect(() => {
    if (isAvailable && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 60000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isAvailable) {
      setIsAvailable(false);
    }
  }, [isAvailable, countdown]);

  // Initialiser Google Maps
  useEffect(() => {
    if (window.google && window.google.maps && userLocation && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 15,
        styles: [
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
        ]
      });
      
      mapInstanceRef.current = map;
    }
  }, [userLocation]);

  // Démarrer la disponibilité
  const startAvailability = () => {
    setIsAvailable(true);
    setCountdown(availabilityTime);
    setShowOnboarding(false);
  };

  // Icônes de transport
  const getTransportIcon = (mode) => {
    switch(mode) {
      case 'walk': return <FootprintsIcon className="w-4 h-4" />;
      case 'car': return <Car className="w-4 h-4" />;
      case 'transit': return <Train className="w-4 h-4" />;
      default: return <FootprintsIcon className="w-4 h-4" />;
    }
  };

  // Écran d'onboarding
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">CatchinCup™</h1>
            <p className="text-gray-600">Le temps d'un café à côté</p>
          </div>

          <div className="space-y-4">
            {/* Type de rencontre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de rencontre</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMeetingType('friendly')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    meetingType === 'friendly' 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">☕</span>
                  <p className="text-sm font-medium">Friendly</p>
                </button>
                <button
                  onClick={() => setMeetingType('business')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    meetingType === 'business' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">💼</span>
                  <p className="text-sm font-medium">Business</p>
                </button>
              </div>
            </div>

            {/* Durée de disponibilité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponible pendant
              </label>
              <select
                value={availabilityTime}
                onChange={(e) => setAvailabilityTime(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 heure</option>
                <option value={120}>2 heures</option>
              </select>
            </div>

            {/* Temps de trajet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prêt à me déplacer pendant
              </label>
              <div className="flex space-x-2">
                <select
                  value={travelTime}
                  onChange={(e) => setTravelTime(parseInt(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value={5}>5 min</option>
                  <option value={10}>10 min</option>
                  <option value={15}>15 min</option>
                  <option value={20}>20 min</option>
                  <option value={30}>30 min</option>
                </select>
                <select
                  value={travelMode}
                  onChange={(e) => setTravelMode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="walk">à pied</option>
                  <option value="transit">transports</option>
                  <option value="car">voiture</option>
                </select>
              </div>
            </div>

            {/* Bouton démarrer */}
            <button
              onClick={startAvailability}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg py-3 font-medium hover:from-orange-600 hover:to-amber-700 transition-all transform hover:scale-105"
            >
              Commencer ☕
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Interface principale
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec compte à rebours */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coffee className="w-6 h-6 text-orange-600" />
              <span className="text-lg font-bold text-gray-900">CatchinCup™</span>
            </div>
            
            {isAvailable && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 text-orange-600">
                  <Timer className="w-4 h-4" />
                  <span className="font-medium">{countdown} min</span>
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Disponible</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Carte principale */}
      <div className="relative">
        <div ref={mapRef} className="w-full h-96"></div>
        
        {/* Filtres sur la carte */}
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-white rounded-lg shadow-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getTransportIcon(travelMode)}
                <span className="text-sm font-medium">{travelTime} min</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  meetingType === 'friendly' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {meetingType === 'friendly' ? '☕ Friendly' : '💼 Business'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Utilisateurs disponibles */}
      <div className="px-4 py-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Personnes disponibles</h3>
        <div className="space-y-3">
          {nearbyUsers.map(user => (
            <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{user.avatar}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-500">{user.distance} • {user.intention}</p>
                    <p className="text-xs text-gray-400 mt-1">{user.bio}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm text-orange-600">
                    <Timer className="w-3 h-3" />
                    <span>{user.availability} min</span>
                  </div>
                  <button className="mt-2 px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors">
                    Inviter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cafés partenaires */}
      <div className="px-4 py-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Cafés partenaires</h3>
        <div className="space-y-3">
          {partnerCafes.map(cafe => (
            <div key={cafe.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{cafe.name}</h4>
                    {cafe.hasQR && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">QR</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{cafe.distance} • -{cafe.discount}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">{cafe.rating}</span>
                  </div>
                </div>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                  Voir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
