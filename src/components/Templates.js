import React, { useState } from 'react';
import { Layout, Zap, Users, Coffee, Briefcase, Heart } from 'lucide-react';

const templates = [
  {
    id: 'social-coffee',
    name: 'Social Coffee',
    description: 'Application de rencontre autour du café',
    icon: Coffee,
    color: 'bg-amber-500',
    features: ['Profils utilisateurs', 'Matching', 'Messagerie', 'Carte interactive']
  },
  {
    id: 'business-networking',
    name: 'Business Networking',
    description: 'Réseau professionnel avec cafés',
    icon: Briefcase,
    color: 'bg-blue-500',
    features: ['Profils business', 'Calendrier', 'Salons virtuels', 'Analytics']
  },
  {
    id: 'community-hub',
    name: 'Community Hub',
    description: 'Centre communautaire local',
    icon: Users,
    color: 'bg-green-500',
    features: ['Événements', 'Groupes', 'Forum', 'Ressources']
  },
  {
    id: 'dating-app',
    name: 'Dating App',
    description: 'Application de rencontre romantique',
    icon: Heart,
    color: 'bg-pink-500',
    features: ['Swipe cards', 'Chat vidéo', 'Matching avancé', 'Premium']
  }
];

const Templates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Templates d'applications</h2>
        <p className="text-gray-600">Choisissez un modèle pour démarrer rapidement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`bg-white rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate?.id === template.id ? 'border-blue-500 shadow-lg' : 'border-gray-200'
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="p-6">
              <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center mb-4`}>
                <template.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              
              <div className="space-y-2">
                {template.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs text-gray-500">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Template: {selectedTemplate.name}
              </h3>
              <p className="text-gray-600">{selectedTemplate.description}</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Utiliser ce template</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Fonctionnalités incluses</h4>
              <div className="space-y-2">
                {selectedTemplate.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Personnalisation</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'app</label>
                  <input
                    type="text"
                    defaultValue={selectedTemplate.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Couleur principale</label>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-green-500 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-amber-500 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-pink-500 rounded cursor-pointer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
