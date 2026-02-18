import React from 'react';
import { MapPin, Star, Coffee } from 'lucide-react';

const UserCard = ({ user, onInvite }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all transform hover:-translate-y-1">
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
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
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
          onClick={() => onInvite(user)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-3 font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <Coffee className="w-4 h-4" />
          <span>Inviter pour un café</span>
        </button>
      </div>
    </div>
  );
};

export default UserCard;
