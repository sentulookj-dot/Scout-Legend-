import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initializer for Google GenAI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not defined");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST Endpoint: Heartbeat check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

// REST Endpoint: Generate custom football card details using AI
app.post("/api/generate-card", async (req, res) => {
  const { prompt, preferredName, preferredPosition } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "A custom description prompt is required." });
  }

  try {
    const ai = getGenAI();
    
    const promptInstructions = `
      Create a highly dynamic and creative football (soccer) card based on this prompt: "${prompt}".
      ${preferredName ? `Make sure the player's name is closely based on: "${preferredName}".` : ""}
      ${preferredPosition ? `Make sure the player's position is exactly: "${preferredPosition}".` : ""}
      Provide balanced stats (pace, shooting, passing, dribbling, defending, physical) between 40 and 99.
      The overall rating should be between 70 and 99 depending on how elite the player sounds, but stay sensible.
      Determine if the card should be "Rare gold", "Holographic Elite", "Retro Legend", or "Futuristic Icon" based on the prompt's themes.
      Make up a wild, distinct Special Power (e.g., "Thunder Strike Strike", "Zero-Gravity Reflexes", "Magnetic Touch") and a fun, engaging 1-sentence description of it.
      Add a short 2-sentence bio of the player's football journey or quirks.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptInstructions,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["name", "position", "nationality", "club", "rating", "stats", "cardType", "specialPower", "powerDescription", "shortBio"],
          properties: {
            name: { type: Type.STRING },
            position: { type: Type.STRING, description: "A soccer position code such as ST, CAM, LW, RW, CM, CB, LB, RB, GK." },
            nationality: { type: Type.STRING },
            club: { type: Type.STRING },
            rating: { type: Type.INTEGER },
            cardType: { type: Type.STRING, description: "Must be one of: 'Rare gold', 'Holographic Elite', 'Retro Legend', 'Futuristic Icon'." },
            stats: {
              type: Type.OBJECT,
              required: ["pace", "shooting", "passing", "dribbling", "defending", "physical"],
              properties: {
                pace: { type: Type.INTEGER },
                shooting: { type: Type.INTEGER },
                passing: { type: Type.INTEGER },
                dribbling: { type: Type.INTEGER },
                defending: { type: Type.INTEGER },
                physical: { type: Type.INTEGER },
              }
            },
            specialPower: { type: Type.STRING },
            powerDescription: { type: Type.STRING },
            shortBio: { type: Type.STRING },
          }
        }
      }
    });

    const text = response.text || "{}";
    const parsedData = JSON.parse(text);
    return res.json(parsedData);

  } catch (error: any) {
    console.error("Gemini card generation error, using fallback creator:", error.message);
    
    // Fallback generation logic to guarantee system robustness
    const mockPositions = ["ST", "CAM", "LW", "RW", "CM", "CB", "GK"];
    const mockNationalities = ["Brazil", "Argentina", "France", "England", "Germany", "Norway", "Spain", "Japan", "USA"];
    const mockClubs = ["Metropolis United", "Nebula F.C.", "Pixel Athletic", "Dynamo Retro", "Cosmic City"];
    const mockPowers = [
      { name: "Supernova Speed", desc: "Instantly teleports past defenders leaving a trailing light show." },
      { name: "Rubber Wall GK", desc: "Bounces every incoming striker strike straight back to midfield." },
      { name: "Tornado Dribble", desc: "Creates a whirlwind that disorients the opposing midfield line." },
      { name: "Laser Shot", desc: "Fires a strike that can tear through the net itself." }
    ];

    const chosenPosition = preferredPosition || mockPositions[Math.floor(Math.random() * mockPositions.length)];
    const chosenName = preferredName || prompt.split(" ").slice(0, 2).join(" ") || "Unknown Legend";
    const randomPower = mockPowers[Math.floor(Math.random() * mockPowers.length)];

    const fallbackCard = {
      name: chosenName,
      position: chosenPosition,
      nationality: mockNationalities[Math.floor(Math.random() * mockNationalities.length)],
      club: mockClubs[Math.floor(Math.random() * mockClubs.length)],
      rating: Math.floor(Math.random() * 15) + 84, // 84-98
      cardType: "Rare gold",
      stats: {
        pace: Math.floor(Math.random() * 20) + 75,
        shooting: Math.floor(Math.random() * 20) + 75,
        passing: Math.floor(Math.random() * 20) + 75,
        dribbling: Math.floor(Math.random() * 20) + 75,
        defending: Math.floor(Math.random() * 25) + 60,
        physical: Math.floor(Math.random() * 20) + 75,
      },
      specialPower: randomPower.name,
      powerDescription: randomPower.desc,
      shortBio: `A legendary custom footballer known for their signature prowess and incredible style crafted from original inspiration.`
    };

    return res.json(fallbackCard);
  }
});

// REST Endpoint: AI Battle Commentary generation
app.post("/api/evaluate-battle", async (req, res) => {
  const { playerTeam, aiTeam, arenaName, difficulty } = req.body;

  if (!playerTeam || !aiTeam) {
    return res.status(400).json({ error: "Both player and AI teams are required." });
  }

  try {
    const ai = getGenAI();

    const playerNames = playerTeam.map((c: any) => `${c.name} (${c.position}, Rating: ${c.rating})`).join(", ");
    const aiNames = aiTeam.map((c: any) => `${c.name} (${c.position}, Rating: ${c.rating})`).join(", ");

    const battlePrompt = `
      Evaluate an intense card-battle soccer match in the "${arenaName || "Ultimate Arena"}" on "${difficulty || "Normal"}" difficulty.
      Player Team Cards: [${playerNames}]
      AI Opponent Team Cards: [${aiNames}]

      Analyze the strengths, ratings, and unique Special Powers of these cards.
      Determine the final score of this simulated matchup. Make it a dramatic, high-stakes match!
      Provide a timeline of 4 distinct key events (at different minutes, e.g. 14', 44', 68', 89') describing highlights.
      At least one highlights event must feature a card activating their specific Special Power (e.g. "Searing Sprint", "Laser Shot", etc.) to score, block, or dribble.
      Output a beautiful final match response in JSON matching the specified format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: battlePrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["scoreLine", "winner", "commentaryEvents", "matchSummary"],
          properties: {
            scoreLine: { type: Type.STRING, description: "e.g. '3 - 2' or '1 - 0'" },
            winner: { type: Type.STRING, description: "Must be exactly 'player', 'ai', or 'draw'." },
            commentaryEvents: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["minute", "event", "score"],
                properties: {
                  minute: { type: Type.INTEGER, description: "Minute of match between 1 and 90" },
                  event: { type: Type.STRING, description: "Highly engaging play-by-play description featuring specific card names and special power applications." },
                  score: { type: Type.STRING, description: "Overall scoreline after this event, e.g. '1 - 0'" },
                }
              }
            },
            matchSummary: { type: Type.STRING, description: "A general wrap-up highlighting key players and tactical highlights in 2-3 sentences." }
          }
        }
      }
    });

    const text = response.text || "{}";
    const parsedData = JSON.parse(text);
    return res.json(parsedData);

  } catch (error: any) {
    console.error("Gemini battle commentary error, using fallback evaluator:", error.message);

    // Dynamic high-stakes fallback evaluator
    const pAvg = playerTeam.reduce((sum: number, c: any) => sum + c.rating, 0) / playerTeam.length;
    const aAvg = aiTeam.reduce((sum: number, c: any) => sum + c.rating, 0) / aiTeam.length;

    let pGoals = Math.floor(Math.random() * 3);
    let aGoals = Math.floor(Math.random() * 3);

    // Adjust bias based on performance
    if (pAvg > aAvg + 3) {
      pGoals += 1;
    } else if (aAvg > pAvg + 3) {
      aGoals += 1;
    }

    const winner = pGoals > aGoals ? "player" : aGoals > pGoals ? "ai" : "draw";
    const scoreLine = `${pGoals} - ${aGoals}`;

    const playerHero = playerTeam[Math.floor(Math.random() * playerTeam.length)];
    const aiHero = aiTeam[Math.floor(Math.random() * aiTeam.length)];

    const fallbackCommentary = {
      scoreLine,
      winner,
      commentaryEvents: [
        {
          minute: 12,
          event: `Fantastic opening display! ${playerHero.name} drives down the wing with dazzling dribbles, trying to break the deadlock early.`,
          score: "0 - 0"
        },
        {
          minute: 38,
          event: `GOAL! ${aiHero.name} unleashes their signature ability ${aiHero.specialPower || "Elite Strike"} and unleashes a pile-driver into the top corner. Special power activated!`,
          score: winner === "ai" || Math.random() > 0.5 ? `0 - 1` : `1 - 0`
        },
        {
          minute: 65,
          event: `Counter-attack! ${playerHero.name} triggers ${playerHero.specialPower || "Tactical Surge"}, weaving past three defenders with supreme poise and drilling a low effort. Net buster!`,
          score: `1 - 1`
        },
        {
          minute: 88,
          event: `Drama in the final minutes! Both sides pour forward into the box. Spectacular defense saves the day, leaving the crowd completely breathless.`,
          score: scoreLine
        }
      ],
      matchSummary: `A spectacular offline simulated encounter! Both managers showcased dynamic football. ${winner === "player" ? `${playerHero.name} clinched match MVP for the player's side.` : winner === "ai" ? `${aiHero.name} emerged as the winning talisman for the opposition.` : "Both squads fought tooth and nail to a noble stalemate."}`
    };

    return res.json(fallbackCommentary);
  }
});

// Serve frontend assets using Vite middleware or Static Server
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite dev server integration
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware loaded.");
  } else {
    // Production serving of compiled React app
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Static production build serving from dist/ loaded.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express container server successfully booted on port ${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to bootstrap high-performance express container server:", err);
});
