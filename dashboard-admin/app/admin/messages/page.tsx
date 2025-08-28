'use client'

import { useState } from 'react';
import { 
  MessageSquare, Search, Users, Send, 
  Paperclip, Smile, MoreVertical, Phone,
  Video, Info, ArrowDown, Clock, UserPlus,
  ChevronDown, ChevronRight, CheckCircle
} from 'lucide-react';

// Données fictives pour la messagerie
const conversations = [
  {
    id: "c001",
    user: {
      id: "u001",
      name: "Sophie Martin",
      avatar: "",
      status: "online",
      lastSeen: new Date(),
    },
    messages: [
      {
        id: "m001",
        senderId: "u001",
        content: "Bonjour, j'ai une question concernant mon compte.",
        timestamp: "2023-05-13T14:32:00",
        read: true,
      },
      {
        id: "m002",
        senderId: "admin",
        content: "Bonjour Sophie, comment puis-je vous aider ?",
        timestamp: "2023-05-13T14:33:00",
        read: true,
      },
      {
        id: "m003",
        senderId: "u001",
        content: "Je n'arrive pas à effectuer un retrait vers mon compte bancaire.",
        timestamp: "2023-05-13T14:34:00",
        read: true,
      },
      {
        id: "m004",
        senderId: "admin",
        content: "Je comprends. Pouvez-vous me donner plus de détails sur l'erreur que vous rencontrez ?",
        timestamp: "2023-05-13T14:35:00",
        read: true,
      },
      {
        id: "m005",
        senderId: "u001",
        content: "J'obtiens un message d'erreur indiquant 'Information de compte invalide'.",
        timestamp: "2023-05-13T14:36:00",
        read: true,
      },
    ],
    unreadCount: 0,
  },
  {
    id: "c002",
    user: {
      id: "u004",
      name: "Lucas Petit",
      avatar: "",
      status: "offline",
      lastSeen: new Date("2023-05-13T10:15:00"),
    },
    messages: [
      {
        id: "m006",
        senderId: "u004",
        content: "Bonjour, je souhaiterais devenir commerçant partenaire.",
        timestamp: "2023-05-12T09:45:00",
        read: true,
      },
      {
        id: "m007",
        senderId: "admin",
        content: "Bonjour Lucas, merci pour votre intérêt ! Quels types de produits ou services proposez-vous ?",
        timestamp: "2023-05-12T09:50:00",
        read: true,
      },
      {
        id: "m008",
        senderId: "u004",
        content: "Je gère une boulangerie-pâtisserie dans le 15ème arrondissement de Paris.",
        timestamp: "2023-05-12T09:52:00",
        read: true,
      },
    ],
    unreadCount: 0,
  },
  {
    id: "c003",
    user: {
      id: "u007",
      name: "Camille Dubois",
      avatar: "",
      status: "away",
      lastSeen: new Date("2023-05-13T13:20:00"),
    },
    messages: [
      {
        id: "m009",
        senderId: "u007",
        content: "Bonjour, j'ai un problème avec mon dernier paiement.",
        timestamp: "2023-05-13T11:23:00",
        read: false,
      },
      {
        id: "m010",
        senderId: "u007",
        content: "Le montant ne correspond pas à ce que j'ai payé en magasin.",
        timestamp: "2023-05-13T11:24:00",
        read: false,
      },
    ],
    unreadCount: 2,
  },
  {
    id: "c004",
    user: {
      id: "m002",
      name: "Boulangerie St Michel",
      avatar: "",
      status: "online",
      lastSeen: new Date(),
      isBusiness: true,
    },
    messages: [
      {
        id: "m011",
        senderId: "m002",
        content: "Bonjour, nous avons besoin d'aide pour configurer notre nouveau terminal.",
        timestamp: "2023-05-13T15:10:00",
        read: false,
      },
    ],
    unreadCount: 1,
  }
];

// Fonction pour formater la date
const formatMessageTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Aujourd'hui, montrer uniquement l'heure
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    // Hier
    return `Hier ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays < 7) {
    // Cette semaine
    return date.toLocaleDateString('fr-FR', { weekday: 'long' });
  } else {
    // Plus d'une semaine
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }
};

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeConversation, setActiveConversation] = useState(conversations[0].id);
  const [newMessage, setNewMessage] = useState('');
  const [filteredConversations, setFilteredConversations] = useState(conversations);
  
  // Filtrer les conversations
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(
        conv => conv.user.name.toLowerCase().includes(term)
      );
      setFilteredConversations(filtered);
    }
  };
  
  // Obtenir la conversation active
  const currentConversation = conversations.find(conv => conv.id === activeConversation);
  
  // Envoyer un nouveau message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    // Dans un vrai cas, nous enverrions le message au backend
    console.log(`Sending message to ${currentConversation.user.name}: ${newMessage}`);
    
    // Réinitialiser le champ de saisie
    setNewMessage('');
  };
  
  return (
    <div className="flex h-[calc(100vh-64px)] -mx-6 -mb-6 overflow-hidden">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r bg-white flex flex-col">
        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:border-dinary-turquoise focus:outline-none text-sm"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Aucune conversation trouvée.
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                  conv.id === activeConversation ? 'bg-dinary-turquoise/10 border-l-4 border-l-dinary-turquoise' : ''
                }`}
                onClick={() => setActiveConversation(conv.id)}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                      {conv.user.name.charAt(0)}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      conv.user.status === 'online' ? 'bg-green-500' :
                      conv.user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900">{conv.user.name}</h3>
                        {conv.user.isBusiness && (
                          <span className="ml-1.5 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">
                            Pro
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {conv.messages.length > 0 ? formatMessageTime(conv.messages[conv.messages.length - 1].timestamp) : ''}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 truncate w-40">
                        {conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].content : 'Nouvelle conversation'}
                      </p>
                      
                      {conv.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-dinary-turquoise text-white text-xs">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* New Conversation Button */}
        <div className="p-4 border-t">
          <button className="btn-primary w-full flex items-center justify-center">
            <MessageSquare size={16} className="mr-2" /> Nouvelle conversation
          </button>
        </div>
      </div>
      
      {/* Main Content - Chat */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b bg-white flex items-center justify-between px-4">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    {currentConversation.user.name.charAt(0)}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    currentConversation.user.status === 'online' ? 'bg-green-500' :
                    currentConversation.user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                
                <div className="ml-3">
                  <h3 className="text-sm font-medium">{currentConversation.user.name}</h3>
                  <p className="text-xs text-gray-500">
                    {currentConversation.user.status === 'online' 
                      ? 'En ligne'
                      : currentConversation.user.status === 'away'
                      ? 'Absent(e)'
                      : `Dernière connexion ${formatMessageTime(currentConversation.user.lastSeen)}`
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                  <Phone size={18} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                  <Video size={18} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                  <Info size={18} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {currentConversation.messages.map((message, index) => {
                const isAdmin = message.senderId === 'admin';
                const previousMessage = index > 0 ? currentConversation.messages[index - 1] : null;
                const showSenderInfo = !previousMessage || previousMessage.senderId !== message.senderId;
                
                return (
                  <div 
                    key={message.id} 
                    className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} mb-3`}
                  >
                    {!isAdmin && showSenderInfo && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-2">
                        {currentConversation.user.name.charAt(0)}
                      </div>
                    )}
                    
                    <div className={`max-w-[70%] ${!isAdmin && !showSenderInfo ? 'ml-10' : ''}`}>
                      {showSenderInfo && (
                        <div className={`flex items-center mb-1 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-xs font-medium text-gray-500">
                            {isAdmin ? 'Vous' : currentConversation.user.name}
                          </span>
                          <span className="text-xs text-gray-400 ml-2">
                            {formatMessageTime(message.timestamp)}
                          </span>
                        </div>
                      )}
                      
                      <div 
                        className={`rounded-lg py-2 px-3 inline-block ${
                          isAdmin 
                            ? 'bg-dinary-turquoise text-white' 
                            : 'bg-white text-gray-800 border'
                        }`}
                      >
                        {message.content}
                      </div>
                      
                      {isAdmin && (
                        <div className="flex justify-end mt-1">
                          {message.read ? (
                            <CheckCircle size={14} className="text-dinary-turquoise" />
                          ) : (
                            <Clock size={14} className="text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Input Area */}
            <div className="border-t bg-white p-4">
              <form onSubmit={handleSendMessage} className="flex items-end">
                <button type="button" className="text-gray-400 hover:text-gray-600 mr-2">
                  <Paperclip size={20} />
                </button>
                
                <div className="flex-1 border rounded-lg focus-within:border-dinary-turquoise focus-within:ring-1 focus-within:ring-dinary-turquoise">
                  <textarea
                    className="w-full px-3 py-2 focus:outline-none rounded-lg resize-none"
                    placeholder="Écrivez votre message..."
                    rows={3}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="ml-2 flex items-center">
                  <button type="button" className="text-gray-400 hover:text-gray-600 mr-2">
                    <Smile size={20} />
                  </button>
                  
                  <button
                    type="submit"
                    className={`p-2 rounded-full ${
                      newMessage.trim() === '' 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-dinary-turquoise text-white'
                    }`}
                    disabled={newMessage.trim() === ''}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <MessageSquare size={64} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500">Sélectionnez une conversation</h3>
            <p className="text-sm text-gray-400 mt-2">
              Choisissez une conversation dans la liste ou créez-en une nouvelle.
            </p>
          </div>
        )}
      </div>
      
      {/* Info Panel - Optional */}
      <div className="w-64 border-l bg-white hidden lg:block p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Informations</h3>
        
        {currentConversation && (
          <div>
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-medium mb-2">
                {currentConversation.user.name.charAt(0)}
              </div>
              <h3 className="font-medium">{currentConversation.user.name}</h3>
              <p className="text-xs text-gray-500">ID: {currentConversation.user.id}</p>
            </div>
            
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Actions</h4>
                <div className="space-y-2">
                  <button className="btn-secondary w-full flex items-center justify-center text-xs py-1.5">
                    <UserPlus size={14} className="mr-1.5" />
                    Ajouter à un groupe
                  </button>
                  <button className="btn-secondary w-full flex items-center justify-center text-xs py-1.5">
                    <Info size={14} className="mr-1.5" />
                    Voir le profil
                  </button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Fichiers partagés</h4>
                <div className="text-xs text-gray-500 text-center py-2">
                  Aucun fichier partagé
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase mb-2">
                  <span>Étiquettes</span>
                  <button className="text-dinary-turquoise">Ajouter</button>
                </h4>
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Support
                  </span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
