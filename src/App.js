import React, { useState, useEffect, useRef } from 'react';
import { MapPin, User, Clock, Coffee, Navigation, Star, Timer, FootprintsIcon, Car, Train, MessageCircle, Users, UserCheck, X, Check } from 'lucide-react';

function App() {
  // États principaux
  const [userLocation, setUserLocation] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [availabilityTime, setAvailabilityTime] = useState(30);
  const [travelTime, setTravelTime] = useState(15);
  const [travelMode, setTravelMode] = useState('walk');
  const [meetingType, setMeetingType] = useState('friendly');
  const [intention, setIntention] = useState('discussion');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [activeTab, setActiveTab] = useState('discover');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // États pour invitations et messages
  const [invitations, setInvitations] = useState([
    {
      id: 1,
      from: 'Claire Dubois',
      avatar: '👩‍🎨',
      type: 'received',
      intention: 'discussion',
      message: 'Salut ! Ça te dit un café pour parler de créativité ?',
      time: 'il y a 5 min',
      status: 'pending'
    },
    {
      id: 2,
      to: 'Marc Laurent',
      avatar: '👨‍💼',
      type: 'sent',
      intention: 'networking',
      message: 'Intéressé par un échange sur les innovations tech ?',
      time: 'il y a 15 min',
      status: 'accepted'
    }
  ]);

  const [conversations, setConversations] = useState([
    {
      id: 1,
      with: 'Claire Dubois',
      avatar: '👩‍🎨',
      lastMessage: 'Super ! Café Le Central dans 30 min ?',
      time: '14:25',
      unread: 2
    }
  ]);

  // Utilisateurs proches - profils authentiques
  const nearbyUsers = [
    {
      id: 1,
      name: 'Claire Dubois',
      avatar: '👩‍🎨',
      distance: '8 min à pied',
      intention: 'discussion',
      bio: 'Graphiste freelance, passionnée d\'art et de conversations créatives',
      profession: 'Designer Graphique',
      coffeePreference: 'Cappuccino',
      favoritePlace: 'Café Le Central',
      interests: ['Art', 'Design', 'Créativité', 'Photographie'],
      availability: 45,
      rating: 4.8,
      meetups: 12,
      verified: true
    },
    {
      id: 2,
      name: 'Marc Laurent',
      avatar: '👨‍💼',
      distance: '12 min en vélo',
      intention: 'networking',
      bio: 'Consultant tech, toujours partant pour échanger sur les innovations et les startups',
      profession: 'Consultant Technologique',
      coffeePreference: 'Espresso double',
      favoritePlace: 'Café Commerce',
      interests: ['Tech', 'Startups', 'Innovation', 'Business'],
      availability: 30,
      rating: 4.9,
      meetups: 18,
      verified: true
    },
    {
      id: 3,
      name: 'Sophie Martin',
      avatar: '👩‍💻',
      distance: '5 min à pied',
      intention: 'culture',
      bio: 'Développeuse full-stack, aime parler de littérature, voyages et nouvelles technologies',
      profession: 'Développeuse Senior',
      coffeePreference: 'Latte vanille',
      favoritePlace: 'Café Culture',
      interests: ['Littérature', 'Voyages', 'Code', 'Cinéma'],
      availability: 60,
      rating: 4.7,
      meetups: 8,
      verified: false
    },
    {
      id: 4,
      name: 'Thomas Bernard',
      avatar: '👨‍🎓',
      distance: '15 min en transports',
      intention: 'langues',
      bio: 'Étudiant en langues, cherche des partenaires pour pratiquer l\'anglais et l\'espagnol',
      profession: 'Étudiant',
      coffeePreference: 'Thé chai',
      favoritePlace: 'Café Languages',
      interests: ['Langues', 'Voyages', 'Culture', 'Échange'],
      availability: 90,
      rating: 4.6,
      meetups: 5,
      verified: false
    },
    {
      id: 5,
      name: 'Léa Petit',
      avatar: '👩‍🌱',
      distance: '10 min à pied',
      intention: 'découverte',
      bio: 'Yoga teacher, passionnée de bien-être et de rencontres authentiques',
      profession: 'Professeure de Yoga',
      coffeePreference: 'Matcha latte',
      favoritePlace: 'Café Zen',
      interests: ['Yoga', 'Méditation', 'Bien-être', 'Nature'],
      availability: 45,
      rating: 4.9,
      meetups: 22,
      verified: true
    }
  ];

  // Cafés partenaires améliorés
  const partnerCafes = [
    {
      id: 1,
      name: 'Café Le Central',
      discount: '20%',
      rating: 4.8,
      distance: '3 min à pied',
      hasQR: true,
      menu: ['Espresso', 'Cappuccino', 'Latte', 'Croissants', 'Salades'],
      promoCode: 'CATCHIN20',
      featured: true,
      ambiance: 'cosy',
      wifi: true,
      terrace: true
    },
    {
      id: 2,
      name: 'Café Commerce',
      discount: '15%',
      rating: 4.6,
      distance: '8 min à pied',
      hasQR: true,
      menu: ['Cafés spécialisés', 'Smoothies', 'Sandwichs gourmets', 'Pâtisseries'],
      promoCode: 'BUSINESS15',
      featured: false,
      ambiance: 'business',
      wifi: true,
      meetingRoom: true
    },
    {
      id: 3,
      name: 'Café Culture',
      discount: '25%',
      rating: 4.9,
      distance: '12 min en transports',
      hasQR: true,
      menu: ['Cafés du monde', 'Thés artisanaux', 'Livres à échanger', 'Expositions'],
      promoCode: 'CULTURE25',
      featured: true,
      ambiance: 'culturel',
      books: true,
      events: true
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

  // Actions
  const startAvailability = () => {
    setIsAvailable(true);
    setCountdown(availabilityTime);
    setShowOnboarding(false);
  };

  const sendInvitation = (user) => {
    const newInvitation = {
      id: Date.now(),
      to: user.name,
      avatar: user.avatar,
      type: 'sent',
      intention: user.intention,
      message: `Salut ! Ça te dit un café pour ${user.intention === 'discussion' ? 'discuter' : user.intention} ?`,
      time: 'à l\'instant',
      status: 'pending'
    };
    setInvitations([newInvitation, ...invitations]);
    alert(`Invitation envoyée à ${user.name} ! ☕`);
  };

  const respondToInvitation = (invitationId, response) => {
    setInvitations(invitations.map(inv => 
      inv.id === invitationId 
        ? { ...inv, status: response === 'accept' ? 'accepted' : 'declined' }
        : inv
    ));
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

  // Couleurs du thème
  const colors = {
    caramel: '#C4A484',
    espresso: '#3C2415',
    cream: '#FFF8F0',
    gold: '#D4AF37',
    white: '#FFFFFF',
    gray: '#6B7280'
  };

  // Écran d'onboarding
  if (showOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: colors.cream }}>
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full border" style={{ borderColor: colors.caramel }}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `linear-gradient(135deg, ${colors.caramel}, ${colors.espresso})` }}>
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: colors.espresso }}>CatchinCup™</h1>
            <p className="text-gray-600">Le temps d'un café à côté</p>
          </div>

          <div className="space-y-4">
            {/* Type de rencontre */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.espresso }}>Type de rencontre</label>
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

            {/* Intention */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.espresso }}>Intention</label>
              <select
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2"
                style={{ borderColor: colors.caramel, focusRingColor: colors.caramel }}
              >
                <option value="discussion">Discussion</option>
                <option value="networking">Networking</option>
                <option value="culture">Culture</option>
                <option value="langues">Langues</option>
                <option value="découverte">Découverte</option>
              </select>
            </div>

            {/* Durée de disponibilité */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.espresso }}>
                Disponible pendant
              </label>
              <select
                value={availabilityTime}
                onChange={(e) => setAvailabilityTime(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2"
                style={{ borderColor: colors.caramel, focusRingColor: colors.caramel }}
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
              <label className="block text-sm font-medium mb-2" style={{ color: colors.espresso }}>
                Prêt à me déplacer pendant
              </label>
              <div className="flex space-x-2">
                <select
                  value={travelTime}
                  onChange={(e) => setTravelTime(parseInt(e.target.value))}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2"
                  style={{ borderColor: colors.caramel, focusRingColor: colors.caramel }}
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
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2"
                  style={{ borderColor: colors.caramel, focusRingColor: colors.caramel }}
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
              className="w-full text-white rounded-lg py-3 font-medium hover:opacity-90 transition-all transform hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${colors.caramel}, ${colors.espresso})` }}
            >
              Commencer ☕
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Header
  const Header = () => (
    <header className="bg-white shadow-sm border-b">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.caramel }}>
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold" style={{ color: colors.espresso }}>CatchinCup™</span>
          </div>
          
          {isAvailable && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1" style={{ color: colors.caramel }}>
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
  );

  // Navigation
  const Navigation = () => (
    <div className="bg-white border-b">
      <div className="px-4">
        <div className="flex space-x-6">
          {[
            { id: 'discover', label: 'Découvrir', icon: MapPin },
            { id: 'invitations', label: 'Invitations', icon: UserCheck },
            { id: 'messages', label: 'Messages', icon: MessageCircle },
            { id: 'profile', label: 'Profil', icon: User }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
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
  );

  // Page Découvrir
  const DiscoverPage = () => (
    <div className="space-y-4">
      {/* Carte */}
      <div className="relative">
        <div ref={mapRef} className="w-full h-96 rounded-lg overflow-hidden"></div>
        
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
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {intention}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Utilisateurs disponibles */}
      <div>
        <h3 className="text-lg font-semibold mb-3" style={{ color: colors.espresso }}>Personnes disponibles</h3>
        <div className="space-y-3">
          {nearbyUsers.map(user => (
            <div key={user.id} className="bg-white rounded-lg shadow-sm border p-4" style={{ borderColor: colors.caramel }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{user.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium" style={{ color: colors.espresso }}>{user.name}</h4>
                      {user.verified && (
                        <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.gold }}>
                          <Check className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{user.distance} • {user.intention}</p>
                    <p className="text-xs text-gray-400 mt-1">{user.bio}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center space-x-1 text-xs">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span>{user.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">• {user.meetups} meetups</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm" style={{ color: colors.caramel }}>
                    <Timer className="w-3 h-3" />
                    <span>{user.availability} min</span>
                  </div>
                  <button 
                    onClick={() => sendInvitation(user)}
                    className="mt-2 px-3 py-1 text-white text-sm rounded-lg hover:opacity-90 transition-colors"
                    style={{ backgroundColor: colors.caramel }}
                  >
                    Inviter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cafés partenaires */}
      <div>
        <h3 className="text-lg font-semibold mb-3" style={{ color: colors.espresso }}>Cafés partenaires</h3>
        <div className="space-y-3">
          {partnerCafes.map(cafe => (
            <div key={cafe.id} className="bg-white rounded-lg shadow-sm border p-4" style={{ borderColor: colors.caramel }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium" style={{ color: colors.espresso }}>{cafe.name}</h4>
                    {cafe.featured && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colors.gold, color: 'white' }}>
                        ⭐ Partenaire
                      </span>
                    )}
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
                <button className="px-3 py-1 text-sm rounded-lg hover:bg-gray-100 transition-colors" style={{ borderColor: colors.caramel, borderWidth: 1 }}>
                  Voir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Page Invitations
  const InvitationsPage = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: colors.espresso }}>Invitations</h3>
      
      <div className="space-y-3">
        {invitations.map(invitation => (
          <div key={invitation.id} className="bg-white rounded-lg shadow-sm border p-4" style={{ borderColor: colors.caramel }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{invitation.avatar}</div>
                <div>
                  <h4 className="font-medium" style={{ color: colors.espresso }}>
                    {invitation.type === 'received' ? invitation.from : invitation.to}
                  </h4>
                  <p className="text-sm text-gray-500">{invitation.intention} • {invitation.time}</p>
                  <p className="text-sm mt-1">{invitation.message}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {invitation.status === 'pending' && invitation.type === 'received' && (
                  <>
                    <button 
                      onClick={() => respondToInvitation(invitation.id, 'accept')}
                      className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => respondToInvitation(invitation.id, 'decline')}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
                {invitation.status === 'accepted' && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Acceptée</span>
                )}
                {invitation.status === 'declined' && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Déclinée</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Page Messages
  const MessagesPage = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: colors.espresso }}>Conversations</h3>
      
      <div className="space-y-3">
        {conversations.map(conversation => (
          <div key={conversation.id} className="bg-white rounded-lg shadow-sm border p-4 hover:bg-gray-50 transition-colors cursor-pointer" style={{ borderColor: colors.caramel }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{conversation.avatar}</div>
                <div className="flex-1">
                  <h4 className="font-medium" style={{ color: colors.espresso }}>{conversation.with}</h4>
                  <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{conversation.time}</p>
                {conversation.unread > 0 && (
                  <div className="mt-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white" style={{ backgroundColor: colors.caramel }}>
                    {conversation.unread}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Page Profil
  const ProfilePage = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border p-6" style={{ borderColor: colors.caramel }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl" style={{ backgroundColor: colors.cream, border: `2px solid ${colors.caramel}` }}>
            👤
          </div>
          <h3 className="text-xl font-semibold" style={{ color: colors.espresso }}>Mon Profil</h3>
          <p className="text-gray-600">Disponible pour des cafés authentiques</p>
        </div>
        
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.espresso }}>Bio</label>
            <textarea 
              className="w-full px-3 py-2 border rounded-lg resize-none"
              rows={3}
              placeholder="Parlez-nous de vous..."
              style={{ borderColor: colors.caramel }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.espresso }}>Profession</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Votre profession"
              style={{ borderColor: colors.caramel }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.espresso }}>Café préféré</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Votre café préféré"
              style={{ borderColor: colors.caramel }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.espresso }}>Centres d'intérêt</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Séparez par des virgules"
              style={{ borderColor: colors.caramel }}
            />
          </div>
        </div>
        
        <button className="w-full mt-6 text-white rounded-lg py-3 font-medium hover:opacity-90 transition-colors" style={{ backgroundColor: colors.caramel }}>
          Sauvegarder
        </button>
      </div>
      
      {/* Statistiques */}
      <div className="bg-white rounded-lg shadow-sm border p-6" style={{ borderColor: colors.caramel }}>
        <h4 className="font-semibold mb-4" style={{ color: colors.espresso }}>Mes statistiques</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.caramel }}>0</div>
            <p className="text-sm text-gray-600">Cafés partagés</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.caramel }}>0.0</div>
            <p className="text-sm text-gray-600">Note moyenne</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Interface principale
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.cream }}>
      <Header />
      <Navigation />
      
      <main className="px-4 py-4">
        {activeTab === 'discover' && <DiscoverPage />}
        {activeTab === 'invitations' && <InvitationsPage />}
        {activeTab === 'messages' && <MessagesPage />}
        {activeTab === 'profile' && <ProfilePage />}
      </main>
    </div>
  );
}

export default App;
