/**
 * Utilitaires pour le système de niveaux infinis
 */

// Fonction pour calculer l'XP nécessaire pour atteindre un niveau donné
export const calculateXPForLevel = (level: number): number => {
  // Formule pour progression exponentielle: base + multiplicateur * (niveau^exposant)
  // Cette formule permet une progression de difficulté croissante 
  const baseXP = 300;
  const multiplier = 200;
  const exponent = 1.5;
  
  return Math.round(baseXP + multiplier * Math.pow(level, exponent));
};

// Fonction pour générer le titre du niveau
export const getLevelTitle = (level: number): string => {
  // Les premiers niveaux ont des titres spécifiques
  const specificTitles: Record<number, string> = {
    1: "Débutant",
    2: "Actif",
    3: "Explorateur", 
    4: "Aventurier",
    5: "Expert",
    10: "Maître",
    20: "Champion",
    30: "Étoile montante",
    50: "Légende",
    100: "Immortel"
  };
  
  // Si un titre spécifique existe pour ce niveau, on l'utilise
  if (specificTitles[level]) {
    return specificTitles[level];
  }
  
  // Sinon, on génère un titre dynamique basé sur la plage du niveau
  if (level < 10) return "Explorateur";
  if (level < 20) return "Aventurier";
  if (level < 30) return "Expert";
  if (level < 50) return "Vétéran";
  if (level < 100) return "Élite";
  return "Légende";
};

// Fonction pour générer l'emoji du niveau
export const getLevelEmoji = (level: number): string => {
  // Les premiers niveaux ont des emojis spécifiques
  const specificEmojis: Record<number, string> = {
    1: "🌱",
    2: "⚡",
    3: "🔥", 
    4: "🚀",
    5: "🌟",
    10: "💎",
    20: "👑",
    30: "🏆",
    50: "🌌",
    100: "🌠"
  };
  
  // Si un emoji spécifique existe pour ce niveau, on l'utilise
  if (specificEmojis[level]) {
    return specificEmojis[level];
  }
  
  // Sinon, on alterne entre quelques emojis selon le niveau
  const defaultEmojis = ["🌟", "✨", "🔥", "💫", "⭐", "🏅"];
  return defaultEmojis[level % defaultEmojis.length];
};

// Fonction pour déterminer les avantages d'un niveau
export const getLevelRewards = (level: number): string[] => {
  const baseRewards = [
    "Accès à l'application",
    "Transferts gratuits"
  ];
  
  // Ajouter des avantages spécifiques basés sur le niveau
  if (level >= 2) baseRewards.push("Cashback 2%");
  if (level >= 3) baseRewards.push("Cashback 5%");
  if (level >= 4) baseRewards.push("Priorité support");
  if (level >= 5) baseRewards.push("Cashback 10%");
  if (level >= 10) baseRewards.push("Accès aux missions VIP");
  if (level >= 20) baseRewards.push("Carte physique premium");
  if (level >= 30) baseRewards.push("Conseiller personnel");
  if (level >= 50) baseRewards.push("Privilèges exclusifs");
  if (level >= 100) baseRewards.push("Statut honorifique");
  
  return baseRewards;
};

// Calcule le niveau atteint en fonction du total d'XP
export const calculateLevelFromXP = (totalXP: number): { level: number; xpInCurrentLevel: number; xpToNextLevel: number } => {
  let level = 1;
  let xpRequired = calculateXPForLevel(level);
  
  // Tant que l'utilisateur a assez d'XP pour passer au niveau suivant
  while (totalXP >= xpRequired) {
    level++;
    xpRequired += calculateXPForLevel(level);
  }
  
  // Calcul de l'XP restante dans le niveau actuel
  const previousLevelXP = xpRequired - calculateXPForLevel(level);
  const xpInCurrentLevel = totalXP - previousLevelXP;
  const xpToNextLevel = calculateXPForLevel(level);
  
  return { level, xpInCurrentLevel, xpToNextLevel };
};

// Fonction pour obtenir toutes les données d'un niveau spécifique
export const getLevelData = (level: number) => {
  return {
    level,
    title: getLevelTitle(level),
    emoji: getLevelEmoji(level),
    xp: calculateXPForLevel(level),
    rewards: getLevelRewards(level)
  };
};