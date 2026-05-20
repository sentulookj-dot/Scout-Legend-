import React from "react";
import { motion } from "motion/react";
import { Card, CardType } from "../types";
import { Sparkles, Zap, Award, Flame } from "lucide-react";

interface FootballCardProps {
  card: Card;
  onClick?: () => void;
  hoverScale?: boolean;
  size?: "sm" | "md" | "lg";
  isDragging?: boolean;
  key?: React.Key;
}

export default function FootballCard({
  card,
  onClick,
  hoverScale = true,
  size = "md",
  isDragging = false
}: FootballCardProps) {
  const { name, position, rating, stats, cardType, isHolographic, isCustom, specialPower, club, nationality } = card;

  const [imgHasError, setImgHasError] = React.useState(false);
  const [imgLoaded, setImgLoaded] = React.useState(false);

  // Setup distinct portrait styles contextually
  let faceStyle: "avataaars" | "notionists" | "pixel-art" | "bottts" | "adventurer" = "avataaars";
  if (card.avatarStyle) {
    faceStyle = card.avatarStyle;
  } else if (cardType === "Retro Legend") {
    faceStyle = "pixel-art";
  } else if (cardType === "Futuristic Icon") {
    faceStyle = "bottts";
  }

  const seed = card.avatarSeed || name;
  const vectorAvatarUrl = `https://api.dicebear.com/7.x/${faceStyle}/svg?seed=${encodeURIComponent(seed)}`;

  // Determine if we should show real life photos or illustrations based on global preference
  const [useRealPics, setUseRealPics] = React.useState(() => {
    const saved = localStorage.getItem("card_art_mode");
    return saved !== "illustrated"; // defaults to true (Real Photos)
  });

  // Keep state updated in real-time when style is changed globally
  React.useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("card_art_mode");
      setUseRealPics(saved !== "illustrated");
    };
    window.addEventListener("card_art_changed", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("card_art_changed", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Map each standard player card to a high-quality real-life action sports / athlete portrait on Unsplash
  const REAL_LIFE_MAPPING: Record<string, string> = {
    "leg-ronaldinho": "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=350&h=350", // joyful skill
    "leg-messi": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=350&h=350", // match stadium
    "leg-ronaldo": "https://images.unsplash.com/photo-1524015368236-bbf6f72545b6?auto=format&fit=crop&q=80&w=350&h=350", // muscular focused forward sportsman profile
    "leg-zidane": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=350&h=350", // elegant midfielder/manager look
    "leg-yashin": "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=350&h=350", // black spider goalie leap
    "fut-haaland": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=350&h=350", // strong athletic cyborg profile
    "std-mbappe": "https://images.unsplash.com/photo-1560272594-9f45366743d5?auto=format&fit=crop&q=80&w=350&h=350", // fast-paced lightning winger sprint
    "std-de-bruyne": "https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=350&h=350", // master playmaker beard look
    "std-bellingham": "https://images.unsplash.com/photo-1606925797300-0b35e9d17400?auto=format&fit=crop&q=80&w=350&h=350", // dynamic celebration arms wide
    "std-van-dijk": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=350&h=350", // calm colossus beard defender styling
    "std-bana-gk": "https://images.unsplash.com/photo-1622163614106-5a3bc98863b6?auto=format&fit=crop&q=80&w=350&h=350", // goalkeeper gloves intense profile
    "std-yamal": "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=350&h=350", // young smile rising winger
    "std-saka": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=350&h=350", // starboy winger smiling match ambiance
    "std-valverde": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=350&h=350"  // Uruguayan powerhouse CM style
  };

  let avatarUrl = vectorAvatarUrl;
  
  if (useRealPics) {
    if (card.imageUrl) {
      avatarUrl = card.imageUrl;
    } else if (REAL_LIFE_MAPPING[card.id]) {
      avatarUrl = REAL_LIFE_MAPPING[card.id];
    } else if (card.isCustom) {
      // Dynamic themed sports background matching player attributes
      const positionTag = position === "GK" ? "goalkeeper" : position === "CB" || position === "LB" || position === "RB" ? "defender" : "soccer";
      const styleSeed = encodeURIComponent(card.name);
      avatarUrl = `https://images.unsplash.com/featured/350x350/?soccer,athlete,${positionTag}&sig=${styleSeed}`;
    } else {
      avatarUrl = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=350&h=350";
    }
  }

  // Reset loading states when image changes to maintain smooth fade entrances
  React.useEffect(() => {
    setImgLoaded(false);
    setImgHasError(false);
  }, [avatarUrl]);

  // Custom styling parameters based on card type
  let bgStyle = "";
  let borderStyle = "";
  let textStyle = "text-white";
  let labelStyle = "text-zinc-300";
  let ribbonBg = "";
  let ratingColor = "text-yellow-400";

  switch (cardType) {
    case "Retro Legend":
      bgStyle = "bg-gradient-to-b from-amber-950 via-yellow-950 to-amber-900";
      borderStyle = "border-2 border-amber-400 shadow-lg shadow-amber-950/50";
      ribbonBg = "bg-amber-500/20 text-amber-200 border border-amber-400/30";
      ratingColor = "text-amber-400 font-extrabold";
      break;
    case "Futuristic Icon":
      bgStyle = "bg-gradient-to-b from-zinc-950 via-teal-980 to-cyan-950";
      borderStyle = "border-2 border-cyan-400 shadow-lg shadow-cyan-950/60";
      ribbonBg = "bg-cyan-500/20 text-cyan-200 border border-cyan-400/30";
      ratingColor = "text-cyan-400 font-extrabold";
      break;
    case "Rare gold":
      bgStyle = "bg-gradient-to-b from-yellow-950 via-amber-900 to-yellow-950";
      borderStyle = "border-2 border-yellow-500 shadow-md shadow-yellow-950/40";
      ribbonBg = "bg-yellow-500/20 text-yellow-200 border border-yellow-500/30";
      ratingColor = "text-yellow-400";
      break;
    case "Standard Gold":
      bgStyle = "bg-gradient-to-b from-zinc-900 via-stone-850 to-zinc-900";
      borderStyle = "border border-yellow-600/60";
      ribbonBg = "bg-zinc-800 text-yellow-300 border border-yellow-600/30";
      ratingColor = "text-yellow-500";
      break;
    case "Standard Silver":
      bgStyle = "bg-gradient-to-b from-zinc-800 via-slate-750 to-zinc-800";
      borderStyle = "border border-zinc-500";
      ribbonBg = "bg-zinc-700 text-zinc-150 border border-zinc-600/30";
      ratingColor = "text-zinc-300";
      break;
    default:
      bgStyle = "bg-zinc-800";
      borderStyle = "border border-zinc-700";
      ribbonBg = "bg-zinc-700 text-white";
  }

  // Dimension classes
  let cardDim = "w-64 h-96";
  let statsGap = "gap-y-1 gap-x-2";
  let statNameSize = "text-xxs";
  let statValSize = "text-sm";
  let nameSize = "text-lg";

  if (size === "sm") {
    cardDim = "w-44 h-64";
    statsGap = "gap-y-0.5 gap-x-1";
    statNameSize = "text-[9px]";
    statValSize = "text-xs";
    nameSize = "text-sm";
  } else if (size === "lg") {
    cardDim = "w-80 h-112";
    statsGap = "gap-y-2 gap-x-3";
    statNameSize = "text-xs";
    statValSize = "text-base";
    nameSize = "text-2xl";
  }

  // Get initials or icon representer for visual face
  const getInitials = (pName: string) => {
    return pName
      .split(" ")
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Holographic overlay classes
  const holoClass = isHolographic 
    ? "after:absolute after:inset-0 after:z-10 after:pointer-events-none after:bg-linear-to-tr after:from-purple-500/20 after:via-cyan-400/20 after:to-pink-500/20 after:mix-blend-overlay after:content-[''] after:animate-pulse hover:after:from-pink-500/30 hover:after:via-cyan-400/35 hover:after:to-yellow-300/30 shadow-[0_0_15px_rgba(236,72,153,0.3)] animate-shimmer" 
    : "";

  return (
    <motion.div
      id={`card-${card.id}`}
      whileHover={hoverScale ? { scale: 1.04, rotateY: 3, rotateX: 3 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`relative select-none rounded-2xl p-4 flex flex-col justify-between overflow-hidden cursor-pointer ${bgStyle} ${borderStyle} ${cardDim} ${holoClass}`}
    >
      {/* Glossy sheen overlay */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none skew-y-12 origin-top-left -translate-y-6" />

      {/* Foil holographic reflections */}
      {isHolographic && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.15),transparent_60%)] z-0" />
      )}

      {/* Top Header Row of Football Card */}
      <div className="flex justify-between items-start z-10">
        <div className="flex flex-col items-center">
          <span className={`font-mono leading-none tracking-tight ${ratingColor} ${size === "sm" ? "text-xl" : "text-3xl"}`}>
            {rating}
          </span>
          <span className={`font-bold font-sans ${size === "sm" ? "text-xxs" : "text-xs"} ${textStyle} bg-black/35 px-1.5 py-0.5 rounded mt-1`}>
            {position}
          </span>
        </div>

        {/* Badges / Extras */}
        <div className="flex flex-col gap-1 items-end">
          {isCustom && (
            <span className="bg-emerald-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
              <Sparkles className="w-2.5 h-2.5" /> AI
            </span>
          )}
          {isHolographic && (
            <span className="bg-[linear-gradient(to_right,#db2777,#7c3aed)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm animate-pulse">
              <Award className="w-2.5 h-2.5" /> HOLO
            </span>
          )}
        </div>
      </div>

      {/* Visual Avatar / Center Illustration */}
      <div className="flex-1 flex items-center justify-center relative my-1 z-10 overflow-visible">
        {/* Dynamic backdrop glow */}
        <div className={`absolute w-3/4 h-3/4 rounded-full blur-2xl filter opacity-45 pointer-events-none ${
          cardType === "Futuristic Icon" ? "bg-cyan-500/50" :
          cardType === "Retro Legend" ? "bg-amber-400/50" :
          cardType === "Rare gold" ? "bg-yellow-500/50" : "bg-zinc-650/50"
        }`} />

        <div className={`relative flex items-center justify-center select-none ${
          size === "sm" ? "w-20 h-20" : size === "lg" ? "w-36 h-36" : "w-28 h-28"
        } relative group-hover:scale-110 transition-transform duration-300`}>
          
          {/* Main Avatar Illustration */}
          {!imgHasError ? (
            <img
              src={avatarUrl}
              alt={name}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-contain z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)] transition-opacity duration-300 ${
                imgLoaded ? "opacity-100 animate-fade-in" : "opacity-0 absolute"
              }`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgHasError(true)}
            />
          ) : null}

          {/* Clean skeleton/initials fallback before loading finishes or on error */}
          {(!imgLoaded || imgHasError) && (
            <div className={`rounded-full flex items-center justify-center font-bold tracking-widest leading-none select-none text-white ${
              size === "sm" ? "w-16 h-16 text-xl" : "w-24 h-24 text-3xl"
            } bg-linear-to-b from-white/10 to-white/5 border border-white/15 backdrop-blur-xs relative z-0 shadow-inner`}>
              <span className="relative z-10 opacity-70">{getInitials(name)}</span>
              
              {/* Aesthetic grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4px_4px] rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* Card Info Bar (Club, Player Name, Nationality) */}
      <div className="text-center z-10 flex flex-col items-center">
        <h3 className={`font-sans font-bold uppercase tracking-tight text-white line-clamp-1 w-full text-center ${nameSize}`}>
          {name}
        </h3>
        <div className="flex items-center gap-1.5 mt-0.5 text-xxs">
          <span className="text-zinc-300 font-medium tracking-wide lowercase italic">{club}</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400 bg-white/5 px-1 rounded uppercase tracking-wider">{nationality.slice(0, 3)}</span>
        </div>

        {/* Power indicator for card */}
        {specialPower && size !== "sm" && (
          <div className={`mt-1.5 px-2 py-0.5 rounded-full ${ribbonBg} flex items-center gap-1 max-w-full`}>
            <Zap className={`w-3 h-3 ${cardType === "Futuristic Icon" ? "text-cyan-400" : "text-amber-400"}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider truncate">
              {specialPower}
            </span>
          </div>
        )}
      </div>

      {/* Six Main Stats grid */}
      <div className={`grid grid-cols-3 mt-3 pt-2 border-t border-white/10 text-center z-10 ${statsGap}`}>
        <div className="flex flex-col">
          <span className={`font-mono font-bold text-white ${statValSize}`}>{stats.pace}</span>
          <span className={`font-sans uppercase tracking-widest ${statNameSize} ${labelStyle}`}>PAC</span>
        </div>
        <div className="flex flex-col">
          <span className={`font-mono font-bold text-white ${statValSize}`}>{stats.shooting}</span>
          <span className={`font-sans uppercase tracking-widest ${statNameSize} ${labelStyle}`}>SHO</span>
        </div>
        <div className="flex flex-col">
          <span className={`font-mono font-bold text-white ${statValSize}`}>{stats.passing}</span>
          <span className={`font-sans uppercase tracking-widest ${statNameSize} ${labelStyle}`}>PAS</span>
        </div>
        <div className="flex flex-col">
          <span className={`font-mono font-bold text-white ${statValSize}`}>{stats.dribbling}</span>
          <span className={`font-sans uppercase tracking-widest ${statNameSize} ${labelStyle}`}>DRI</span>
        </div>
        <div className="flex flex-col">
          <span className={`font-mono font-bold text-white ${statValSize}`}>{stats.defending}</span>
          <span className={`font-sans uppercase tracking-widest ${statNameSize} ${labelStyle}`}>DEF</span>
        </div>
        <div className="flex flex-col">
          <span className={`font-mono font-bold text-white ${statValSize}`}>{stats.physical}</span>
          <span className={`font-sans uppercase tracking-widest ${statNameSize} ${labelStyle}`}>PHY</span>
        </div>
      </div>
    </motion.div>
  );
}
