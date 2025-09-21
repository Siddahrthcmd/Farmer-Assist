import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertQuerySchema } from "@shared/schema";

// Language detection function
function detectLanguage(text: string): string {
  const malayalamPattern = /[\u0D00-\u0D7F]/;
  const hindiPattern = /[\u0900-\u097F]/;
  const tamilPattern = /[\u0B80-\u0BFF]/;
  
  if (malayalamPattern.test(text)) return 'malayalam';
  if (hindiPattern.test(text)) return 'hindi';
  if (tamilPattern.test(text)) return 'tamil';
  return 'english';
}

// System prompt generation
function getSystemPrompt(language: string, location?: string | null, crops?: string | null): string {
  const prompts = {
    malayalam: `നിങ്ങൾ കേരള സർക്കാരിന്റെ കൃഷി വകുപ്പിന്റെ AI കൃഷി ഉപദേശകനാണ്. കേരളത്തിലെ കർഷകർക്ക് കൃഷിസംബന്ധമായ ശാസ്ത്രീയവും പ്രായോഗികവുമായ ഉപദേശങ്ങൾ നൽകുക. ${location ? `ഉപയോക്താവിന്റെ സ്ഥലം: ${location}` : ''} ${crops ? `കർഷകന്റെ പ്രധാന വിളകൾ: ${crops}` : ''} മലയാളത്തിൽ വിശദമായി മറുപടി നൽകുക.`,
    hindi: `आप केरल सरकार के कृषि विभाग के AI कृषि सलाहकार हैं। केरल के किसानों को कृषि संबंधी वैज्ञानिक और व्यावहारिक सलाह दें। ${location ? `उपयोगकर्ता का स्थान: ${location}` : ''} ${crops ? `किसान की मुख्य फसलें: ${crops}` : ''} हिंदी में विस्तृत उत्तर दें।`,
    tamil: `நீங்கள் கேரள அரசின் விவசாயத் துறையின் AI விவசாய ஆலோசகர். கேரளாவின் விவசாயிகளுக்கு விவசாயம் தொடர்பான அறிவியல் மற்றும் நடைமுறை ஆலோசனைகளை வழங்குங்கள். ${location ? `பயனாளரின் இடம்: ${location}` : ''} ${crops ? `விவசாயியின் முக்கிய பயிர்கள்: ${crops}` : ''} தமிழில் விரிவான பதில் கொடுங்கள்।`,
    english: `You are an AI agricultural advisor for the Kerala Government Department of Agriculture. Provide scientific and practical farming advice to farmers in Kerala. ${location ? `User location: ${location}` : ''} ${crops ? `Farmer's main crops: ${crops}` : ''} Respond in English with detailed guidance.`
  };
  
  return prompts[language as keyof typeof prompts] || prompts.english;
}

// Query categorization
function categorizeQuery(question: string): string {
  const categories = {
    'pest-disease': ['കീടങ്ങൾ', 'രോഗം', 'കീട', 'pest', 'disease', 'insect', 'bug'],
    'nutrition': ['പോഷക', 'വളം', 'nutrition', 'fertilizer', 'manure'],
    'irrigation': ['വെള്ളം', 'നനയ്ക്കൽ', 'water', 'irrigation', 'watering'],
    'weather': ['കാലാവസ്ഥ', 'മഴ', 'weather', 'rain', 'climate'],
    'seeds': ['വിത്ത്', 'seed', 'variety', 'സീഡ്'],
    'harvest': ['വിളവെടുപ്പ്', 'harvest', 'yield', 'വിളവ്']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => question.toLowerCase().includes(keyword))) {
      return category;
    }
  }
  
  return 'general';
}

// Perplexity API call
async function callPerplexityAPI(systemPrompt: string, question: string): Promise<string | null> {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
        stream: false
      })
    });

    if (!response.ok) {
      console.error('Perplexity API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Error calling Perplexity API:', error);
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Advisory content routes
  app.get("/api/advisories", async (req, res) => {
    try {
      const advisories = await storage.getAdvisories();
      res.json(advisories);
    } catch (error) {
      console.error("Error fetching advisories:", error);
      res.status(500).json({ error: "Failed to fetch advisories" });
    }
  });

  app.get("/api/advisories/:id", async (req, res) => {
    try {
      const advisory = await storage.getAdvisory(req.params.id);
      if (!advisory) {
        return res.status(404).json({ error: "Advisory not found" });
      }
      res.json(advisory);
    } catch (error) {
      console.error("Error fetching advisory:", error);
      res.status(500).json({ error: "Failed to fetch advisory" });
    }
  });

  // Query routes (protected)
  app.get("/api/queries", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    try {
      const queries = await storage.getQueriesByUser(req.user!.id);
      res.json(queries);
    } catch (error) {
      console.error("Error fetching queries:", error);
      res.status(500).json({ error: "Failed to fetch queries" });
    }
  });

  app.post("/api/queries", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const validatedData = insertQuerySchema.parse({
        ...req.body,
        userId: req.user!.id
      });

      const query = await storage.createQuery(validatedData);
      res.status(201).json(query);
    } catch (error) {
      console.error("Error creating query:", error);
      res.status(400).json({ error: "Invalid query data" });
    }
  });

  // AI Query Processing endpoint
  app.post("/api/queries/ai", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const { question, type, imageUrl } = req.body;
      
      if (!question || !type) {
        return res.status(400).json({ error: "Question and type are required" });
      }

      // Detect language from the question
      const detectedLanguage = detectLanguage(question);
      
      // Create system prompt for agricultural assistance
      const systemPrompt = getSystemPrompt(detectedLanguage, req.user!.location, req.user!.crops);
      
      // Call Perplexity API
      const aiResponse = await callPerplexityAPI(systemPrompt, question);
      
      if (!aiResponse) {
        return res.status(500).json({ error: "Failed to get AI response" });
      }

      // Save the query and response to storage
      const queryData = {
        userId: req.user!.id,
        question,
        answer: aiResponse,
        language: detectedLanguage,
        type,
        imageUrl: imageUrl || null,
        category: categorizeQuery(question),
      };

      const savedQuery = await storage.createQuery(queryData);
      res.json(savedQuery);
    } catch (error) {
      console.error("Error processing AI query:", error);
      res.status(500).json({ error: "Failed to process query" });
    }
  });

  app.patch("/api/queries/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const query = await storage.getQuery(req.params.id);
      if (!query || query.userId !== req.user!.id) {
        return res.status(404).json({ error: "Query not found" });
      }

      const updatedQuery = await storage.updateQuery(req.params.id, req.body);
      res.json(updatedQuery);
    } catch (error) {
      console.error("Error updating query:", error);
      res.status(500).json({ error: "Failed to update query" });
    }
  });

  // User profile routes (protected)
  app.patch("/api/user/profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const allowedUpdates = ['name', 'email', 'mobile', 'location', 'crops', 'preferredLanguage'];
      const updates = Object.keys(req.body)
        .filter(key => allowedUpdates.includes(key))
        .reduce((obj: any, key) => {
          obj[key] = req.body[key];
          return obj;
        }, {});

      const updatedUser = await storage.updateUser(req.user!.id, updates);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        location: updatedUser.location,
        crops: updatedUser.crops,
        preferredLanguage: updatedUser.preferredLanguage,
        createdAt: updatedUser.createdAt
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
