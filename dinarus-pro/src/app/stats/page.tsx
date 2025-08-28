'use client';

import { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
} from 'chart.js';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

// Fonction pour lancer des confettis
const launchConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};

export default function Stats() {
  // État pour stocker les statistiques
  const [stats, setStats] = useState({
    ventes: {
      total: 0,
      progression: 0,
      objectif: 10000,
      historique: []
    },
    clients: {
      total: 0,
      nouveaux: 0,
      fideles: 0
    },
    produits: {
      populaires: [],
      stock: 0
    },
    recompenses: {
      debloquees: [],
      prochaine: {}
    },
    niveau: 1,
    experience: 0,
    experienceRequise: 1000,
    competences: {
      vente: 65,
      service: 78,
      gestion: 45,
      innovation: 60
    }
  });

  // État pour les animations
  const [showAchievement, setShowAchievement] = useState(false);

  // Simulation de chargement des données
  useEffect(() => {
    // Simulation de l'API
    setTimeout(() => {
      setStats({
        ventes: {
          total: 8750,
          progression: 87.5,
          objectif: 10000,
          historique: [4200, 5100, 6300, 7200, 7900, 8300, 8750]
        },
        clients: {
          total: 124,
          nouveaux: 18,
          fideles: 68
        },
        produits: {
          populaires: [
            { nom: "Café Arabica", ventes: 230 },
            { nom: "Croissant", ventes: 186 },
            { nom: "Pain au chocolat", ventes: 143 },
            { nom: "Sandwich", ventes: 97 },
            { nom: "Jus d'orange", ventes: 85 }
          ],
          stock: 85
        },
        recompenses: {
          debloquees: [
            { titre: "Premier jour", description: "Compléter votre première journée", icone: "🌟" },
            { titre: "50 ventes", description: "Atteindre 50 ventes", icone: "💰" },
            { titre: "Service client", description: "Obtenir 10 avis positifs", icone: "👍" }
          ],
          prochaine: { titre: "Expert en vente", description: "Atteindre 10 000€ de ventes", icone: "🏆", progression: 87.5 }
        },
        niveau: 4,
        experience: 3750,
        experienceRequise: 5000,
        competences: {
          vente: 65,
          service: 78,
          gestion: 45,
          innovation: 60
        }
      });

      // Afficher une animation de récompense
      setTimeout(() => {
        setShowAchievement(true);
        launchConfetti();
      }, 1500);
    }, 800);
  }, []);

  // Données pour le graphique des ventes
  const ventesData = {
    labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Aujourd\'hui'],
    datasets: [
      {
        label: 'Ventes (€)',
        data: stats.ventes.historique,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Données pour le graphique des produits populaires
  const produitsData = {
    labels: stats.produits.populaires.map(p => p.nom),
    datasets: [
      {
        label: 'Nombre de ventes',
        data: stats.produits.populaires.map(p => p.ventes),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Données pour le graphique radar des compétences
  const competencesData = {
    labels: ['Vente', 'Service Client', 'Gestion', 'Innovation'],
    datasets: [
      {
        label: 'Vos compétences',
        data: [
          stats.competences.vente,
          stats.competences.service,
          stats.competences.gestion,
          stats.competences.innovation
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Calculer le pourcentage d'expérience
  const experiencePercent = (stats.experience / stats.experienceRequise) * 100;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-10 text-blue-600">Tableau de Statistiques</h1>

      {/* Carte de profil et niveau */}
      <motion.div 
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-xl p-6 mb-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Félicitations!</h2>
            <p className="text-lg">Vous êtes au niveau {stats.niveau}</p>
          </div>
          <div className="bg-white rounded-full p-4 h-16 w-16 flex items-center justify-center">
            <span className="text-blue-600 text-2xl font-bold">{stats.niveau}</span>
          </div>
        </div>
        
        {/* Barre de progression */}
        <div className="mt-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>{stats.experience} XP</span>
            <span>{stats.experienceRequise} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 bg-opacity-30">
            <div 
              className="bg-yellow-300 h-2.5 rounded-full" 
              style={{ width: `${experiencePercent}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">Encore {stats.experienceRequise - stats.experience} XP pour le niveau suivant</p>
        </div>
      </motion.div>

      {/* Objectif de ventes */}
      <motion.div 
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-4">Objectif de Ventes</h2>
        <div className="flex items-center">
          <div className="flex-1 mr-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{stats.ventes.total}€</span>
              <span className="font-medium">{stats.ventes.objectif}€</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <motion.div 
                className="bg-green-500 h-4 rounded-full flex items-center justify-end pr-2 text-xs text-white font-bold"
                initial={{ width: '0%' }}
                animate={{ width: `${stats.ventes.progression}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {stats.ventes.progression}%
              </motion.div>
            </div>
          </div>
          <div>
            <span className="text-4xl font-bold text-green-500">{stats.ventes.progression}%</span>
          </div>
        </div>
      </motion.div>

      {/* Graphiques statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-4">Évolution des Ventes</h2>
          <Line data={ventesData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-4">Produits Populaires</h2>
          <Doughnut data={produitsData} options={{ responsive: true }} />
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-4">Vos Compétences</h2>
          <Radar data={competencesData} options={{ 
            responsive: true,
            scales: {
              r: {
                min: 0,
                max: 100,
                ticks: {
                  stepSize: 20
                }
              }
            } 
          }} />
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-4">Statistiques Clients</h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-3xl font-bold text-blue-600">{stats.clients.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Nouveaux</p>
              <p className="text-3xl font-bold text-green-600">{stats.clients.nouveaux}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Fidèles</p>
              <p className="text-3xl font-bold text-purple-600">{stats.clients.fideles}</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-bold mb-2">Taux de fidélité</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-purple-500 h-4 rounded-full text-xs text-white flex items-center justify-center"
                style={{ width: `${(stats.clients.fideles / stats.clients.total) * 100}%` }}
              >
                {Math.round((stats.clients.fideles / stats.clients.total) * 100)}%
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Récompenses débloquées */}
      <motion.div 
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h2 className="text-2xl font-bold mb-4">Vos Récompenses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {stats.recompenses.debloquees.map((recompense, index) => (
            <div key={index} className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-center">
              <span className="text-4xl mr-3">{recompense.icone}</span>
              <div>
                <h3 className="font-bold">{recompense.titre}</h3>
                <p className="text-sm text-gray-600">{recompense.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Prochaine récompense */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-4xl mr-3 opacity-70">{stats.recompenses.prochaine.icone}</span>
            <div>
              <h3 className="font-bold">Prochaine récompense: {stats.recompenses.prochaine.titre}</h3>
              <p className="text-sm text-gray-600">{stats.recompenses.prochaine.description}</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-yellow-400 h-2.5 rounded-full" 
              style={{ width: `${stats.recompenses.prochaine.progression}%` }}
            ></div>
          </div>
          <p className="text-right text-sm mt-1">{stats.recompenses.prochaine.progression}%</p>
        </div>
      </motion.div>

      {/* Animation de récompense */}
      {showAchievement && (
        <motion.div 
          className="fixed bottom-4 right-4 bg-gradient-to-r from-yellow-500 to-amber-500 p-4 rounded-lg shadow-lg text-white max-w-md"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => setShowAchievement(false)}
        >
          <div className="flex items-center">
            <div className="mr-3 bg-yellow-300 p-2 rounded-full">
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Progression exceptionnelle !</h3>
              <p>Vous avez augmenté vos ventes de 8% par rapport à la semaine dernière !</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}