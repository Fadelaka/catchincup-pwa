import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Coffee, TrendingUp, Clock } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeToday: 89,
    coffeeShared: 342,
    avgResponseTime: '2.5 min',
    weeklyGrowth: '+12%'
  });

  const [chartData, setChartData] = useState([
    { day: 'Lun', meetups: 12 },
    { day: 'Mar', meetups: 19 },
    { day: 'Mer', meetups: 15 },
    { day: 'Jeu', meetups: 25 },
    { day: 'Ven', meetups: 22 },
    { day: 'Sam', meetups: 18 },
    { day: 'Dim', meetups: 8 }
  ]);

  useEffect(() => {
    // Simuler des données en temps réel
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeToday: prev.activeToday + Math.floor(Math.random() * 3),
        coffeeShared: prev.coffeeShared + Math.floor(Math.random() * 2)
      }));
    }, 30000); // toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actifs aujourd'hui</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeToday}</p>
            </div>
            <Coffee className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cafés partagés</p>
              <p className="text-2xl font-bold text-amber-600">{stats.coffeeShared}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Temps réponse</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgResponseTime}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Activity cette semaine</h3>
          <span className="text-sm text-green-600 font-medium">{stats.weeklyGrowth}</span>
        </div>
        
        <div className="flex items-end space-x-2 h-32">
          {chartData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                style={{ height: `${(data.meetups / 25) * 100}%` }}
              />
              <span className="text-xs text-gray-600 mt-1">{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Emma a invité Lucas pour un café business</span>
            <span className="text-gray-400 text-xs">il y a 2 min</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Nouvel utilisateur inscrit: Marc Bernard</span>
            <span className="text-gray-400 text-xs">il y a 5 min</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-gray-600">Sophie et Marc ont confirmé leur rencontre</span>
            <span className="text-gray-400 text-xs">il y a 12 min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
