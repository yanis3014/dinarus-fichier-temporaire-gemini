'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const InventairePage = () => {
  // Types de commerces et leurs catégories
  const typesDeCommerce = [
    { id: 'boutique', nom: 'Boutique de vêtements', icon: '👕' },
    { id: 'restaurant', nom: 'Restaurant', icon: '🍽️' },
    { id: 'epicerie', nom: 'Épicerie', icon: '🥬' },
    { id: 'coiffeur', nom: 'Salon de coiffure', icon: '💇' },
    { id: 'pharmacie', nom: 'Pharmacie', icon: '💊' },
    { id: 'electronique', nom: 'Électronique', icon: '📱' },
    { id: 'autre', nom: 'Autre commerce', icon: '🏪' }
  ];

  // Emojis par type de commerce
  const emojisParTypeCommerce = {
    boutique: ['📦', '👕', '👖', '👟', '🧢', '🎒', '⌚', '👡'],
    restaurant: ['🍽️', '🍲', '🥤', '🍰', '🍕', '🍗', '🥗', '🍷'],
    epicerie: ['🥬', '🍎', '🥩', '🧀', '🥨', '🍫', '🥖', '🥛'],
    coiffeur: ['💇', '✂️', '💈', '🧴', '💆', '👱', '💅', '🧼'],
    pharmacie: ['💊', '🧴', '🧼', '🩹', '🩺', '🧪', '🧬', '🌡️'],
    electronique: ['📱', '💻', '🎧', '🔌', '📷', '🖨️', '🎮', '🖥️'],
    autre: ['📦', '🏪', '🔧', '📝', '🧰', '📌', '🗂️', '🧹']
  };

  // Catégories par type de commerce
  const categoriesParTypeCommerce = {
    boutique: [
      { id: 'vêtements', nom: 'Vêtements', icon: '👕' },
      { id: 'chaussures', nom: 'Chaussures', icon: '👟' },
      { id: 'accessoires', nom: 'Accessoires', icon: '🎒' }
    ],
    restaurant: [
      { id: 'plats', nom: 'Plats', icon: '🍲' },
      { id: 'boissons', nom: 'Boissons', icon: '🥤' },
      { id: 'desserts', nom: 'Desserts', icon: '🍰' }
    ],
    epicerie: [
      { id: 'fruits_legumes', nom: 'Fruits et légumes', icon: '🍎' },
      { id: 'viandes', nom: 'Viandes', icon: '🥩' },
      { id: 'produits_laitiers', nom: 'Produits laitiers', icon: '🧀' },
      { id: 'epicerie_salee', nom: 'Épicerie salée', icon: '🥨' },
      { id: 'epicerie_sucree', nom: 'Épicerie sucrée', icon: '🍫' }
    ],
    coiffeur: [
      { id: 'prestations', nom: 'Prestations', icon: '✂️' },
      { id: 'produits_capillaires', nom: 'Produits capillaires', icon: '🧴' }
    ],
    pharmacie: [
      { id: 'medicaments', nom: 'Médicaments', icon: '💊' },
      { id: 'parapharmacie', nom: 'Parapharmacie', icon: '🧴' },
      { id: 'hygiene', nom: 'Hygiène', icon: '🧼' }
    ],
    electronique: [
      { id: 'telephones', nom: 'Téléphones', icon: '📱' },
      { id: 'ordinateurs', nom: 'Ordinateurs', icon: '💻' },
      { id: 'accessoires_tech', nom: 'Accessoires', icon: '🎧' }
    ],
    autre: [
      { id: 'produits_divers', nom: 'Produits divers', icon: '📦' },
      { id: 'services', nom: 'Services', icon: '🔧' }
    ]
  };
  // États
  const [filterCategory, setFilterCategory] = useState('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('nom');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('tous');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📦');
  const [customCategories, setCustomCategories] = useState<Record<string, Array<{id: string, nom: string, icon: string}>>>({});
  
  // Charger les catégories personnalisées depuis localStorage au chargement de la page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCategories = localStorage.getItem('dinarypro_custom_categories');
      if (savedCategories) {
        try {
          setCustomCategories(JSON.parse(savedCategories));
        } catch (e) {
          console.error('Erreur lors du chargement des catégories personnalisées:', e);
        }
      }
    }
  }, []);
  
  // Sauvegarder les catégories personnalisées dans localStorage lorsqu'elles changent
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(customCategories).length > 0) {
      localStorage.setItem('dinarypro_custom_categories', JSON.stringify(customCategories));
    }
  }, [customCategories]);

  const [newProduct, setNewProduct] = useState({
    nom: '',
    typeCommerce: 'boutique',
    categorie: 'vêtements',
    prix: 0,
    stock: 0,
    emoji: '📦',
    couleur: 'blue'
  });

  // Données d'exemple pour les produits en inventaire
  const [products, setProducts] = useState([
    {
      id: 1,
      nom: 'T-shirt Premium',
      categorie: 'vêtements',
      prix: 1200,
      stock: 35,
      alerte: false,
      emoji: '👕',
      couleur: 'blue',
      variantes: 3,
      derniereMaj: 'Il y a 2j'
    },
    {
      id: 2,
      nom: 'Sneakers Urban',
      categorie: 'chaussures',
      prix: 3500,
      stock: 12,
      alerte: false,
      emoji: '👟',
      couleur: 'gray',
      variantes: 5,
      derniereMaj: 'Il y a 5j'
    },
    {
      id: 3,
      nom: 'Casquette Logo',
      categorie: 'accessoires',
      prix: 800,
      stock: 8,
      alerte: true,
      emoji: '🧢',
      couleur: 'red',
      variantes: 2,
      derniereMaj: 'Il y a 1j'
    },
    {
      id: 4,
      nom: 'Jeans Slim',
      categorie: 'vêtements',
      prix: 2200,
      stock: 22,
      alerte: false,
      emoji: '👖',
      couleur: 'blue',
      variantes: 4,
      derniereMaj: 'Aujourd\'hui'
    },
    {
      id: 5,
      nom: 'Sac à dos City',
      categorie: 'accessoires',
      prix: 1800,
      stock: 5,
      alerte: true,
      emoji: '🎒',
      couleur: 'red',
      variantes: 2,
      derniereMaj: 'Il y a 3j'
    },
    {
      id: 6,
      nom: 'Montre Classic',
      categorie: 'accessoires',
      prix: 5000,
      stock: 7,
      alerte: true,
      emoji: '⌚',
      couleur: 'red',
      variantes: 1,
      derniereMaj: 'Il y a 1s'
    },
    {
      id: 7,
      nom: 'Sandales Été',
      categorie: 'chaussures',
      prix: 1500,
      stock: 18,
      alerte: false,
      emoji: '👡',
      couleur: 'gray',
      variantes: 3,
      derniereMaj: 'Il y a 6j'
    },
  ]);

  // Afficher une notification
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Fonction pour obtenir la couleur CSS en fonction de l'état du stock
  const getColorClasses = (color: string) => {
    switch(color) {
      case 'red': return { bg: 'bg-red-100', text: 'text-red-600' };
      case 'blue': return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'gray': 
      default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  // Fonction pour obtenir les détails d'une catégorie à partir de son ID
  const getCategoryDetails = (categoryId: string, businessType: string) => {
    // Chercher d'abord dans les catégories standard
    const standardCategories = categoriesParTypeCommerce[businessType as keyof typeof categoriesParTypeCommerce];
    let category = standardCategories.find(cat => cat.id === categoryId);
    
    // Si pas trouvé, chercher dans les catégories personnalisées
    if (!category && customCategories[businessType]) {
      category = customCategories[businessType].find(cat => cat.id === categoryId);
    }
    
    // Si toujours pas trouvé, retourner une catégorie par défaut
    if (!category) {
      return { nom: 'Catégorie inconnue', icon: '❓' };
    }
    
    return category;
  };
  
  // Fonction simplifiée pour obtenir le nom et l'icône d'une catégorie
  const getCategoryNameAndIcon = (categoryId: string) => {
    // Chercher dans toutes les catégories standard de tous les types de commerce
    for (const type in categoriesParTypeCommerce) {
      const category = categoriesParTypeCommerce[type as keyof typeof categoriesParTypeCommerce].find(cat => cat.id === categoryId);
      if (category) {
        return `${category.icon} ${category.nom}`;
      }
    }
    
    // Chercher dans toutes les catégories personnalisées
    for (const type in customCategories) {
      const category = customCategories[type].find(cat => cat.id === categoryId);
      if (category) {
        return `${category.icon} ${category.nom}`;
      }
    }
    
    // Si pas trouvé, retourner juste l'ID
    return categoryId;
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setNewProduct({
      nom: '',
      typeCommerce: 'boutique',
      categorie: 'vêtements',
      prix: 0,
      stock: 0,
      emoji: '📦',
      couleur: 'blue'
    });
    setShowNewCategoryInput(false);
    setNewCategoryName('');
  };
  // Fonction pour ajouter un nouveau produit
  const handleAddProduct = () => {
    if (!newProduct.nom || newProduct.prix <= 0) {
      showNotification('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    const newId = Math.max(...products.map(p => p.id)) + 1;
    const productToAdd = {
      ...newProduct,
      id: newId,
      alerte: newProduct.stock < 10,
      variantes: 1,
      derniereMaj: 'Aujourd\'hui'
    };
    
    setProducts([...products, productToAdd]);
    resetForm();
    setShowAddProductModal(false);
    showNotification('Produit ajouté avec succès !');
  };
  // Fonction pour gérer les changements dans le formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'categorie' && value === 'nouvelle_categorie') {
      setShowNewCategoryInput(true);
      return;
    }
    
    setNewProduct({
      ...newProduct,
      [name]: name === 'prix' || name === 'stock' ? Number(value) : value
    });
  };
  
  // Fonction pour ajouter une nouvelle catégorie
  const handleAddNewCategory = () => {
    if (!newCategoryName.trim()) return;
    
    // Créer un ID unique pour la nouvelle catégorie (basé sur le nom, sans espaces et en minuscules)
    const categoryId = 'custom_' + newCategoryName.trim().toLowerCase().replace(/\s+/g, '_');
    
    // Vérifier si cette catégorie existe déjà
    const currentTypeCategories = customCategories[newProduct.typeCommerce] || [];
    if (currentTypeCategories.some(cat => cat.id === categoryId) || 
        categoriesParTypeCommerce[newProduct.typeCommerce as keyof typeof categoriesParTypeCommerce].some(cat => cat.id === categoryId)) {
      showNotification('Cette catégorie existe déjà');
      return;
    }
    
    // Ajouter la nouvelle catégorie
    const newCategory = { id: categoryId, nom: newCategoryName.trim(), icon: newCategoryIcon };
    
    setCustomCategories(prev => ({
      ...prev,
      [newProduct.typeCommerce]: [...(prev[newProduct.typeCommerce] || []), newCategory]
    }));
    
    // Mettre à jour le produit avec la nouvelle catégorie
    setNewProduct(prev => ({
      ...prev,
      categorie: categoryId
    }));
    
    // Réinitialiser le formulaire de nouvelle catégorie
    setNewCategoryName('');
    setShowNewCategoryInput(false);
    showNotification('Nouvelle catégorie ajoutée !');
  };

  // Ouvrir le modal des détails d'un produit
  const openProductDetail = (product: any) => {
    setSelectedProduct(product);
    setShowProductDetailModal(true);
  };

  // Filtrer les produits selon la catégorie et la recherche
  const filteredProducts = products
    .filter(product => {
      if (activeTab === 'alertes') return product.alerte;
      if (activeTab === 'tous') return true;
      return product.categorie === activeTab;
    })
    .filter(product => 
      searchQuery === '' || 
      product.nom.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Trier les produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'nom':
        return a.nom.localeCompare(b.nom);
      case 'prix':
        return a.prix - b.prix;
      case 'stock':
        return a.stock - b.stock;
      default:
        return 0;
    }
  });

  // Calculer les statistiques
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.alerte).length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalValue = products.reduce((sum, product) => sum + (product.prix * product.stock), 0);

  return (
    <main className="p-4 pb-20 bg-gradient-to-b from-white to-blue-50 min-h-screen">
      {/* Notification */}
      {notification && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-2 rounded-full text-sm shadow-lg animate-fade-in z-50">
          {notification}
        </div>
      )}

      {/* En-tête */}
      <header className="mb-5 relative">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition">
              <span className="text-gray-600">←</span>
            </Link>
            <h1 className="font-bold text-gray-800">Inventaire</h1>
          </div>
          <button 
            onClick={() => setShowInfoModal(true)} 
            className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition"
          >
            ?
          </button>
        </div>
      </header>

      {/* Résumé des statistiques */}
      <section className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              📦
            </div>          <div>
              <p className="text-xs text-gray-500">Total produits</p>
              <p className="font-bold text-lg">{totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              ⚠️
            </div>
            <div>
              <p className="text-xs text-gray-500">Stock faible</p>
              <p className="font-bold text-lg">{lowStockProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              🔢
            </div>
            <div>
              <p className="text-xs text-gray-500">Unités en stock</p>
              <p className="font-bold text-lg">{totalStock}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              💰
            </div>
            <div>
              <p className="text-xs text-gray-500">Valeur totale</p>
              <p className="font-bold text-lg">{totalValue.toLocaleString()} DA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recherche et ajout de produit */}
      <section className="mb-5">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white rounded-lg shadow-sm border border-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-400 text-sm"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <button 
            onClick={() => setShowAddProductModal(true)}
            className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm shadow-sm hover:bg-purple-700 transition flex items-center gap-1"
          >
            <span>+</span> Produit
          </button>
        </div>        {/* Filtres de catégories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          <button 
            onClick={() => setActiveTab('tous')}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
              activeTab === 'tous' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Tous
          </button>
          <button 
            onClick={() => setActiveTab('alertes')}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
              activeTab === 'alertes' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            ⚠️ Alertes ({lowStockProducts})
          </button>
          <button 
            onClick={() => setActiveTab('vêtements')}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
              activeTab === 'vêtements' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            👕 Vêtements
          </button>
          <button 
            onClick={() => setActiveTab('chaussures')}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
              activeTab === 'chaussures' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            👟 Chaussures
          </button>
          <button 
            onClick={() => setActiveTab('accessoires')}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
              activeTab === 'accessoires' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            🎒 Accessoires
          </button>
          
          {/* Afficher les catégories personnalisées dans les filtres */}
          {Object.values(customCategories).flat().map(category => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                activeTab === category.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              {category.icon} {category.nom}
            </button>
          ))}
        </div>
      </section>

      {/* Liste des produits */}
      <section className="mb-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-medium text-gray-700">
            {sortedProducts.length} produits {activeTab !== 'tous' && activeTab !== 'alertes' ? `dans ${activeTab}` : activeTab === 'alertes' ? 'en alerte' : ''}
          </h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg bg-white px-2 py-1"
          >
            <option value="nom">Trier par nom</option>
            <option value="prix">Trier par prix</option>
            <option value="stock">Trier par stock</option>
          </select>
        </div>

        {sortedProducts.length > 0 ? (
          <div className="space-y-2">
            {sortedProducts.map(product => {
              const colorClasses = getColorClasses(product.couleur);
              return (
                <div 
                  key={product.id}
                  onClick={() => openProductDetail(product)}
                  className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between cursor-pointer hover:shadow transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${colorClasses.bg} rounded-full flex items-center justify-center ${colorClasses.text}`}>
                      {product.emoji}
                    </div>                    <div>
                      <p className="font-medium text-gray-800">{product.nom}</p>
                      <div className="text-xs text-gray-500">
                        {getCategoryNameAndIcon(product.categorie)} • {product.stock} en stock
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{product.prix} DA</p>
                    {product.alerte && (
                      <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                        Stock bas
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 mb-2">Aucun produit trouvé</p>
            <p className="text-xs text-gray-400">Modifiez votre recherche ou ajoutez de nouveaux produits</p>
          </div>
        )}
      </section>

      {/* Actions rapides */}
      <section className="mb-5">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Actions rapides</h2>
        <div className="grid grid-cols-3 gap-2">
          <button className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center">
            <span className="text-xl mb-1">📥</span>
            <span className="text-xs">Entrée</span>
          </button>
          <button className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center">
            <span className="text-xl mb-1">📤</span>
            <span className="text-xs">Sortie</span>
          </button>
          <button className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center">
            <span className="text-xl mb-1">📊</span>
            <span className="text-xs">Rapport</span>
          </button>
        </div>
      </section>

      {/* Modal pour ajouter un produit */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Ajouter un produit</h2>
              <button onClick={() => setShowAddProductModal(false)} className="text-gray-400">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                <input
                  type="text"
                  name="nom"
                  value={newProduct.nom}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Ex: T-shirt Premium"
                />
              </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de commerce</label>
                <select
                  name="typeCommerce"
                  value={newProduct.typeCommerce}
                  onChange={(e) => {
                    handleInputChange(e);
                    // Réinitialiser l'interface de nouvelle catégorie
                    setShowNewCategoryInput(false);
                    // Récupérer la première catégorie disponible pour ce type de commerce
                    const nouvelleCategorie = categoriesParTypeCommerce[e.target.value as keyof typeof categoriesParTypeCommerce][0].id;
                    setNewProduct(prev => ({...prev, categorie: nouvelleCategorie}));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  {typesDeCommerce.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.nom}
                    </option>
                  ))}
                </select>
              </div>
                <div>                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                {!showNewCategoryInput ? (
                  <>
                    <select
                      name="categorie"
                      value={newProduct.categorie}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      {categoriesParTypeCommerce[newProduct.typeCommerce as keyof typeof categoriesParTypeCommerce].map(categorie => (
                        <option key={categorie.id} value={categorie.id}>
                          {categorie.icon} {categorie.nom}
                        </option>
                      ))}
                      {customCategories[newProduct.typeCommerce] && 
                        customCategories[newProduct.typeCommerce].map(categorie => (
                          <option key={categorie.id} value={categorie.id}>
                            {categorie.icon} {categorie.nom}
                          </option>
                        ))}
                      <option value="nouvelle_categorie">➕ Ajouter une catégorie</option>
                    </select>
                    
                    <div className="mt-2">
                      <button 
                        type="button"
                        onClick={() => setShowNewCategoryInput(true)}
                        className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
                      >
                        <span>➕</span> Créer une nouvelle catégorie
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        Vous pouvez créer des catégories personnalisées pour ce type de commerce.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-2 rounded-lg mb-2">
                      <p className="text-xs text-blue-700">
                        Vous ajoutez une catégorie personnalisée pour {typesDeCommerce.find(t => t.id === newProduct.typeCommerce)?.nom}.
                        Cette catégorie sera disponible pour tous les produits de ce type de commerce.
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Nom de la catégorie"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <select
                        value={newCategoryIcon}
                        onChange={(e) => setNewCategoryIcon(e.target.value)}
                        className="w-16 px-1 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        {emojisParTypeCommerce[newProduct.typeCommerce as keyof typeof emojisParTypeCommerce].map((emoji, index) => (
                          <option key={index} value={emoji}>{emoji}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setShowNewCategoryInput(false)}
                        className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm"
                      >
                        Annuler
                      </button>
                      <button 
                        type="button"
                        onClick={handleAddNewCategory}
                        className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                        disabled={!newCategoryName.trim()}
                      >
                        Ajouter cette catégorie
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DA)</label>
                  <input
                    type="number"
                    name="prix"
                    value={newProduct.prix}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
                  <select
                    name="emoji"
                    value={newProduct.emoji}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    {emojisParTypeCommerce[newProduct.typeCommerce as keyof typeof emojisParTypeCommerce].map((emoji, index) => (
                      <option key={index} value={emoji}>{emoji}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                  <select
                    name="couleur"
                    value={newProduct.couleur}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="blue">🔵 Bleu</option>
                    <option value="red">🔴 Rouge</option>
                    <option value="gray">⚪ Gris</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-5">
              <button 
                onClick={() => setShowAddProductModal(false)}
                className="w-1/3 py-2 border border-gray-300 rounded-lg text-gray-700"
              >
                Annuler
              </button>
              <button 
                onClick={handleAddProduct}
                className="w-2/3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                disabled={!newProduct.nom || newProduct.prix <= 0}
              >
                Ajouter le produit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détail d'un produit */}
      {showProductDetailModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold">Détails du produit</h2>
              <button onClick={() => setShowProductDetailModal(false)} className="text-gray-400">
                ✕
              </button>
            </div>            <div className="flex items-center gap-4 mb-5">
              <div className={`w-14 h-14 ${getColorClasses(selectedProduct.couleur).bg} rounded-full flex items-center justify-center text-2xl ${getColorClasses(selectedProduct.couleur).text}`}>
                {selectedProduct.emoji}
              </div>              <div>
                <h3 className="font-bold text-lg">{selectedProduct.nom}</h3>
                {/* Afficher le nom et l'icône de la catégorie */}
                <p className="text-sm text-gray-600">
                  {getCategoryNameAndIcon(selectedProduct.categorie)}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between">
                <span className="text-gray-600">Prix</span>
                <span className="font-bold">{selectedProduct.prix} DA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stock</span>
                <span className={`font-bold ${selectedProduct.alerte ? 'text-red-600' : ''}`}>
                  {selectedProduct.stock} unités {selectedProduct.alerte && '⚠️'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Variantes</span>
                <span>{selectedProduct.variantes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dernière mise à jour</span>
                <span>{selectedProduct.derniereMaj}</span>
              </div>
            </div>

            {selectedProduct.alerte && (
              <div className="bg-red-50 p-3 rounded-lg mb-5">
                <div className="flex items-start gap-2 text-red-700">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="font-medium">Alerte de stock</p>
                    <p className="text-sm">Ce produit a un stock faible. Pensez à le réapprovisionner.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 bg-blue-600 text-white rounded-lg">
                Modifier
              </button>
              <button className="py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-200">
                Gérer le stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'information */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-md animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Aide - Inventaire</h2>
              <button onClick={() => setShowInfoModal(false)} className="text-gray-400">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shrink-0">
                  1
                </div>
                <p className="text-sm">Gérez facilement votre stock avec cette interface simplifiée.</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shrink-0">
                  2
                </div>
                <p className="text-sm">Les produits avec un stock faible sont marqués pour vous alerter.</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shrink-0">
                  3
                </div>
                <p className="text-sm">Ajoutez de nouveaux produits en cliquant sur le bouton "Produit".</p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">Une commission Dinary de 1.5% s'applique sur les ventes de vos produits.</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowInfoModal(false)}
              className="w-full mt-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              J'ai compris
            </button>
          </div>
        </div>
      )}
        {/* Les styles d'animation ont été déplacés dans globals.css */}
    </main>
  );
};

export default InventairePage;