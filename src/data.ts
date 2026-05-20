import { Card, CardType, UserProgress, MarketItem, TradeOffer, LeaderboardUser } from "./types";

// Static premium database of standard and legendary cards
export const STATIC_CARDS: Card[] = [
  {
    id: "leg-ronaldinho",
    name: "Ronaldinho",
    position: "LW",
    nationality: "Brazil",
    club: "Samba Kings",
    rating: 93,
    cardType: "Retro Legend",
    isHolographic: true,
    isCustom: false,
    stats: { pace: 92, shooting: 90, passing: 91, dribbling: 95, defending: 38, physical: 79 },
    specialPower: "Joga Bonito",
    powerDescription: "Triggers an impossible elastic-dribble that temporarily freezes defensive players.",
    shortBio: "Known worldwide for his infectious smile, mind-bending flair, and spellbinding Samba rhythm on the ball."
  },
  {
    id: "leg-messi",
    name: "Lionel Messi",
    position: "RW",
    nationality: "Argentina",
    club: "Miami Pink",
    rating: 92,
    cardType: "Retro Legend",
    isHolographic: true,
    isCustom: false,
    stats: { pace: 89, shooting: 92, passing: 93, dribbling: 96, defending: 35, physical: 65 },
    specialPower: "Ankara Slalom",
    powerDescription: "Weaves past opponents with micro-touches that break typical spatial physics.",
    shortBio: "Considered by many as the greatest of all time. A magician of close control, vision, and dead-ball accuracy."
  },
  {
    id: "leg-ronaldo",
    name: "Cristiano Ronaldo",
    position: "ST",
    nationality: "Portugal",
    club: "Al-Desert",
    rating: 91,
    cardType: "Retro Legend",
    isHolographic: true,
    isCustom: false,
    stats: { pace: 90, shooting: 93, passing: 81, dribbling: 88, defending: 35, physical: 88 },
    specialPower: "Siuuu Header",
    powerDescription: "Launches himself 2.5 meters in the air, defying gravity for bullet header strikes.",
    shortBio: "A model of peerless work ethic and lethal physical athleticism. Football's ultimate goalscoring force."
  },
  {
    id: "leg-zidane",
    name: "Zinedine Zidane",
    position: "CAM",
    nationality: "France",
    club: "Dynamo Retro",
    rating: 94,
    cardType: "Retro Legend",
    isHolographic: true,
    isCustom: false,
    stats: { pace: 83, shooting: 88, passing: 95, dribbling: 94, defending: 65, physical: 84 },
    specialPower: "Roulette Masterclass",
    powerDescription: "Performs spin-turns that pull two midfeilders out of position synchronously.",
    shortBio: "A majestic conductor with elegant control, visual awareness, and famous match-winning prowess in crucial finals."
  },
  {
    id: "leg-yashin",
    name: "Lev Yashin",
    position: "GK",
    nationality: "Russia",
    club: "Standard Moscow",
    rating: 92,
    cardType: "Retro Legend",
    isHolographic: false,
    isCustom: false,
    stats: { pace: 90, shooting: 45, passing: 78, dribbling: 75, defending: 93, physical: 90 },
    specialPower: "Black Spider Shield",
    powerDescription: "Fully seals the top-left and top-right areas of the goal frame with an invisible barrier.",
    shortBio: "The only goalkeeper to ever win the Ballon d'Or. Famously played clad in black, dominating the entire eighteen-yard box."
  },
  {
    id: "fut-haaland",
    name: "Erling Haaland",
    position: "ST",
    nationality: "Norway",
    club: "Blue Moon FC",
    rating: 92,
    cardType: "Futuristic Icon",
    isHolographic: true,
    isCustom: false,
    stats: { pace: 94, shooting: 93, passing: 66, dribbling: 81, defending: 45, physical: 91 },
    specialPower: "Quantum Strike",
    powerDescription: "Unleashes supersonic attempts with a 99% trajectory velocity parameter.",
    shortBio: "A cybernetic scoring phenomenon programmed to break records. Possesses pure explosive strength."
  },
  {
    id: "std-mbappe",
    name: "Kylian Mbappé",
    position: "LW",
    nationality: "France",
    club: "Paris Galaxy",
    rating: 91,
    cardType: "Rare gold",
    isHolographic: false,
    isCustom: false,
    stats: { pace: 97, shooting: 89, passing: 80, dribbling: 91, defending: 36, physical: 78 },
    specialPower: "Searing Warp Sprint",
    powerDescription: "Gains instantaneous maximum acceleration parameter, breezing past full-backs.",
    shortBio: "A lightning-fast modern winger capable of shifting gears in milliseconds, possessing clinical ice-cold finishing."
  },
  {
    id: "std-de-bruyne",
    name: "Kevin De Bruyne",
    position: "CM",
    nationality: "Belgium",
    club: "Blue Moon FC",
    rating: 90,
    cardType: "Standard Gold",
    isHolographic: false,
    isCustom: false,
    stats: { pace: 72, shooting: 82, passing: 93, dribbling: 87, defending: 65, physical: 78 },
    specialPower: "GPS Diagonal Cross",
    powerDescription: "Lobs standard balls that calculate coordinates perfectly to bypass defensive blocks.",
    shortBio: "The ultimate passing wizard. Generates impossible angles and makes defense-splitting efforts look effortless."
  },
  {
    id: "std-bellingham",
    name: "Jude Bellingham",
    position: "CAM",
    nationality: "England",
    club: "Royal White",
    rating: 89,
    cardType: "Standard Gold",
    isHolographic: false,
    isCustom: false,
    stats: { pace: 79, shooting: 84, passing: 83, dribbling: 88, defending: 78, physical: 85 },
    specialPower: "Galactic Engine",
    powerDescription: "Restores stamina params of all friendly midfielders by 25 points at half-time.",
    shortBio: "A complete modern player with maturity beyond years. Dominates box-to-box with energy and poise."
  },
  {
    id: "std-van-dijk",
    name: "Virgil van Dijk",
    position: "CB",
    nationality: "Netherlands",
    club: "Anfield Red",
    rating: 89,
    cardType: "Standard Gold",
    isHolographic: false,
    isCustom: false,
    stats: { pace: 78, shooting: 60, passing: 71, dribbling: 72, defending: 89, physical: 86 },
    specialPower: "The Leviathan Tackle",
    powerDescription: "Instantly dispossesses any attacker who ventures within a 3-yard diameter of the goalie box.",
    shortBio: "A towering defensive colossus whose anticipation and calm authority make attackers rethink their strategies."
  },
  {
    id: "std-bana-gk",
    name: "Yassine Bounou",
    position: "GK",
    nationality: "Morocco",
    club: "Desert Eagles",
    rating: 85,
    cardType: "Standard Silver",
    isHolographic: false,
    isCustom: false,
    stats: { pace: 58, shooting: 30, passing: 70, dribbling: 68, defending: 85, physical: 82 },
    specialPower: "Miracle Reflex",
    powerDescription: "Guarantees a point-blank punch-out when facing a direct shot.",
    shortBio: "A calm, highly agile shot-stopper celebrated for his historic heroics on international sport stages."
  },
  {
    id: "std-yamal",
    name: "Lamine Yamal",
    position: "RW",
    nationality: "Spain",
    club: "Blaugrana FC",
    rating: 82,
    cardType: "Standard Silver",
    isHolographic: false,
    isCustom: false,
    stats: { pace: 85, shooting: 74, passing: 78, dribbling: 86, defending: 32, physical: 55 },
    specialPower: "Catalan Wave",
    powerDescription: "Dribbles inside with high finesse, triggering an early curling attempt parameter.",
    shortBio: "A phenomenal young prodigy breaking age records. Noted for his incredible balance and vision."
  },
  {
    id: "std-saka",
    name: "Bukayo Saka",
    position: "RM",
    nationality: "England",
    club: "London Gunners",
    rating: 87,
    cardType: "Standard Gold",
    isHolographic: false,
    isCustom: false,
    stats: { pace: 86, shooting: 81, passing: 82, dribbling: 87, defending: 46, physical: 68 },
    specialPower: "Hale End Magic",
    powerDescription: "Performs quick overlaps that raise offensive crossing ratings by 10%.",
    shortBio: "London's favorite winger, renowned for his work rate, positive influence, and outstanding cut-backs."
  },
  {
    id: "std-valverde",
    name: "Federico Valverde",
    position: "CM",
    nationality: "Uruguay",
    club: "Royal White",
    rating: 88,
    cardType: "Standard Gold",
    isHolographic: false,
    isCustom: false,
    stats: { pace: 88, shooting: 82, passing: 84, dribbling: 83, defending: 80, physical: 88 },
    specialPower: "Falcon Blast",
    powerDescription: "Fires incredibly strong long-range strikes from deep midfield coordinates.",
    shortBio: "An energetic workhorse carrying endless stamina. Equipped with a terrifying rocket of a shot."
  },
  {
    id: "std-davies",
    name: "Alphonso Davies",
    position: "LB",
    nationality: "Canada",
    club: "Mighty Munich",
    rating: 84,
    cardType: "Standard Silver",
    isHolographic: false,
    isCustom: false,
    stats: { pace: 95, shooting: 66, passing: 77, dribbling: 84, defending: 76, physical: 77 },
    specialPower: "Roadrunner Dash",
    powerDescription: "Blazes up and down the flank, recovering defensive coordinates instantly if caught upfield.",
    shortBio: "An unbelievably fast full-back, famous for turning recovery tackles into dynamic offensive counters."
  },
  {
    id: "std-saliba",
    name: "William Saliba",
    position: "CB",
    nationality: "France",
    club: "London Gunners",
    rating: 86,
    cardType: "Standard Gold",
    isHolographic: false,
    isCustom: false,
    stats: { pace: 82, shooting: 40, passing: 75, dribbling: 78, defending: 87, physical: 84 },
    specialPower: "Rolls-Royce Guard",
    powerDescription: "Gently disarms incoming pressure without committing foul parameters.",
    shortBio: "A central defender known for extreme composure, exceptional positioning, and smooth transition passes."
  }
];

// Pack opening configs
export interface PackType {
  id: string;
  name: string;
  description: string;
  coinCost: number;
  gemCost: number;
  containsCount: number;
  bannerColor: string;
  isSpecialEvent?: boolean;
}

export const PACKS: PackType[] = [
  {
    id: "starter-pack",
    name: "Starter Pack",
    description: "Welcome pack to seed your collection! Free test pack.",
    coinCost: 0,
    gemCost: 0,
    containsCount: 4,
    bannerColor: "from-zinc-100 to-zinc-300 border-zinc-400 text-zinc-900"
  },
  {
    id: "standard-gold",
    name: "Standard Pack",
    description: "A solid pack containing gold and silver items. Chance for Holographics.",
    coinCost: 1000,
    gemCost: 0,
    containsCount: 5,
    bannerColor: "from-amber-200 via-yellow-300 to-amber-500 border-yellow-400 text-amber-950"
  },
  {
    id: "mega-rare",
    name: "Mega Rare Pack",
    description: "High chance of pulling Rare Gold elite cards and Holographic legends.",
    coinCost: 2500,
    gemCost: 40,
    containsCount: 5,
    bannerColor: "from-fuchsia-400 via-pink-500 to-indigo-600 border-pink-400 text-white"
  },
  {
    id: "cyber-event",
    name: "Cyber Event Pack",
    description: "Special event! Contains Futuristic Icons, Retro Legends, and high Holo rates.",
    coinCost: 5000,
    gemCost: 90,
    containsCount: 5,
    bannerColor: "from-cyan-300 via-teal-400 to-emerald-500 border-cyan-400 text-cyan-950",
    isSpecialEvent: true
  },
  {
    id: "holo-master",
    name: "100% Holo Pack",
    description: "Guaranteed all cards are premium Holographics with 85+ Ratings!",
    coinCost: 12000,
    gemCost: 220,
    containsCount: 4,
    bannerColor: "from-indigo-300 via-purple-400 to-pink-400 border-indigo-400 animate-pulse text-indigo-950"
  }
];

// Probabilistic logic to generate an individual card for a pack
function generateRandomCard(packId: string): Card {
  // Determine CardType chances based on pack ID
  let types: CardType[] = ["Standard Silver", "Standard Gold"];
  let probabilities = [0.65, 0.35]; // Defaults for Silver/Gold
  let holoChance = 0.05;
  let ratingBoost = 0;

  if (packId === "starter-pack") {
    types = ["Standard Silver", "Standard Gold"];
    probabilities = [0.4, 0.6];
    holoChance = 0.1;
  } else if (packId === "standard-gold") {
    types = ["Standard Silver", "Standard Gold", "Rare gold"];
    probabilities = [0.45, 0.45, 0.10];
    holoChance = 0.08;
  } else if (packId === "mega-rare") {
    types = ["Standard Gold", "Rare gold", "Retro Legend", "Futuristic Icon"];
    probabilities = [0.35, 0.45, 0.12, 0.08];
    holoChance = 0.25;
    ratingBoost = 2;
  } else if (packId === "cyber-event") {
    types = ["Rare gold", "Retro Legend", "Futuristic Icon"];
    probabilities = [0.4, 0.3, 0.3];
    holoChance = 0.45;
    ratingBoost = 3;
  } else if (packId === "holo-master") {
    types = ["Rare gold", "Retro Legend", "Futuristic Icon"];
    probabilities = [0.3, 0.35, 0.35];
    holoChance = 1.0; // Guaranteed
    ratingBoost = 5;
  }

  // Draw type
  const roll = Math.random();
  let cumulative = 0;
  let chosenType: CardType = "Standard Gold";
  for (let i = 0; i < types.length; i++) {
    cumulative += probabilities[i];
    if (roll <= cumulative) {
      chosenType = types[i];
      break;
    }
  }

  // Filter static card templates matching chosen type or general pool
  const matches = STATIC_CARDS.filter(c => c.cardType === chosenType);
  let template = matches.length > 0 
    ? matches[Math.floor(Math.random() * matches.length)] 
    : STATIC_CARDS[Math.floor(Math.random() * STATIC_CARDS.length)];

  // Create a customized unique instance (prevents duplicated references in player collection)
  const isHolo = Math.random() <= holoChance;
  const ratingVal = Math.min(99, Math.max(70, template.rating + ratingBoost + (isHolo ? 2 : 0)));

  // Introduce status multipliers for stat metrics
  const multiplier = ratingVal / template.rating;

  return {
    ...template,
    id: `${template.id}-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    rating: ratingVal,
    isHolographic: isHolo,
    stats: {
      pace: Math.min(99, Math.round(template.stats.pace * multiplier)),
      shooting: Math.min(99, Math.round(template.stats.shooting * multiplier)),
      passing: Math.min(99, Math.round(template.stats.passing * multiplier)),
      dribbling: Math.min(99, Math.round(template.stats.dribbling * multiplier)),
      defending: Math.min(99, Math.round(template.stats.defending * multiplier)),
      physical: Math.min(99, Math.round(template.stats.physical * multiplier)),
    }
  };
}

// Function to open a specific pack and return items
export function openPack(packId: string): Card[] {
  const pack = PACKS.find(p => p.id === packId);
  if (!pack) return [];
  
  const cards: Card[] = [];
  for (let i = 0; i < pack.containsCount; i++) {
    cards.push(generateRandomCard(packId));
  }
  return cards;
}

// Simulated active marketplace listings
export const INITIAL_SIMULATED_MARKET: MarketItem[] = [
  {
    id: "mkt-1",
    card: {
      id: "sim-1",
      name: "Marcus Rashford",
      position: "LW",
      nationality: "England",
      club: "Manchester Red",
      rating: 84,
      cardType: "Standard Gold",
      isHolographic: false,
      isCustom: false,
      stats: { pace: 89, shooting: 82, passing: 78, dribbling: 83, defending: 41, physical: 74 },
      specialPower: "Rocket Shot",
      powerDescription: "Unleashes rapid knuckling ball trajectories that baffle defense coordinates."
    },
    sellerName: "GamerPro88",
    price: 350,
    currency: "coins",
    isSimulated: true
  },
  {
    id: "mkt-2",
    card: {
      id: "sim-2",
      name: "Cyber Neymar",
      position: "LW",
      nationality: "Brazil",
      club: "Neon Santos",
      rating: 89,
      cardType: "Futuristic Icon",
      isHolographic: true,
      isCustom: true,
      stats: { pace: 91, shooting: 85, passing: 88, dribbling: 94, defending: 36, physical: 68 },
      specialPower: "Hologram Flip",
      powerDescription: "Simulates multiple trajectory copies, hiding the real ball coordinate.",
      shortBio: "An AI-guided custom wonder of Brazilian heritage, utilizing neon projections to dazzle fields."
    },
    sellerName: "TacticianAI",
    price: 3200,
    currency: "coins",
    isSimulated: true
  },
  {
    id: "mkt-3",
    card: {
      id: "sim-3",
      name: "Thierry Henry",
      position: "ST",
      nationality: "France",
      club: "Retro Arsenal",
      rating: 91,
      cardType: "Retro Legend",
      isHolographic: true,
      isCustom: false,
      stats: { pace: 94, shooting: 90, passing: 83, dribbling: 91, defending: 42, physical: 80 },
      specialPower: "Vavavoom Burst",
      powerDescription: "Sprints with a gliding stride that cannot be physically bodychecked.",
      shortBio: "High-bury's greatest hero. Striking with unparalleled elegance, high balance, and unmatched side-foot finishes."
    },
    sellerName: "ClassicCollector",
    price: 180,
    currency: "gems",
    isSimulated: true
  },
  {
    id: "mkt-4",
    card: {
      id: "sim-4",
      name: "Ronaldo Prime",
      position: "ST",
      nationality: "Brazil",
      club: "Retro Madrid",
      rating: 94,
      cardType: "Retro Legend",
      isHolographic: true,
      isCustom: false,
      stats: { pace: 97, shooting: 95, passing: 80, dribbling: 96, defending: 35, physical: 87 },
      specialPower: "The Phenomenon",
      powerDescription: "Smashes keeper focus down to 5%, ensuring zero reaction capability.",
      shortBio: "El Fenómeno. The most terrifying blend of sprinting speed, muscular bulk, and flawless stepovers ever witnessed."
    },
    sellerName: "HoloHoarder",
    price: 8500,
    currency: "coins",
    isSimulated: true
  }
];

// Simulated active trading bids
export const INITIAL_TRADE_OFFERS: TradeOffer[] = [
  {
    id: "trd-1",
    traderName: "SambaFutebol",
    traderAvatar: "⚽",
    offeredCard: {
      id: "trd-card-1",
      name: "Pelé Jr",
      position: "CAM",
      nationality: "Brazil",
      club: "Santos Stars",
      rating: 87,
      cardType: "Rare gold",
      isHolographic: false,
      isCustom: false,
      stats: { pace: 85, shooting: 84, passing: 88, dribbling: 89, defending: 48, physical: 73 },
      specialPower: "Divine Overlap",
      powerDescription: "Increases overall possession attributes by 10 points while inside opposing box coordinates."
    },
    requestedCardType: "Any Gold",
    requestedPosition: "ST",
    coinsBonus: 200
  },
  {
    id: "trd-2",
    traderName: "VikingBoot",
    traderAvatar: "🛡️",
    offeredCard: {
      id: "trd-card-2",
      name: "Retro Schmeichel",
      position: "GK",
      nationality: "Denmark",
      club: "Red Giants",
      rating: 90,
      cardType: "Retro Legend",
      isHolographic: true,
      isCustom: false,
      stats: { pace: 60, shooting: 40, passing: 68, dribbling: 65, defending: 90, physical: 91 },
      specialPower: "Starjump Spread",
      powerDescription: "Covers the entire lower framework block using a massive body block jump.",
      shortBio: "A vocal Danish general who commanded the box, intimidating strikers with incredible close-range stops."
    },
    requestedCardType: "Rare gold",
    requestedPosition: "LW"
  }
];

// Simulated Top Collectors for Leaderboard
export const LEADERBOARD_USERS: LeaderboardUser[] = [
  { rank: 1, name: "GalacticKicker", avatar: "👑", collectionCount: 42, holographicCount: 15, maxRating: 96, coins: 25400, isCurrentUser: false },
  { rank: 2, name: "CardMasterNils", avatar: "⭐", collectionCount: 38, holographicCount: 11, maxRating: 94, coins: 12100, isCurrentUser: false },
  { rank: 3, name: "MercenaryStriker", avatar: "🎯", collectionCount: 33, holographicCount: 9, maxRating: 93, coins: 8900, isCurrentUser: false },
  { rank: 4, name: "HoloQueen", avatar: "✨", collectionCount: 31, holographicCount: 12, maxRating: 94, coins: 14800, isCurrentUser: false },
  { rank: 5, name: "GoalMachine", avatar: "⚡", collectionCount: 29, holographicCount: 6, maxRating: 92, coins: 4100, isCurrentUser: false },
  { rank: 6, name: "TacticianAI", avatar: "🤖", collectionCount: 26, holographicCount: 7, maxRating: 91, coins: 7800, isCurrentUser: false }
];

// Load and Save Local Profile Resources
export function loadUserProgress(): UserProgress {
  const saved = localStorage.getItem("football_card_progress");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Ensure records and arrays are initialized robustly
      if (parsed.collection && parsed.collection.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse saved user progress, regenerating starter.", e);
    }
  }

  // Draw 5 initial cards as a welcome standard package
  const welcomeCards = [
    // Ensure we start with some cards
    {
      id: `welcome-de-bruyne-${Date.now()}`,
      name: "Kevin De Bruyne",
      position: "CM",
      nationality: "Belgium",
      club: "Blue Moon FC",
      rating: 90,
      cardType: "Standard Gold" as const,
      isHolographic: false,
      isCustom: false,
      stats: { pace: 72, shooting: 82, passing: 93, dribbling: 87, defending: 65, physical: 78 },
      specialPower: "GPS Diagonal Cross",
      powerDescription: "Lobs standard balls that calculate coordinates perfectly to bypass defensive blocks."
    },
    {
      id: `welcome-yamal-${Date.now()}`,
      name: "Lamine Yamal",
      position: "RW",
      nationality: "Spain",
      club: "Blaugrana FC",
      rating: 82,
      cardType: "Standard Silver" as const,
      isHolographic: false,
      isCustom: false,
      stats: { pace: 85, shooting: 74, passing: 78, dribbling: 86, defending: 32, physical: 55 },
      specialPower: "Catalan Wave",
      powerDescription: "Dribbles inside with high finesse, triggering an early curling attempt parameter."
    },
    {
      id: `welcome-saliba-${Date.now()}`,
      name: "William Saliba",
      position: "CB",
      nationality: "France",
      club: "London Gunners",
      rating: 86,
      cardType: "Standard Gold" as const,
      isHolographic: false,
      isCustom: false,
      stats: { pace: 82, shooting: 40, passing: 75, dribbling: 78, defending: 87, physical: 84 },
      specialPower: "Rolls-Royce Guard",
      powerDescription: "Gently disarms incoming pressure without committing foul parameters."
    },
    {
      id: `welcome-bana-gk-${Date.now()}`,
      name: "Yassine Bounou",
      position: "GK",
      nationality: "Morocco",
      club: "Desert Eagles",
      rating: 85,
      cardType: "Standard Silver" as const,
      isHolographic: false,
      isCustom: false,
      stats: { pace: 58, shooting: 30, passing: 70, dribbling: 68, defending: 85, physical: 82 },
      specialPower: "Miracle Reflex",
      powerDescription: "Guarantees a point-blank punch-out when facing a direct shot."
    },
    {
      id: `welcome-bellingham-${Date.now()}`,
      name: "Jude Bellingham",
      position: "CAM",
      nationality: "England",
      club: "Royal White",
      rating: 89,
      cardType: "Standard Gold" as const,
      isHolographic: false,
      isCustom: false,
      stats: { pace: 79, shooting: 84, passing: 83, dribbling: 88, defending: 78, physical: 85 },
      specialPower: "Galactic Engine",
      powerDescription: "Restores stamina params of all friendly midfielders by 25 points at half-time."
    }
  ];

  const starterProgress: UserProgress = {
    coins: 3500, // Enuff for a couple of standard packs
    gems: 100,  // Base startup premium gems
    collection: welcomeCards,
    record: { wins: 0, losses: 0, draws: 0 },
    dailyStreak: 0,
    consecutiveDays: 0
  };

  saveUserProgress(starterProgress);
  return starterProgress;
}

export function saveUserProgress(progress: UserProgress) {
  localStorage.setItem("football_card_progress", JSON.stringify(progress));
}
