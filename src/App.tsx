import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Zap, Award, Flame, Coins, ShieldCheck, 
  Store, User, TrendingUp, Trophy, Play, Sword, 
  ChevronRight, RefreshCw, Plus, Trash2, Check, X, Search, Filter, Share2, HelpCircle
} from "lucide-react";
import { Card, CardType, UserProgress, MarketItem, TradeOffer, LeaderboardUser, CommentaryEvent, BattleResult } from "./types";
import { loadUserProgress, saveUserProgress, PACKS, openPack, INITIAL_SIMULATED_MARKET, INITIAL_TRADE_OFFERS, LEADERBOARD_USERS, STATIC_CARDS } from "./data";
import FootballCard from "./components/FootballCard";

export default function App() {
  // State from LocalStorage or Default Seed Data
  const [userProfile, setUserProfile] = useState<UserProgress>(() => loadUserProgress());
  
  // Market Listings State
  const [marketItems, setMarketItems] = useState<MarketItem[]>(() => {
    const savedMarket = localStorage.getItem("football_market_items");
    if (savedMarket) {
      try { return JSON.parse(savedMarket); } catch(e) {}
    }
    return INITIAL_SIMULATED_MARKET;
  });

  // Trade Offers State
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>(() => {
    const savedTrades = localStorage.getItem("football_trade_offers");
    if (savedTrades) {
      try { return JSON.parse(savedTrades); } catch(e) {}
    }
    return INITIAL_TRADE_OFFERS;
  });

  // Current Screen / Tab
  const [activeTab, setActiveTab] = useState<"home" | "collection" | "marketplace" | "trade" | "arena" | "lab">("home");

  // Selection states for cards & Modals
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isLisingCard, setIsListingCard] = useState<boolean>(false);
  const [listingPrice, setListingPrice] = useState<number>(500);
  const [listingCurrency, setListingCurrency] = useState<"coins" | "gems">("coins");

  // Pack Opening Interaction States
  const [isOpeningPack, setIsOpeningPack] = useState<boolean>(false);
  const [openedCards, setOpenedCards] = useState<Card[]>([]);
  const [currentOpenedCardIndex, setCurrentOpenedCardIndex] = useState<number>(0);
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);

  // Filter & Search states for Collection Tab
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("All");
  const [rarityFilter, setRarityFilter] = useState("All");
  const [showcaseFilterOnly, setShowcaseFilterOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"rating-desc" | "rating-asc" | "name-asc">("rating-desc");

  // Card Creator (Lab) States
  const [customName, setCustomName] = useState("");
  const [customPosition, setCustomPosition] = useState("ST");
  const [customPrompt, setCustomPrompt] = useState("");
  const [customAvatarStyle, setCustomAvatarStyle] = useState<"avataaars" | "notionists" | "pixel-art" | "bottts" | "adventurer">("avataaars");
  const [customAvatarSeed, setCustomAvatarSeed] = useState("");
  const [customRealPhotoUrl, setCustomRealPhotoUrl] = useState("");
  const [artMode, setArtMode] = useState<"real" | "illustrated">(() => {
    const saved = localStorage.getItem("card_art_mode");
    return (saved as any) || "real";
  });

  const toggleArtMode = () => {
    const nextMode = artMode === "real" ? "illustrated" : "real";
    setArtMode(nextMode);
    localStorage.setItem("card_art_mode", nextMode);
    window.dispatchEvent(new Event("card_art_changed"));
  };

  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [generatedCardResult, setGeneratedCardResult] = useState<Card | null>(null);

  // Battle Arena States
  const [selectedBattleTeam, setSelectedBattleTeam] = useState<Card[]>([]);
  const [opponentCategory, setOpponentCategory] = useState<"rookie" | "neon" | "legend">("rookie");
  const [isSimulatingBattle, setIsSimulatingBattle] = useState(false);
  const [battleReport, setBattleReport] = useState<BattleResult | null>(null);
  const [activeBattleLogIndex, setActiveBattleLogIndex] = useState<number>(0);
  const [isBattleFinished, setIsBattleFinished] = useState(false);

  // Daily Rewards Countdown simulation state
  const [nextClaimTimeLeft, setNextClaimTimeLeft] = useState<string>("");
  const [isDailyClaimable, setIsDailyClaimable] = useState(true);

  // Save changes to localStorage on states update
  useEffect(() => {
    saveUserProgress(userProfile);
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("football_market_items", JSON.stringify(marketItems));
  }, [marketItems]);

  useEffect(() => {
    localStorage.setItem("football_trade_offers", JSON.stringify(tradeOffers));
  }, [tradeOffers]);

  // Handle simulated Daily Streak login clock tick
  useEffect(() => {
    const checkClaimStatus = () => {
      const lastClaimString = userProfile.lastLoginDate;
      if (!lastClaimString) {
        setIsDailyClaimable(true);
        setNextClaimTimeLeft("Ready to claim!");
        return;
      }
      
      const lastClaim = new Date(lastClaimString).getTime();
      const now = Date.now();
      const DiffHours = 24; // 24 hours cycle
      const targetTime = lastClaim + (DiffHours * 60 * 60 * 1000);
      
      if (now >= targetTime) {
        setIsDailyClaimable(true);
        setNextClaimTimeLeft("Ready to claim!");
      } else {
        setIsDailyClaimable(false);
        const remMs = targetTime - now;
        const hrs = Math.floor(remMs / (1000 * 60 * 65));
        const mins = Math.floor((remMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((remMs % (1000 * 60)) / 1000);
        setNextClaimTimeLeft(`${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
      }
    };

    checkClaimStatus();
    const interval = setInterval(checkClaimStatus, 1000);
    return () => clearInterval(interval);
  }, [userProfile.lastLoginDate]);

  // Showcase list - cards with top evaluations
  const showcasedCards = userProfile.collection.slice(0, 4); // Always use top ratings as default or custom favorited

  // Sort and filtered profile collection list
  const filteredCollection = userProfile.collection.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          card.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          card.club.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Position grouping filter
    let matchesPosition = true;
    if (positionFilter === "Attack") {
      matchesPosition = ["ST", "LW", "RW"].includes(card.position);
    } else if (positionFilter === "Midfield") {
      matchesPosition = ["CAM", "CM", "CDM", "RM", "LM"].includes(card.position);
    } else if (positionFilter === "Defense") {
      matchesPosition = ["CB", "LB", "RB"].includes(card.position);
    } else if (positionFilter === "Goalkeeper") {
      matchesPosition = card.position === "GK";
    } else if (positionFilter !== "All") {
      matchesPosition = card.position === positionFilter;
    }

    // Rarity Type filter
    let matchesRarity = true;
    if (rarityFilter === "Holo") {
      matchesRarity = card.isHolographic;
    } else if (rarityFilter === "Custom") {
      matchesRarity = card.isCustom;
    } else if (rarityFilter !== "All") {
      matchesRarity = card.cardType === rarityFilter;
    }

    return matchesSearch && matchesPosition && matchesRarity;
  }).sort((a, b) => {
    if (sortBy === "rating-desc") return b.rating - a.rating;
    if (sortBy === "rating-asc") return a.rating - b.rating;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    return 0;
  });

  // Calculate live average of current collection counts & top rating for live stats
  const topCollectionRating = userProfile.collection.length > 0 
    ? Math.max(...userProfile.collection.map(c => c.rating)) 
    : 0;

  const holoCount = userProfile.collection.filter(c => c.isHolographic).length;

  // Claim Daily Rewards Handler
  const handleClaimDailyReward = () => {
    if (!isDailyClaimable) return;

    // Award +500 coins, +15 gems, increase streak count, and save ISO Date
    const nextStreak = userProfile.dailyStreak + 1;
    setUserProfile(prev => ({
      ...prev,
      coins: prev.coins + 800,
      gems: prev.gems + 25,
      dailyStreak: nextStreak,
      lastLoginDate: new Date().toISOString(),
      consecutiveDays: prev.consecutiveDays >= 7 ? 1 : prev.consecutiveDays + 1
    }));

    // Alert reward nicely
    alert(`🎉 Daily login reward claimed!\n🎁 Earned: +800 Coins, +25 Gems!\nCurrent Streak: ${nextStreak} Days 🔥`);
  };

  // Helper to speed up Daily Rewards timer for sandbox testing!
  const triggerTestCooldownClear = () => {
    setUserProfile(prev => ({
      ...prev,
      lastLoginDate: undefined
    }));
  };

  // Open Card Pack Logic
  const handleBuyPack = (packId: string) => {
    const pack = PACKS.find(p => p.id === packId);
    if (!pack) return;

    if (pack.coinCost > userProfile.coins) {
      alert("❌ Insufficient Coins! Complete matches or claim daily rewards to earn more coins.");
      return;
    }
    if (pack.gemCost > userProfile.gems) {
      alert("❌ Insufficient Gems! Buy other pack categories or win tournaments.");
      return;
    }

    // Deduct coins & gems
    setUserProfile(prev => ({
      ...prev,
      coins: prev.coins - pack.coinCost,
      gems: prev.gems - pack.gemCost
    }));

    // Trigger pack opening view states
    const items = openPack(packId);
    setOpenedCards(items);
    setSelectedPackId(packId);
    setCurrentOpenedCardIndex(0);
    setIsOpeningPack(true);
  };

  // Skip or step into next pack card
  const handleNextOpenedCard = () => {
    if (currentOpenedCardIndex < openedCards.length - 1) {
      setCurrentOpenedCardIndex(prev => prev + 1);
    } else {
      // Completed, add all opened cards to player collection inventory
      setUserProfile(prev => ({
        ...prev,
        collection: [...prev.collection, ...openedCards]
      }));
      // Reset pack states
      setIsOpeningPack(false);
      setOpenedCards([]);
      setSelectedPackId(null);
    }
  };

  // List card for sale on simulated marketplace
  const handleListCardToMarket = () => {
    if (!selectedCard) return;
    if (listingPrice <= 0) {
      alert("Please enter a valid sale price!");
      return;
    }

    // Remove card from active collection inventory
    setUserProfile(prev => ({
      ...prev,
      collection: prev.collection.filter(c => c.id !== selectedCard.id)
    }));

    // Build new market item structure
    const newItem: MarketItem = {
      id: `usr-list-${Date.now()}`,
      card: {
        ...selectedCard,
        marketPrice: listingPrice
      },
      sellerName: "Tactician User (You)",
      price: listingPrice,
      currency: listingCurrency,
      isSimulated: false
    };

    setMarketItems(prev => [newItem, ...prev]);
    setIsListingCard(false);
    setSelectedCard(null);

    alert(`⚽ Placed ${selectedCard.name} on the marketplace! Other simulated scouts will inspect it.`);
  };

  // Buy listed card from marketplace
  const handleBuyMarketItem = (item: MarketItem) => {
    if (item.currency === "coins" && userProfile.coins < item.price) {
      alert("❌ Insufficient Coins to purchase this card!");
      return;
    }
    if (item.currency === "gems" && userProfile.gems < item.price) {
      alert("❌ Insufficient Gems to purchase this card!");
      return;
    }

    // Deduct and receive
    setUserProfile(prev => {
      const nextCoins = item.currency === "coins" ? prev.coins - item.price : prev.coins;
      const nextGems = item.currency === "gems" ? prev.gems - item.price : prev.gems;
      return {
        ...prev,
        coins: nextCoins,
        gems: nextGems,
        collection: [...prev.collection, item.card]
      };
    });

    // Remove from market listing list
    setMarketItems(prev => prev.filter(m => m.id !== item.id));
    alert(`🎉 Successfully purchased ${item.card.name} (${item.card.rating})! Card added to your collection.`);
  };

  // Cancel/Unlist listed market card
  const handleUndoMarketListing = (item: MarketItem) => {
    setUserProfile(prev => ({
      ...prev,
      collection: [...prev.collection, item.card]
    }));
    setMarketItems(prev => prev.filter(m => m.id !== item.id));
    alert("Card successfully unlisted and returned to your collection.");
  };

  // Trade card handler
  const handleAcceptTradeOffer = (offer: TradeOffer) => {
    // Player needs a card matching requested type and optionally position
    const candidateIndex = userProfile.collection.findIndex(card => {
      if (offer.requestedCardType === "Any Gold") {
        return card.cardType.includes("Gold") || card.cardType === "Rare gold";
      }
      if (offer.requestedCardType === "Rating 85+") {
        return card.rating >= 85;
      }
      return card.cardType === offer.requestedCardType && (!offer.requestedPosition || card.position === offer.requestedPosition);
    });

    if (candidateIndex === -1) {
      alert(`❌ You don't have a "${offer.requestedCardType}" card${offer.requestedPosition ? ` playing in ${offer.requestedPosition}` : ""} available for trade! Open packs to collect target elements.`);
      return;
    }

    // Take players card and grant incoming offered card
    const tradedPlayerCard = userProfile.collection[candidateIndex];
    setUserProfile(prev => {
      const nextCollection = prev.collection.filter((_, idx) => idx !== candidateIndex);
      return {
        ...prev,
        coins: prev.coins + (offer.coinsBonus || 0),
        collection: [...nextCollection, offer.offeredCard]
      };
    });

    // Clear trade
    setTradeOffers(prev => prev.filter(t => t.id !== offer.id));
    alert(`🤝 Deal done! Traded away your ${tradedPlayerCard.name} (${tradedPlayerCard.rating}) for ${offer.offeredCard.name} (${offer.offeredCard.rating}) +${offer.coinsBonus || 0} Coins Bonus!`);
  };

  // Generate Custom Football Card via AI Integration REST API
  const handleCreateAICard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) {
      alert("Please provide an aesthetic prompt descriptor!");
      return;
    }

    setIsGeneratingCard(true);
    setGenerationLogs(["Connecting to AI Studio server...", "Contacting Gemini neural football analyst...", "Parsing tactical descriptions..."]);

    const timer1 = setTimeout(() => setGenerationLogs(l => [...l, "Synthesizing speed and physical stats matrices..."]), 850);
    const timer2 = setTimeout(() => setGenerationLogs(l => [...l, "Allocating custom holographic foil elements..."]), 1600);

    try {
      const response = await fetch("/api/generate-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: customPrompt,
          preferredName: customName || undefined,
          preferredPosition: customPosition
        })
      });

      if (!response.ok) {
        throw new Error("Server model generation failed, trying backup constructor.");
      }

      const generatedData = await response.json();
      
      const newCard: Card = {
        id: `custom-card-${Date.now()}`,
        name: generatedData.name,
        position: generatedData.position,
        nationality: generatedData.nationality,
        club: generatedData.club,
        rating: generatedData.rating,
        stats: generatedData.stats,
        cardType: generatedData.cardType || "Rare gold",
        isHolographic: Math.random() > 0.4, // Fun high rates for player creations!
        isCustom: true,
        specialPower: generatedData.specialPower,
        powerDescription: generatedData.powerDescription,
        shortBio: generatedData.shortBio,
        originalCreator: userProfile.consecutiveDays > 0 ? "You" : "Master Agent",
        avatarStyle: customAvatarStyle,
        avatarSeed: customAvatarSeed || generatedData.name,
        imageUrl: customRealPhotoUrl || undefined
      };

      setGeneratedCardResult(newCard);
      setGenerationLogs(l => [...l, "✨ Synthesizer completed successfully! High-performance football card finalized."]);

    } catch (err) {
      console.error(err);
      // Fallback local safe card generator in case connection is offline
      const localFallbackCard: Card = {
        id: `custom-local-${Date.now()}`,
        name: customName || "Cyber Stryker",
        position: customPosition,
        nationality: "Neoverse",
        club: "Pixel Athletics",
        rating: Math.floor(Math.random() * 10) + 88,
        stats: { pace: 95, shooting: 91, passing: 84, dribbling: 90, defending: 55, physical: 80 },
        cardType: "Futuristic Icon",
        isHolographic: true,
        isCustom: true,
        specialPower: "Neon Rush",
        powerDescription: "Blurs through opponent defenders with supersonic warp lines.",
        shortBio: "Created from original football dreams using fallback local offline generators.",
        avatarStyle: customAvatarStyle,
        avatarSeed: customAvatarSeed || customName || "Cyber Stryker",
        imageUrl: customRealPhotoUrl || undefined
      };
      setGeneratedCardResult(localFallbackCard);
      setGenerationLogs(l => [...l, "⚠️ Fallback model applied. Custom physical card loaded."]);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsGeneratingCard(false);
    }
  };

  // Add the newly created AI Card to inventory collection
  const handleSaveAICardToCollection = () => {
    if (!generatedCardResult) return;
    
    setUserProfile(prev => ({
      ...prev,
      collection: [generatedCardResult, ...prev.collection]
    }));

    alert(`🌟 ${generatedCardResult.name} was successfully stored in your collection showcase!`);
    setGeneratedCardResult(null);
    setCustomPrompt("");
    setCustomName("");
    setActiveTab("collection");
  };

  // Build simulated opponent rosters
  const getOpponentTeam = () => {
    if (opponentCategory === "rookie") {
      return [
        { name: "John Rookie", position: "ST", rating: 80, specialPower: "Standard Shot", stats: { pace: 70, shooting: 71, passing: 68, dribbling: 72, defending: 45, physical: 70 } },
        { name: "S. Defense", position: "CB", rating: 82, specialPower: "Slide Obstacle", stats: { pace: 68, shooting: 40, passing: 65, dribbling: 60, defending: 81, physical: 80 } },
        { name: "Casper Keeper", position: "GK", rating: 81, specialPower: "Glove Stretch", stats: { pace: 50, shooting: 40, passing: 60, dribbling: 60, defending: 80, physical: 78 } }
      ];
    } else if (opponentCategory === "neon") {
      return [
        STATIC_CARDS.find(c => c.id === "fut-haaland") || STATIC_CARDS[0],
        STATIC_CARDS.find(c => c.id === "std-van-dijk") || STATIC_CARDS[4],
        STATIC_CARDS.find(c => c.id === "std-bana-gk") || STATIC_CARDS[8]
      ];
    } else {
      // Legend Dream Team
      return [
        STATIC_CARDS.find(c => c.id === "leg-ronaldinho") || STATIC_CARDS[0],
        STATIC_CARDS.find(c => c.id === "leg-zidane") || STATIC_CARDS[3],
        STATIC_CARDS.find(c => c.id === "leg-yashin") || STATIC_CARDS[4]
      ];
    }
  };

  // Select card for line-up selection
  const handleToggleBattleTeamCard = (card: Card) => {
    if (selectedBattleTeam.find(c => c.id === card.id)) {
      setSelectedBattleTeam(prev => prev.filter(c => c.id !== card.id));
    } else {
      if (selectedBattleTeam.length >= 3) {
        alert("Maximum squad capacity is 3 cards for immediate 3v3 Arena skirmishes!");
        return;
      }
      setSelectedBattleTeam(prev => [...prev, card]);
    }
  };

  // Run AI Battle Mode Simulation using express Gemini endpoints
  const handleStartArenaBattle = async () => {
    if (selectedBattleTeam.length < 3) {
      alert("Please choose exactly 3 cards for your matchday line-up!");
      return;
    }

    setIsSimulatingBattle(true);
    setBattleReport(null);
    setNextProgressStatus("Deploying squad onto the pitch...");

    try {
      const response = await fetch("/api/evaluate-battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerTeam: selectedBattleTeam,
          aiTeam: getOpponentTeam(),
          arenaName: "AI Studio Cyber Stadium",
          difficulty: opponentCategory === "rookie" ? "Normal" : opponentCategory === "neon" ? "Hard" : "Master Class"
        })
      });

      if (!response.ok) {
        throw new Error("Evaluation endpoint failed");
      }

      const report: BattleResult = await response.json();
      setBattleReport(report);
      setActiveBattleLogIndex(0);
      setIsBattleFinished(false);

    } catch (err) {
      console.error(err);
      // Construct rich local client simulation in case of offline/timeout logs
      const playerHero = selectedBattleTeam[0];
      const aiHero = getOpponentTeam()[0];
      const winStatus = Math.random() > 0.4 ? "player" : "ai";
      const userGoals = winStatus === "player" ? 2 : 1;
      const aiGoals = winStatus === "ai" ? 2 : 1;

      const fallbackReport: BattleResult = {
        scoreLine: `${userGoals} - ${aiGoals}`,
        winner: winStatus === "player" ? "player" : "ai",
        matchSummary: `A high-intensity battle in the server fallback simulator! ${playerHero.name} led your squad.`,
        commentaryEvents: [
          { minute: 15, event: "Kickoff! High tension as both sides trade physical duels.", score: "0 - 0" },
          { minute: 44, event: `${aiHero.name} drives deep and fires an unstoppable trajectory. Goal!`, score: winStatus === "ai" ? "0 - 1" : "1 - 1" },
          { minute: 72, event: `Spectacular response! ${playerHero.name} activates special power and rattles the keeper nest.`, score: "1 - 1" },
          { minute: 89, event: "Sensational match winner from long range finishes off this incredible event!", score: `${userGoals} - ${aiGoals}` }
        ]
      };

      setBattleReport(fallbackReport);
      setActiveBattleLogIndex(0);
      setIsBattleFinished(false);
    } finally {
      setIsSimulatingBattle(false);
    }
  };

  const [nextProgressStatus, setNextProgressStatus] = useState("Gathering crowd coordinates...");

  // Advance commentary event in timeline
  const handleAdvanceCommentary = () => {
    if (!battleReport) return;
    if (activeBattleLogIndex < battleReport.commentaryEvents.length - 1) {
      setActiveBattleLogIndex(prev => prev + 1);
    } else {
      setIsBattleFinished(true);
      // Give rewards on finish
      const isWin = battleReport.winner === "player";
      const isDraw = battleReport.winner === "draw";
      const coinReward = isWin ? 500 : isDraw ? 250 : 100;
      const gemReward = isWin ? 15 : isDraw ? 5 : 2;

      setUserProfile(prev => ({
        ...prev,
        coins: prev.coins + coinReward,
        gems: prev.gems + gemReward,
        record: {
          wins: isWin ? prev.record.wins + 1 : prev.record.wins,
          losses: !isWin && !isDraw ? prev.record.losses + 1 : prev.record.losses,
          draws: isDraw ? prev.record.draws + 1 : prev.record.draws
        }
      }));
    }
  };

  // Reset Battle states to match again
  const handleResetBattle = () => {
    setBattleReport(null);
    setIsBattleFinished(false);
    setActiveBattleLogIndex(0);
    setSelectedBattleTeam([]);
  };

  // Automated Quick Coin Injector for developers/testers to have instant fun
  const handleCheatCoins = () => {
    setUserProfile(prev => ({
      ...prev,
      coins: prev.coins + 5000,
      gems: prev.gems + 100
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans relative overflow-x-hidden select-none">
      
      {/* Dynamic Frosted Mesh Blobs representing the requested layout */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-12 w-80 h-80 bg-purple-600/15 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* TOP HEADER: Frosted glass bar detailing currencies, levels and rewards */}
      <header className="h-16 flex items-center justify-between px-6 bg-white/5 backdrop-blur-xl border-b border-white/10 relative z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg text-sm tracking-tighter">
            FT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold tracking-tight">Scout_{userProfile.dailyStreak > 0 ? "Legend" : "Rookie"}</p>
              <span className="bg-cyan-500/20 text-cyan-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-cyan-400/20">Active</span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Streak: {userProfile.dailyStreak} Days</p>
          </div>
        </div>

        {/* Currency status widgets with glass backdrop */}
        <div className="flex gap-4 items-center">
          <button 
            onClick={handleCheatCoins}
            title="Inject simulated assets for sandbox play!"
            className="text-[11px] bg-white/10 hover:bg-white/15 px-2 py-1 rounded text-zinc-300 border border-white/5 font-bold transition-all mr-2 flex items-center gap-1 active:scale-95"
          >
            <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin-slow" /> +$5,000 Free
          </button>

          {/* Real Photo vs Illustrated Art Toggle Selector */}
          <button
            onClick={toggleArtMode}
            title="Switch player card graphics between Real Athlete Photos and cartoon Avatars"
            className="flex items-center gap-2 bg-linear-to-r from-teal-950 to-blue-950 hover:from-teal-900 hover:to-blue-905 border border-cyan-500/40 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 active:scale-95 shadow-xs text-cyan-100"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline text-slate-300">Style:</span>
            <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-md text-[10px] uppercase font-mono font-black tracking-tight">
              {artMode === "real" ? "📸 Real Photos" : "🎨 Avatars"}
            </span>
          </button>

          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
            <span className="font-sans">🪙</span>
            <span className="font-mono font-bold text-yellow-400 text-sm">
              {userProfile.coins.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
            <span className="font-sans">💎</span>
            <span className="font-mono font-bold text-cyan-400 text-sm">
              {userProfile.gems}
            </span>
          </div>
        </div>
      </header>

      {/* CORE LAYOUT BODY */}
      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden relative z-20">
        
        {/* SIDEBAR NAVIGATION PANEL */}
        <aside className="w-full md:w-56 flex flex-col gap-3 shrink-0">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
            
            <button
              onClick={() => setActiveTab("home")}
              className={`p-3 rounded-xl border flex items-center justify-center md:justify-start gap-3 cursor-pointer text-sm font-bold transition-all w-full min-w-[120px] ${
                activeTab === "home"
                  ? "bg-white/10 border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-950/20"
                  : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Store className="w-4 h-4 shrink-0" />
              <span>Packs & Shop</span>
            </button>

            <button
              onClick={() => setActiveTab("collection")}
              className={`p-3 rounded-xl border flex items-center justify-center md:justify-start gap-3 cursor-pointer text-sm font-bold transition-all w-full min-w-[120px] ${
                activeTab === "collection"
                  ? "bg-white/10 border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-950/20"
                  : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>My Roster ({userProfile.collection.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("lab")}
              className={`p-3 rounded-xl border flex items-center justify-center md:justify-start gap-3 cursor-pointer text-sm font-bold transition-all w-full min-w-[120px] ${
                activeTab === "lab"
                  ? "bg-white/10 border-cyan-400/50 text-cyan-300 shadow-lg"
                  : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AI Card Lab</span>
            </button>

            <button
              onClick={() => setActiveTab("marketplace")}
              className={`p-3 rounded-xl border flex items-center justify-center md:justify-start gap-3 cursor-pointer text-sm font-bold transition-all w-full min-w-[120px] ${
                activeTab === "marketplace"
                  ? "bg-white/10 border-cyan-400/50 text-cyan-300 shadow-lg"
                  : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>Marketplace</span>
            </button>

            <button
              onClick={() => setActiveTab("trade")}
              className={`p-3 rounded-xl border flex items-center justify-center md:justify-start gap-3 cursor-pointer text-sm font-bold transition-all w-full min-w-[120px] ${
                activeTab === "trade"
                  ? "bg-white/10 border-cyan-400/50 text-cyan-300 shadow-lg"
                  : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <RefreshCw className="w-4 h-4 shrink-0" />
              <span>Trade Hub</span>
            </button>

            <button
              onClick={() => setActiveTab("arena")}
              className={`p-3 rounded-xl border flex items-center justify-center md:justify-start gap-3 cursor-pointer text-sm font-bold transition-all w-full min-w-[120px] ${
                activeTab === "arena"
                  ? "bg-white/10 border-cyan-400/50 text-cyan-300 shadow-lg"
                  : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Sword className="w-4 h-4 text-red-400 shrink-0" />
              <span>Battle Arena</span>
            </button>

          </nav>

          {/* Daily login reward quick container on side */}
          <div className="mt-auto p-4 bg-gradient-to-br from-cyan-950/40 to-slate-900/40 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest leading-none">Streak Reward</p>
                <h4 className="text-sm font-bold mt-1 text-white">Daily Bonus Pack</h4>
              </div>
              <span className="text-xl">🎁</span>
            </div>
            
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">Claim daily coin injections & expand your roster.</p>
            
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[10px] text-slate-400">{nextClaimTimeLeft}</span>
              {!isDailyClaimable && (
                <button 
                  onClick={triggerTestCooldownClear}
                  className="text-[9px] text-cyan-300 underline hover:text-white"
                >
                  Clear CD
                </button>
              )}
            </div>

            <button
              onClick={handleClaimDailyReward}
              disabled={!isDailyClaimable}
              className={`w-full py-2 rounded-lg font-bold text-xs tracking-wide transition-all ${
                isDailyClaimable 
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-950/40 cursor-pointer"
                  : "bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isDailyClaimable ? "CLAIM REWARD" : "NEXT IN 24H"}
            </button>
          </div>
        </aside>

        {/* CENTRAL VIEW AREA */}
        <main className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col overflow-y-auto p-4 md:p-6 scrollbar-thin">
          
          {/* TAB 1: HOME & PACK STORES */}
          {activeTab === "home" && (
            <div className="flex flex-col gap-6">
              
              {/* Featured banner showcase card at top */}
              <div className="p-6 bg-gradient-to-r from-cyan-900/20 via-slate-900/40 to-purple-900/20 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                  <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded">
                    Global Special Event
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black italic tracking-tight mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                    CYBER SPORTS TOURNAMENT LIVE
                  </h2>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    Open premium limited editions. Craft crazy custom cards using the **AI Lab** and clash directly with top AI teams to win legend multipliers. Set listings on the marketplace for immediate coin returns!
                  </p>

                  {/* Tiny record pill */}
                  <div className="flex gap-4 mt-4">
                    <div className="bg-black/35 px-3 py-1 rounded-lg border border-white/5 text-center">
                      <p className="text-[10px] text-zinc-400">Wins</p>
                      <p className="text-base font-bold text-emerald-400">{userProfile.record.wins}</p>
                    </div>
                    <div className="bg-black/35 px-3 py-1 rounded-lg border border-white/5 text-center">
                      <p className="text-[10px] text-zinc-400">Losses</p>
                      <p className="text-base font-bold text-red-400">{userProfile.record.losses}</p>
                    </div>
                    <div className="bg-black/35 px-3 py-1 rounded-lg border border-white/5 text-center">
                      <p className="text-[10px] text-zinc-400">Draws</p>
                      <p className="text-base font-bold text-zinc-400">{userProfile.record.draws}</p>
                    </div>
                  </div>
                </div>

                {/* Right side teaser */}
                <div className="w-full md:w-auto shrink-0 flex flex-col items-center gap-2 bg-white/5 p-4 rounded-xl border border-white/5 max-w-xs">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Elite Talisman</p>
                  <div className="text-3xl text-yellow-400 font-extrabold">95+</div>
                  <p className="text-[10px] text-slate-500 text-center">Guaranteed in the Holo Master limited packs</p>
                  <button 
                    onClick={() => setActiveTab("collection")} 
                    className="text-xs text-cyan-300 hover:underline flex items-center gap-1 mt-1 font-bold"
                  >
                    Manage Roster <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Pack opening store row */}
              <div>
                <h3 className="text-lg font-bold tracking-tight italic mb-4 text-white uppercase flex items-center gap-2">
                  <Store className="w-5 h-5 text-cyan-400" /> FOOTBALL PACK STORES
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PACKS.map(pack => {
                    const isAffordablePrice = (pack.coinCost <= userProfile.coins) && (pack.gemCost <= userProfile.gems);
                    return (
                      <div 
                        key={pack.id} 
                        className="bg-zinc-900/60 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-xl hover:-translate-y-1"
                      >
                        <div>
                          {/* Banner Type badge indicator */}
                          <div className={`p-2 rounded-lg bg-gradient-to-r text-center font-bold text-xs uppercase mb-4 ${pack.bannerColor}`}>
                            {pack.name}
                          </div>

                          <p className="text-xs text-zinc-300 leading-relaxed mb-4 min-h-[36px]">
                            {pack.description}
                          </p>

                          <div className="flex gap-2 items-center text-xs text-zinc-400 mb-4 bg-black/20 p-2 rounded border border-white/5 justify-between">
                            <span>Contains: <b>{pack.containsCount} Footballers</b></span>
                            {pack.isSpecialEvent && <span className="text-emerald-400 font-extrabold text-[9px] animate-pulse">🔥 SPECIAL</span>}
                          </div>
                        </div>

                        {/* Bottom checkout buttons */}
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2 justify-between text-xs font-mono mb-1 text-slate-400">
                            <span>Cost:</span>
                            <div className="flex gap-2 font-bold">
                              {pack.coinCost > 0 && <span className="text-yellow-400">{pack.coinCost} Coins</span>}
                              {pack.gemCost > 0 && <span className="text-cyan-400">{pack.gemCost} Gems</span>}
                              {pack.coinCost === 0 && pack.gemCost === 0 && <span className="text-green-400 uppercase font-black">FREE PACK</span>}
                            </div>
                          </div>

                          <button
                            onClick={() => handleBuyPack(pack.id)}
                            className="w-full py-2.5 rounded-xl font-bold text-xs tracking-widest bg-white/10 hover:bg-cyan-500 hover:text-slate-950 border border-white/10 hover:border-cyan-400 transition-all text-white shadow-md active:scale-95"
                          >
                            OPEN PACK
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Showcase highlights preview */}
              <div>
                <h3 className="text-lg font-bold tracking-tight italic mb-1 text-white uppercase">
                  ACTIVE COLLECTION PREVIEW
                </h3>
                <p className="text-xs text-slate-400 mb-4">A high-contrast selection of players ready for tournament deployment.</p>

                <div className="flex flex-wrap gap-4 justify-start">
                  {userProfile.collection.slice(0, 3).map(card => (
                    <FootballCard 
                      key={card.id} 
                      card={card} 
                      size="sm"
                      onClick={() => { setSelectedCard(card); setIsListingCard(false); }}
                    />
                  ))}
                  {userProfile.collection.length === 0 && (
                    <div className="p-8 text-center text-slate-400 border border-dashed border-white/10 rounded-xl bg-white/5 w-full">
                      No football cards owned yet. Purchase a pack to expand your tactical roster!
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MY COLLECTION */}
          {activeTab === "collection" && (
            <div className="flex flex-col gap-4">
              
              {/* Header Title with Counts */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black italic tracking-wide text-white uppercase">
                    MY FOOTBALL SQUAD CONTROLLER
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage owned players, highlight customized assets, or list elements onto the marketplace.
                  </p>
                </div>

                <div className="flex gap-3 text-center">
                  <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">Total Items</p>
                    <p className="text-base font-black text-white">{userProfile.collection.length}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">Holo Rares</p>
                    <p className="text-base font-black text-cyan-400">{holoCount}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">Top Rating</p>
                    <p className="text-base font-black text-yellow-400">{topCollectionRating}</p>
                  </div>
                </div>
              </div>

              {/* Filters Panel - Frosted toolbar */}
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-wrap gap-3 items-center justify-between">
                
                {/* Search Bar input */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, nation, club..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                {/* Filter and Sort Pickers */}
                <div className="flex flex-wrap gap-2 items-center">
                  
                  {/* Position filter */}
                  <div className="flex gap-1 bg-black/30 p-1 rounded-lg border border-white/5 text-[11px]">
                    {["All", "Attack", "Midfield", "Defense", "GK"].map(pos => (
                      <button
                        key={pos}
                        onClick={() => setPositionFilter(pos)}
                        className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                          positionFilter === pos 
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/20" 
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>

                  {/* Rarity filter selection */}
                  <select
                    value={rarityFilter}
                    onChange={(e) => setRarityFilter(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-lg text-xs px-2.5 py-1.5 text-white"
                  >
                    <option value="All">All Rarities</option>
                    <option value="Rare gold">Rare gold</option>
                    <option value="Holographic Elite">Holo Elite</option>
                    <option value="Retro Legend">Retro Legend</option>
                    <option value="Futuristic Icon">Futuristic Icon</option>
                    <option value="Holo">Holographic Only</option>
                    <option value="Custom">AI Customized Only</option>
                  </select>

                  {/* Sort selection */}
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-lg text-xs px-2.5 py-1.5 text-white"
                  >
                    <option value="rating-desc">Rating: High-Low</option>
                    <option value="rating-asc">Rating: Low-High</option>
                    <option value="name-asc">Name: A-Z</option>
                  </select>

                </div>
              </div>

              {/* Football Grid display */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                {filteredCollection.map(card => {
                  const isShowcased = showcasedCards.some(s => s.id === card.id);
                  return (
                    <div key={card.id} className="relative group">
                      <FootballCard
                        card={card}
                        size="md"
                        onClick={() => {
                          setSelectedCard(card);
                          setIsListingCard(false);
                        }}
                      />
                      {/* Ribbon banner */}
                      {isShowcased && (
                        <span className="absolute top-2 left-2 bg-yellow-500/90 text-yellow-950 font-black px-2 py-0.5 rounded text-[9px] z-20 pointer-events-none uppercase tracking-widest shadow">
                          ★ Showcase
                        </span>
                      )}
                    </div>
                  );
                })}

                {filteredCollection.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400 bg-white/5 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2">
                    <Award className="w-10 h-10 text-slate-500" />
                    <span>No cards fit the selected specifications.</span>
                    <button 
                      onClick={() => { setSearchQuery(""); setPositionFilter("All"); setRarityFilter("All"); }}
                      className="text-xs text-cyan-300 font-bold underline cursor-pointer mt-1"
                    >
                      Reset active filter parameters
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: ART DESIGN LAB & AI CREATOR */}
          {activeTab === "lab" && (
            <div className="flex flex-col gap-6">
              
              {/* Showcase Banner explaining model usage */}
              <div className="p-5 bg-gradient-to-r from-emerald-900/20 via-slate-900/40 to-cyan-900/20 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span className="text-xs uppercase font-bold tracking-widest">Neural AI Customizer Lab</span>
                </div>
                <h2 className="text-xl font-black italic text-white uppercase">
                  CRAFT YOUR DREAM ICON
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Design specialized football cards using Google Gemini model arrays. Specify custom background prompt concepts, positions, and names. Our sever evaluates statistics, special abilities, and bios dynamically!
                </p>
              </div>

              {/* Main Split Setup */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                
                {/* Generation parameters form */}
                <form onSubmit={handleCreateAICard} className="bg-black/35 border border-white/10 p-5 rounded-2xl flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-white tracking-wider border-b border-white/10 pb-2 uppercase">
                    CARD SPECIFICATIONS
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Player Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Cyber Ronaldinho, Mighty Ariel"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Tactical Position</label>
                      <select
                        value={customPosition}
                        onChange={(e) => setCustomPosition(e.target.value)}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
                      >
                        <option value="ST">ST (Striker)</option>
                        <option value="LW">LW (Left Winger)</option>
                        <option value="RW">RW (Right Winger)</option>
                        <option value="CAM">CAM (Attacking Midfielder)</option>
                        <option value="CM">CM (Central Midfielder)</option>
                        <option value="CB">CB (Centre-back)</option>
                        <option value="GK">GK (Goalkeeper)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Draft Rarity Style</label>
                      <div className="bg-black/25 text-neutral-400 p-2 rounded text-[10px] text-center border border-white/5">
                        ✨ Random high holo rate on output
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 my-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Face Style</label>
                      <select
                        value={customAvatarStyle}
                        onChange={(e) => setCustomAvatarStyle(e.target.value as any)}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-cyan-400"
                      >
                        <option value="avataaars">😎 Classic Cartoon</option>
                        <option value="notionists">🎨 Hand-drawn Sketch</option>
                        <option value="pixel-art">👾 8-Bit Retro</option>
                        <option value="bottts">🤖 Cybernetic Robot</option>
                        <option value="adventurer">🛡️ Fantasy Game RPG</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Avatar Face Seed</label>
                      <input
                        type="text"
                        placeholder="e.g. fire, steel (or blank)"
                        value={customAvatarSeed}
                        onChange={(e) => setCustomAvatarSeed(e.target.value)}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 my-1">
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase flex justify-between">
                      <span>Real Photo URL (Optional)</span>
                      <span className="text-cyan-400 normal-case font-normal text-[10px]">Overrides Vector Avatar</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. URL to player photo or sports keywords"
                      value={customRealPhotoUrl}
                      onChange={(e) => setCustomRealPhotoUrl(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Pasting an absolute URL will load that photo. Left blank? Unsplash keyword filters will automatically generate a real-life athlete avatar!
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Aesthetic Creative Prompt Descriptor</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="e.g., A historic striker who controls fire, with laser-beam shot power, originating from futuristic Neo-Tokyo clubs."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-lg p-3 text-xs text-white focus:outline-hidden focus:border-cyan-400 leading-relaxed"
                    />
                    <span className="text-[10px] text-zinc-500 mt-1 block">Describe quirks, backstory, or magical visual style keys. Avoid plain text.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isGeneratingCard}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs tracking-widest flex items-center justify-center gap-2 transition-all ${
                      isGeneratingCard 
                        ? "bg-emerald-600/50 text-slate-300 cursor-not-allowed" 
                        : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 cursor-pointer active:scale-95"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    {isGeneratingCard ? "AI SYNTHESIZER PROCESSING..." : "EXECUTE NEURAL DRAFT"}
                  </button>

                  {/* Logs terminal box */}
                  {(isGeneratingCard || generationLogs.length > 0) && (
                    <div className="bg-black border border-emerald-900/40 p-3 rounded-lg font-mono text-[10px] text-emerald-400 mt-2">
                      <p className="text-[11px] font-bold text-emerald-500 mb-1.5 uppercase">// Neural Stream log:</p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {generationLogs.map((log, i) => (
                          <div key={i} className="flex gap-2">
                            <span className="text-emerald-700">&gt;</span>
                            <span>{log}</span>
                          </div>
                        ))}
                        {isGeneratingCard && (
                          <div className="flex items-center gap-1.5 animate-pulse text-cyan-400 mt-1">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Computing parameters...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </form>

                {/* Right side reveal card container */}
                <div className="flex flex-col items-center justify-center border border-dashed border-white/10 bg-white/5 rounded-2xl p-6 h-full min-h-[400px]">
                  {generatedCardResult ? (
                    <div className="flex flex-col items-center gap-4 animate-fade-in">
                      <div className="text-center">
                        <span className="bg-emerald-500/20 text-emerald-300 font-extrabold px-3 py-1 text-xs rounded-full uppercase tracking-wider animate-pulse border border-emerald-400/20">
                          ✨ Model Draft Complete!
                        </span>
                        <h4 className="text-base font-bold text-white mt-2">Inspect Generated Coordinates</h4>
                      </div>

                      {/* Render generated Football Card */}
                      <FootballCard card={generatedCardResult} size="lg" hoverScale={false} />

                      {/* Add or clear buttons */}
                      <div className="flex gap-3 w-full max-w-sm mt-2">
                        <button
                          onClick={() => setGeneratedCardResult(null)}
                          className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-slate-300 rounded-xl text-xs font-bold font-sans border border-white/5 transition-all"
                        >
                          Scrap Draft
                        </button>
                        <button
                          onClick={handleSaveAICardToCollection}
                          className="flex-1 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-xs font-bold font-sans tracking-wide shadow-lg shadow-emerald-900/30 transition-all"
                        >
                          Mint & Claim Card
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400">
                      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-lg">
                        <Sparkles className="w-8 h-8 text-emerald-400" />
                      </div>
                      <p className="font-bold text-white text-sm">Aesthetic Spec Empty</p>
                      <p className="text-xs text-slate-500 mt-1.5 max-w-xs leading-relaxed">
                        Insert details on the left form panel and tap **Neural Draft** to synthesize a custom holographic record!
                      </p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: MARKETPLACE */}
          {activeTab === "marketplace" && (
            <div className="flex flex-col gap-6">
              
              {/* Header block with trends */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="p-4 bg-gradient-to-r from-cyan-900/20 via-slate-900/20 to-indigo-900/25 rounded-2xl border border-white/10 md:col-span-2">
                  <h2 className="text-lg font-black italic text-white uppercase flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" /> GLOBAL TRANSFER MARKETPLACE
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Trade customized cards with other scouts! You can list any card from your roster in exchange for gold coin increments. Simulated participants browse periodically and list premium retro legends!
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="flex justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                    <span>Market Trends</span>
                    <span className="text-emerald-400 animate-pulse">● LIVE</span>
                  </div>
                  <div className="space-y-1.5 my-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-300">Custom AI Cards</span>
                      <span className="text-emerald-400 font-bold">↑ 22% Vol</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-300">Futuristic Icons</span>
                      <span className="text-emerald-400 font-bold">↑ 14% Coin</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab("collection")}
                    className="text-center text-[10px] text-cyan-300 font-bold uppercase tracking-wider"
                  >
                    + Tap collection card to Sell
                  </button>
                </div>

              </div>

              {/* Grid lists: Buy active marketplace assets */}
              <div>
                <h3 className="text-base font-bold italic text-white uppercase mb-3 tracking-wide">
                  Available Player Listings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketItems.map(item => (
                    <div 
                      key={item.id} 
                      className="bg-black/40 border border-white/10 hover:border-cyan-500/20 rounded-2xl p-4 flex flex-col justify-between transition-all"
                    >
                      {/* Top seller metadata */}
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-xs flex items-center justify-center font-bold text-white">👤</span>
                          <span className="text-xs text-zinc-300 font-mono truncate max-w-[124px]">{item.sellerName}</span>
                        </div>
                        {item.card.isCustom && (
                          <span className="bg-emerald-600/30 text-emerald-300 text-[8px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/10 uppercase">
                            Custom Art
                          </span>
                        )}
                      </div>

                      {/* Middle Card presentation row */}
                      <div className="flex gap-4 items-center mb-4 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                        <FootballCard card={item.card} size="sm" hoverScale={false} />
                        
                        <div className="flex-1 flex flex-col justify-between h-full py-1">
                          <div>
                            <h4 className="text-sm font-bold text-white line-clamp-1">{item.card.name}</h4>
                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{item.card.position} • {item.card.nationality}</p>
                            
                            <div className="mt-2 text-slate-300 text-[11px] leading-snug line-clamp-2">
                              {item.card.specialPower ? `Power: ${item.card.specialPower}` : `A dynamic high-rated star player.`}
                            </div>
                          </div>

                          <div className="mt-4">
                            <p className="text-[10px] text-slate-400 font-bold">SALE PRICE:</p>
                            <div className="flex items-center gap-1 font-mono text-base font-black">
                              <span className={item.currency === "coins" ? "text-yellow-400" : "text-cyan-400 animate-pulse text-sm"}>
                                {item.currency === "coins" ? "🪙" : "💎"}
                              </span>
                              <span className={item.currency === "coins" ? "text-yellow-400" : "text-cyan-400"}>
                                {item.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Perform transaction */}
                      {item.sellerName === "Tactician User (You)" ? (
                        <button
                          onClick={() => handleUndoMarketListing(item)}
                          className="w-full py-2 bg-red-600/15 hover:bg-red-600/30 text-red-400 hover:text-white rounded-xl text-xs font-bold font-sans border border-red-500/10 transition-all cursor-pointer"
                        >
                          Cancel / Reclaim Listing
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuyMarketItem(item)}
                          className="w-full py-2 bg-white/5 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-indigo-600 border border-white/10 hover:border-cyan-400 text-white rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                        >
                          BUY CARD
                        </button>
                      )}
                    </div>
                  ))}

                  {marketItems.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-white/5 rounded-2xl border border-dashed border-white/10">
                      No football cards listed on the market right now. List yours to kickstart trade volumes!
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: TRADE HUB */}
          {activeTab === "trade" && (
            <div className="flex flex-col gap-6">
              
              {/* Explanation block */}
              <div className="p-5 bg-gradient-to-r from-zinc-900/40 to-cyan-950/20 rounded-2xl border border-white/10">
                <span className="text-xs uppercase text-cyan-300 font-bold tracking-widest block mb-1">Barter Exchange Contracts</span>
                <h2 className="text-lg font-black italic text-white uppercase">
                  SIMULATED ONLINE TRADING DESK
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Negotiate player-for-player Swaps. Accept offers from simulated global collectors looking to fill positions. Swap duplicates or gold elements to secure super rare Holographics!
                </p>
              </div>

              {/* Trade bids list */}
              <div>
                <h3 className="text-base font-bold italic text-white uppercase mb-3 tracking-wide">
                  Active Simulated Trade Proposals
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tradeOffers.map(offer => (
                    <div 
                      key={offer.id}
                      className="bg-black/35 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/20 transition-all"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{offer.traderAvatar}</span>
                          <div>
                            <span className="text-xs font-bold text-white block leading-none">{offer.traderName}</span>
                            <span className="text-[10px] text-emerald-400 font-mono">Feedback: 99% Positive</span>
                          </div>
                        </div>
                        <span className="bg-white/5 text-zinc-300 text-[10px] font-mono px-2 py-0.5 rounded border border-white/5">
                          Active Proposal
                        </span>
                      </div>

                      {/* Barter display */}
                      <div className="grid grid-cols-5 gap-2 my-3 items-center text-center">
                        
                        {/* Offerer card */}
                        <div className="col-span-2 flex flex-col items-center bg-white/[0.02] p-2 rounded-xl border border-white/5">
                          <p className="text-[9px] text-zinc-400 font-bold uppercase mb-1">They Offer:</p>
                          <FootballCard card={offer.offeredCard} size="sm" hoverScale={false} />
                          <h5 className="text-xs font-bold text-white mt-1.5 truncate max-w-full">{offer.offeredCard.name}</h5>
                        </div>

                        {/* Middle Arrow */}
                        <div className="col-span-1 flex flex-col items-center justify-center">
                          <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin-slow mb-1" />
                          <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest font-mono">FOR</span>
                          {offer.coinsBonus && offer.coinsBonus > 0 && (
                            <div className="mt-1 bg-yellow-500/10 px-1 py-0.5 rounded text-[8px] text-yellow-400 font-black border border-yellow-500/10">
                              +{offer.coinsBonus} Coins
                            </div>
                          )}
                        </div>

                        {/* What they want */}
                        <div className="col-span-2 flex flex-col items-center justify-center p-4 bg-cyan-950/20 rounded-xl border border-dashed border-cyan-500/20 min-h-[160px]">
                          <p className="text-[9px] text-cyan-400 font-black uppercase tracking-widest mb-2">Requested Target:</p>
                          <div className="text-2xl">🃏</div>
                          <p className="text-xs font-bold text-white mt-2 font-sans">{offer.requestedCardType}</p>
                          {offer.requestedPosition && (
                            <p className="text-[10px] text-cyan-300 font-mono mt-0.5">Position: {offer.requestedPosition}</p>
                          )}
                        </div>

                      </div>

                      {/* Bid action */}
                      <div className="mt-2">
                        <button
                          onClick={() => handleAcceptTradeOffer(offer)}
                          className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 font-sans font-bold text-xs text-white tracking-widest rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" /> ACCEPT TRADE TRANSACTION
                        </button>
                      </div>

                    </div>
                  ))}

                  {tradeOffers.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-white/5 rounded-xl border border-dashed border-white/10">
                      All barter offers closed for the moment! Refresh later for more.
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: BATTLE ARENA */}
          {activeTab === "arena" && (
            <div className="flex flex-col gap-6">
              
              {/* Explanation panel */}
              <div className="p-5 bg-gradient-to-r from-red-950/20 via-slate-900/40 to-indigo-950/25 rounded-2xl border border-white/10">
                <span className="text-xs uppercase text-red-400 font-bold tracking-widest block mb-1">Interactive Arena Simulator</span>
                <h2 className="text-xl font-black italic text-white uppercase">
                  3V3 TOURNAMENT CLASH
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Select your elite 3-player line-up, challenge tactical opponent squads, and trigger real-time simulated AI commentary matches evaluated by Google Gemini systems! Earn coin boosts and rating achievements.
                </p>
              </div>

              {/* Arena Game States: Select & Fight or Commentary playback */}
              {!battleReport ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  
                  {/* Left Squad picker (Column-1 & Column-2 combined) */}
                  <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        SELECT YOUR MATCHDAY CONTENDERS ({selectedBattleTeam.length}/3 Selected)
                      </h3>
                      {selectedBattleTeam.length > 0 && (
                        <button 
                          onClick={() => setSelectedBattleTeam([])}
                          className="text-xs text-red-400 hover:underline font-bold uppercase tracking-wider"
                        >
                          Clear Squad
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {userProfile.collection.map(card => {
                        const isChosen = selectedBattleTeam.some(c => c.id === card.id);
                        return (
                          <div
                            key={card.id}
                            onClick={() => handleToggleBattleTeamCard(card)}
                            className={`p-2 rounded-2xl cursor-pointer transition-all ${
                              isChosen 
                                ? "bg-cyan-500/10 border-2 border-cyan-400 shadow-md scale-[1.01]" 
                                : "bg-black/30 border border-white/5 hover:border-white/15 hover:scale-[1.01]"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xxs text-zinc-400 font-bold bg-white/5 px-1 py-0.5 rounded leading-none">{card.position}</span>
                              <span className="text-xs font-mono font-bold text-yellow-400">R: {card.rating}</span>
                            </div>
                            <h5 className="text-xs font-bold text-white truncate mb-2 text-center">{card.name}</h5>
                            
                            <div className="aspect-square w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 font-mono font-bold font-sans text-xs border border-white/5 shadow">
                              {card.name.slice(0, 2).toUpperCase()}
                            </div>

                            <button
                              className={`w-full py-1 rounded text-[10px] font-mono tracking-wider transition-all ${
                                isChosen ? "bg-cyan-500 text-slate-950 font-bold" : "bg-white/5 text-zinc-400"
                              }`}
                            >
                              {isChosen ? "✓ READY" : "TAP TO DRAFT"}
                            </button>
                          </div>
                        );
                      })}

                      {userProfile.collection.length === 0 && (
                        <div className="col-span-full py-8 text-center text-slate-400">
                          Empty inventory collection. Head to the Pack Shop to acquire players!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Challenge launcher configuration (Column-3) */}
                  <div className="bg-black/35 border border-white/10 p-5 rounded-2xl flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-white tracking-widest border-b border-white/10 pb-2 uppercase">
                      CHALLENGE SELECTOR
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Choose Opponent Grade</label>
                      <div className="space-y-2.5">
                        
                        <div 
                          onClick={() => setOpponentCategory("rookie")}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                            opponentCategory === "rookie" 
                              ? "bg-cyan-500/10 border-cyan-400 text-white" 
                              : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/5"
                          }`}
                        >
                          <div className="flex justify-between font-bold">
                            <span>🟢 ROOKIE INDUCTEES</span>
                            <span className="text-[#34d399]">Avg 81</span>
                          </div>
                          <p className="text-[10px] mt-1 text-slate-400">Ideal for seeding record wins and testing card triggers.</p>
                        </div>

                        <div 
                          onClick={() => setOpponentCategory("neon")}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                            opponentCategory === "neon" 
                              ? "bg-cyan-500/10 border-cyan-400 text-white" 
                              : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/5"
                          }`}
                        >
                          <div className="flex justify-between font-bold">
                            <span>🔵 NEON ELITE SQUAD</span>
                            <span className="text-cyan-400">Avg 89</span>
                          </div>
                          <p className="text-[10px] mt-1 text-slate-400">Fierce cyberpunk tactics with futuristic physical features.</p>
                        </div>

                        <div 
                          onClick={() => setOpponentCategory("legend")}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                            opponentCategory === "legend" 
                              ? "bg-cyan-400/10 border-cyan-400 text-white" 
                              : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/5"
                          }`}
                        >
                          <div className="flex justify-between font-bold">
                            <span>👑 RETRO LEGENDS TRIO</span>
                            <span className="text-amber-400">Avg 93</span>
                          </div>
                          <p className="text-[10px] mt-1 text-slate-400">Ronaldinho, Zidane, Yashin. Prepare for legendary battles!</p>
                        </div>

                      </div>
                    </div>

                    <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">YOUR ACTIVE CONTENDERS:</p>
                      {selectedBattleTeam.length > 0 ? (
                        <div className="space-y-1">
                          {selectedBattleTeam.map(c => (
                            <div key={c.id} className="text-xs text-slate-200 flex justify-between">
                              <span>• {c.name}</span>
                              <span className="text-yellow-400 font-mono">Rating: {c.rating}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-red-400 italic">No squads selected yet...</p>
                      )}
                    </div>

                    <button
                      onClick={handleStartArenaBattle}
                      disabled={isSimulatingBattle || selectedBattleTeam.length < 3}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                        selectedBattleTeam.length < 3 
                          ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5" 
                          : isSimulatingBattle
                            ? "bg-red-900/50 text-slate-300 animate-pulse cursor-wait"
                            : "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-950/40 text-white cursor-pointer active:scale-95"
                      }`}
                    >
                      <Sword className="w-4 h-4 animate-bounce" />
                      {isSimulatingBattle ? "EVALUATING MATCH STRETCH..." : "LAUNCH AI BATTLE"}
                    </button>
                  </div>

                </div>
              ) : (
                
                /* Match timeline commentary view screen */
                <div className="bg-black/35 border border-white/10 rounded-2xl p-6 flex flex-col items-center">
                  
                  {/* Score banner widget */}
                  <div className="text-center w-full max-w-lg mb-6">
                    <span className="text-xs text-red-400 uppercase font-black tracking-widest bg-red-950/20 px-3 py-1 rounded-full border border-red-500/15">
                      Stadium Commentary Broadcast
                    </span>
                    <h2 className="text-3xl font-black italic text-cyan-200 uppercase mt-3">
                      CYBER STADIUM CUP
                    </h2>

                    <div className="grid grid-cols-3 items-center mt-6 bg-white/[0.02] p-4 rounded-xl border border-white/10">
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase truncate">Your Squad</p>
                        <div className="flex gap-1 justify-center mt-1">
                          {selectedBattleTeam.map(c => (
                            <span key={c.id} className="text-xxs bg-white/5 border border-white/5 px-1 rounded truncate max-w-[64px]" title={c.name}>
                              {c.name.split(" ")[0]}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-3xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 font-black">
                          {battleReport.scoreLine}
                        </p>
                        <span className="bg-red-650/40 text-zinc-300 text-[9px] font-mono px-2 py-0.5 rounded uppercase mt-2 inline-block">
                          {isBattleFinished ? "FULL TIME" : `LIVE SIMULATION`}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Opposition AI</p>
                        <p className="text-xs text-zinc-350 mt-1 capitalize font-bold">{opponentCategory} XI</p>
                      </div>
                    </div>
                  </div>

                  {/* Playback timeline tracker */}
                  <div className="w-full max-w-xl bg-slate-900 border border-white/15 rounded-xl p-4 min-h-[160px] flex flex-col justify-between relative overflow-hidden">
                    
                    {/* Glowing coordinate grid background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

                    <div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                        <span className="text-xs text-cyan-400 font-bold">
                          ⏱️ Minute: {battleReport.commentaryEvents[activeBattleLogIndex].minute}'
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono font-bold bg-white/5 px-2 py-0.5 rounded uppercase">
                          Action Ref: AI-COMMENTARY
                        </span>
                      </div>

                      {/* Display active event description */}
                      <p className="text-sm text-slate-200 leading-relaxed font-sans italic py-2">
                        "{battleReport.commentaryEvents[activeBattleLogIndex].event}"
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-4 text-xs">
                      <span className="text-zinc-400">Score after play:</span>
                      <strong className="text-white font-mono bg-black px-2.5 py-0.5 rounded border border-white/5">
                        {battleReport.commentaryEvents[activeBattleLogIndex].score}
                      </strong>
                    </div>

                  </div>

                  {/* Advance timelines step controls */}
                  <div className="my-6 flex gap-3 max-w-sm w-full">
                    {!isBattleFinished ? (
                      <button
                        onClick={handleAdvanceCommentary}
                        className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black italic tracking-wide text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        ADVANCE MATCH <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="w-full flex flex-col gap-3">
                        {/* Winner announce card summary */}
                        <div className="bg-slate-900/60 p-4 rounded-xl border border-white/10 text-center animate-fade-in">
                          <p className="text-xs text-zinc-400 font-bold uppercase">Match Summary:</p>
                          <p className="text-xs mt-2 text-slate-300 leading-relaxed italic">
                            {battleReport.matchSummary}
                          </p>
                          <div className={`mt-3 py-1.5 rounded-lg font-black tracking-widest text-[#34d399] uppercase text-xs border border-emerald-500/20 bg-emerald-950/20 ${
                            battleReport.winner === "player" ? "text-green-400 animate-pulse" : battleReport.winner === "draw" ? "text-zinc-300" : "text-red-400 border-red-500/20 bg-red-950/20"
                          }`}>
                            {battleReport.winner === "player" 
                              ? "🏆 YOU WON MATCH ( +500 Coins, +15 Gems )" 
                              : battleReport.winner === "draw"
                                ? "🤝 MATCH ENDED IN NOBLE DRAW ( +250 Coins, +5 Gems )"
                                : "❌ CHALENGE LOST ( +100 Coins, +2 Gems )"
                            }
                          </div>
                        </div>

                        <button
                          onClick={handleResetBattle}
                          className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-slate-300 font-black italic text-xs tracking-wider rounded-xl transition-all border border-white/5 cursor-pointer"
                        >
                          Return to Arena Lobby
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}

        </main>

        {/* RIGHT SIDEBAR PANEL: Leaderboard & Dynamic Trends */}
        <aside className="w-full md:w-72 flex flex-col gap-4 shrink-0">
          
          {/* Leaderboard showcase */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 font-black text-[9px] italic border-bl border-white/5">
              👑 ELITE SCORERS
            </div>
            <h3 className="text-xs font-bold tracking-widest text-slate-400 mb-3 uppercase flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" /> GLOBAL LEADERS
            </h3>

            <div className="space-y-3">
              {LEADERBOARD_USERS.map(user => (
                <div 
                  key={user.rank} 
                  className={`flex items-center gap-2.5 p-2 rounded-lg transition-all ${
                    user.isCurrentUser ? "bg-cyan-500/10 border border-cyan-400/20" : "bg-black/10 border border-transparent hover:bg-white/5"
                  }`}
                >
                  <span className={`font-black text-xs w-4 ${
                    user.rank === 1 ? "text-yellow-400" : user.rank === 2 ? "text-slate-300" : "text-orange-500"
                  }`}>
                    {user.rank}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-sm shadow">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono italic">
                      Holo Rarity: {user.holographicCount} / Card ratings: {user.maxRating}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => alert(`Your current ranking context was updated! Keep opening Cyber and Holo limited packs to rise to Rank 1.`)}
              className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 text-[10px] font-bold rounded-lg border border-white/10 transition-colors uppercase tracking-widest"
            >
              Refresh Active Ranks
            </button>
          </div>

          {/* Quick status board / Information */}
          <div className="bg-blue-600/10 backdrop-blur-md border border-blue-500/20 rounded-2xl p-4 flex-1 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-1 bg-cyan-700 text-[8px] font-black italic">ARENA STATUS</div>
            
            <div>
              <h3 className="text-xs font-extrabold text-blue-300 mb-3 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-cyan-400 animate-spin-slow" /> ACTIVE SCANS
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-slate-300">Active Scouts:</span>
                  <span className="font-mono text-white font-bold">14,202</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-slate-300">Custom Cards Drafted:</span>
                  <span className="font-mono text-emerald-400 font-bold">185,420</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-300">Simulated Server Ping:</span>
                  <span className="font-mono text-cyan-333">28ms</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-white/5">
              <h4 className="text-[10px] font-bold text-slate-400 mb-1">PRO-TIP:</h4>
              <p className="text-[10px] text-slate-400 leading-snug">
                You can generate cards containing absolutely any attribute styles! Combine anime motifs or historic stories into themes.
              </p>
            </div>
          </div>

        </aside>

      </div>

      {/* FOOTER: Frosted bottom dashboard actions */}
      <footer className="h-16 bg-slate-900/80 backdrop-blur-2xl border-t border-white/10 flex items-center justify-between px-6 relative z-30">
        <div className="flex gap-6 max-w-full overflow-x-auto">
          <div 
            onClick={() => setActiveTab("home")} 
            className="flex flex-col items-center gap-0.5 cursor-pointer group shrink-0"
          >
            <span className="text-lg opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all">🛒</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-cyan-300">Shop</span>
          </div>
          <div 
            onClick={() => setActiveTab("collection")} 
            className="flex flex-col items-center gap-0.5 cursor-pointer group shrink-0"
          >
            <span className="text-lg opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all">🃏</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-cyan-300">Roster</span>
          </div>
          <div 
            onClick={() => setActiveTab("lab")} 
            className="flex flex-col items-center gap-0.5 cursor-pointer group shrink-0"
          >
            <span className="text-lg opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all text-emerald-400">🛠️</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-emerald-300">Lab</span>
          </div>
          <div 
            onClick={() => setActiveTab("arena")} 
            className="flex flex-col items-center gap-0.5 cursor-pointer group shrink-0"
          >
            <span className="text-lg opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all text-red-400">⚔️</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-red-300">Battle</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 bg-white/5 rounded-full px-4 py-1.5 border border-white/10 text-xs">
          <span className="text-zinc-400">System Sandbox: <b className="text-[#34d399] font-sans">Active</b></span>
          <div className="w-2 h-2 rounded-full bg-[#34d399]" />
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden xs:block">
            <p className="text-[9px] text-slate-400 leading-none uppercase">Next Flash Event</p>
            <p className="text-xs font-black italic text-pink-500 leading-none mt-1">11h 24m 58s</p>
          </div>
          <button 
            onClick={() => { setActiveTab("arena"); handleResetBattle(); }}
            className="h-10 px-4 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 rounded-xl font-black italic text-xs tracking-wider shadow-lg shadow-pink-900/40 text-white transition-all cursor-pointer select-none"
          >
            AI BATTLE
          </button>
        </div>
      </footer>

      {/* MODAL / BOTTOM SLIDE DRAWER FOR DETAILED CARD INSPECTIONS */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900/90 border border-white/20 p-5 md:p-6 rounded-2xl max-w-2xl w-full flex flex-col md:flex-row gap-6 relative shadow-2xl"
            >
              <button 
                onClick={() => { setSelectedCard(null); setIsListingCard(false); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Glowing mesh aura inside modal */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400/10 blur-[40px] pointer-events-none rounded-full" />

              {/* Column 1: Card Graphic */}
              <div className="flex flex-col items-center shrink-0">
                <FootballCard card={selectedCard} size="lg" hoverScale={false} />
                <span className="text-[10px] text-slate-500 font-mono mt-2 tracking-widest uppercase">ID: {selectedCard.id.slice(0, 12)}...</span>
              </div>

              {/* Column 2: Player Stats, Bio & Actions */}
              <div className="flex-1 flex flex-col justify-between py-1 relative z-10 text-xs text-slate-300">
                <div>
                  <div className="flex items-center gap-1.5 border-b border-white/10 pb-2 mb-3">
                    <span className="bg-yellow-500/10 text-yellow-500 font-extrabold text-[10px] px-2 py-0.5 rounded border border-yellow-500/10 uppercase">
                      {selectedCard.cardType}
                    </span>
                    {selectedCard.isHolographic && (
                      <span className="bg-purple-500/20 text-purple-300 font-extrabold text-[10px] px-2 py-0.5 rounded border border-purple-500/10 uppercase">
                        HOLO
                      </span>
                    )}
                    {selectedCard.isCustom && (
                      <span className="bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] px-2 py-0.5 rounded border border-emerald-500/10 uppercase">
                        AI DESIGN
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight">{selectedCard.name}</h3>
                  <p className="text-xs text-cyan-300 uppercase tracking-widest font-mono mt-1">{selectedCard.club} • {selectedCard.nationality}</p>

                  <p className="mt-3 text-slate-300 leading-relaxed italic text-[11.5px] bg-white/[0.02] p-2.5 rounded border border-white/5">
                    {selectedCard.shortBio || "A highly skilled player, bringing unique style, pace, and matchmaker control coordinates to your rosters."}
                  </p>

                  {/* Power description */}
                  {selectedCard.specialPower && (
                    <div className="mt-4 p-3 rounded-lg border border-cyan-500/15 bg-cyan-950/20">
                      <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-1">
                        <Zap className="w-4 h-4" />
                        <span className="uppercase text-[11px] tracking-wider">Special Power: {selectedCard.specialPower}</span>
                      </div>
                      <p className="text-[11px] text-zinc-350 italic">{selectedCard.powerDescription}</p>
                    </div>
                  )}
                </div>

                {/* Sell Listing interface directly nested inside drawer details */}
                <div className="mt-6 border-t border-white/10 pt-4">
                  {isLisingCard ? (
                    <div className="bg-black/40 p-3 rounded-xl border border-white/10 animate-fade-in flex flex-col gap-2.5">
                      <p className="text-[10px] font-bold text-white uppercase">Define Transfer Market Cost:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] text-slate-400 font-bold mb-1">AMOUNT</label>
                          <input
                            type="number"
                            value={listingPrice}
                            min={1}
                            onChange={(e) => setListingPrice(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-slate-400 font-bold mb-1">CURRENCY</label>
                          <select
                            value={listingCurrency}
                            onChange={(e) => setListingCurrency(e.target.value as any)}
                            className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-xs text-white"
                          >
                            <option value="coins">Coins (🪙)</option>
                            <option value="gems">Gems (💎)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2.5 mt-1.5">
                        <button
                          onClick={() => setIsListingCard(false)}
                          className="flex-1 py-1.5 bg-zinc-800 text-slate-300 text-xxs font-bold rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleListCardToMarket}
                          className="flex-1 py-1.5 bg-emerald-600 text-white hover:bg-emerald-500 text-xxs font-bold rounded shadow"
                        >
                          List Elements
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      <button
                        onClick={() => setSelectedCard(null)}
                        className="py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-slate-300 text-xs font-bold rounded-xl flex-1 transition-all"
                      >
                        Close Detail
                      </button>

                      {/* Display Marketplace buttons only if it belongs to their active collection roster */}
                      {userProfile.collection.some(c => c.id === selectedCard.id) && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedCard(null);
                              setActiveTab("lab");
                              setCustomName(selectedCard.name);
                              setCustomPosition(selectedCard.position);
                              setCustomPrompt(`Inspired by ${selectedCard.name}, playing in ${selectedCard.position} with extreme high energy.`);
                            }}
                            className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all border border-white/15 flex-1"
                          >
                            Remix Card (Lab)
                          </button>
                          <button
                            onClick={() => {
                              setListingPrice(selectedCard.rating * 15);
                              setIsListingCard(true);
                            }}
                            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex-1 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1"
                          >
                            <TrendingUp className="w-3.5 h-3.5" /> Sell Card
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PACK OPENING REVEAL SIMULATOR MODAL OVERLAY */}
      <AnimatePresence>
        {isOpeningPack && openedCards.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center p-4 relative"
          >
            {/* Holographic glowing orb background highlights */}
            <div className="absolute top-1/4 w-96 h-96 bg-purple-500/25 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />

            <div className="text-center z-10 max-w-sm w-full">
              <span className="text-[10px] text-cyan-400 tracking-widest font-black uppercase bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/15">
                Pack Opening Sequence
              </span>
              <h2 className="text-2xl font-black italic text-white uppercase mt-3 tracking-tight">
                CARD FLIP REVEAL
              </h2>
              <p className="text-xs text-slate-400 mt-1 mb-6">
                Revealing card <b>{currentOpenedCardIndex + 1} of {openedCards.length}</b> inside your pack!
              </p>
            </div>

            {/* Glowing orbital presentation for individual opened cards */}
            <div className="my-2 select-none relative z-10 flex flex-col items-center">
              
              {/* Backglow panel matching rating and holographic attributes */}
              <div className={`absolute w-72 h-72 rounded-full blur-[80px] pointer-events-none -translate-y-12 shrink-0 ${
                openedCards[currentOpenedCardIndex].isHolographic 
                  ? "bg-purple-600/30" 
                  : openedCards[currentOpenedCardIndex].cardType === "Retro Legend"
                    ? "bg-amber-500/30"
                    : "bg-yellow-500/20"
              }`} />

              <motion.div
                key={currentOpenedCardIndex}
                initial={{ rotateY: 180, scale: 0.8 }}
                animate={{ rotateY: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="perspective-[1000px]"
              >
                <FootballCard card={openedCards[currentOpenedCardIndex]} size="lg" hoverScale={true} />
              </motion.div>

              {/* Special features badge below card */}
              <div className="mt-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 max-w-xs text-center z-10 animate-fade-in text-xs">
                <span className="text-zinc-400 block font-mono">Card Type:</span>
                <strong className={`block text-sm uppercase mt-0.5 ${
                  openedCards[currentOpenedCardIndex].isHolographic ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-400 font-extrabold" : "text-white"
                }`}>
                  {openedCards[currentOpenedCardIndex].cardType} {openedCards[currentOpenedCardIndex].isHolographic ? "(HOLO)" : ""}
                </strong>
                {openedCards[currentOpenedCardIndex].specialPower && (
                  <p className="text-[10px] text-zinc-400 mt-1 italic font-sans truncate">
                    ✨ "{openedCards[currentOpenedCardIndex].specialPower}" Power Drafted!
                  </p>
                )}
              </div>
            </div>

            {/* Next card navigation step control */}
            <div className="mt-8 z-10">
              <button
                onClick={handleNextOpenedCard}
                className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 hover:text-white font-sans font-black italic tracking-widest text-xs rounded-xl shadow-lg shadow-cyan-950/30 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
              >
                {currentOpenedCardIndex < openedCards.length - 1 ? (
                  <>NEXT CARD <ChevronRight className="w-4 h-4" /></>
                ) : (
                  <>CLAIM ALL CARDS & CLOSE ✓</>
                )}
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
