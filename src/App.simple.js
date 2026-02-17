import React, { useState } from 'react';
import { Coffee, MapPin, User, Heart } from 'lucide-react';

function App() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState('map');

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    alert(isAvailable ? 'Plus disponible' : 'Dispo pour 1h !');
  };

  const sendPing = (person) => {
    alert(`☕ ? envoyé à ${person.name} !`);
  };

  const nearbyUsers = [
    { id: 1, name: 'Emma', distance: '200m', type: 'business', avatar: '👩‍💼' },
    { id: 2, name: 'Lucas', distance: '350m', type: 'friendly', avatar: '👨‍🎨' },
    { id: 3, name: 'Sophie', distance: '450m', type: 'business', avatar: '👩‍💻' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-coffee-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
                  ? 'border-coffee-600 text-coffee-600'
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
                  ? 'border-coffee-600 text-coffee-600'
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
                    className="bg-coffee-600 text-white px-6 py-2 rounded-lg font-semibold"
                  >
                    Devenir Dispo
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    {nearbyUsers.length} personnes dispo dans 500m
                  </p>
                  
                  {/* Simple Map */}
                  <div className="relative h-96 bg-gradient-to-br from-coffee-50 to-coffee-100 rounded-lg">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-semibold mt-1">TOI</div>
                    </div>
                    
                    {nearbyUsers.map((user, index) => (
                      <div
                        key={user.id}
                        className="absolute cursor-pointer hover:scale-110 transition-transform"
                        style={{
                          left: `${30 + index * 15}%`,
                          top: `${20 + index * 20}%`
                        }}
                        onClick={() => sendPing(user)}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                          user.type === 'business' ? 'bg-green-500' : 'bg-orange-500'
                        }`}>
                          <span className="text-lg">{user.avatar}</span>
                        </div>
                        <div className="text-xs font-semibold mt-1">{user.distance}</div>
                      </div>
                    ))}
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
