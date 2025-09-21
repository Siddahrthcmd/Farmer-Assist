import { type User, type InsertUser, type Query, type InsertQuery, type Advisory, type InsertAdvisory } from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Query management
  createQuery(query: InsertQuery): Promise<Query>;
  getQueriesByUser(userId: string): Promise<Query[]>;
  getQuery(id: string): Promise<Query | undefined>;
  updateQuery(id: string, updates: Partial<Query>): Promise<Query | undefined>;
  
  // Advisory content
  getAdvisories(): Promise<Advisory[]>;
  getAdvisory(id: string): Promise<Advisory | undefined>;
  createAdvisory(advisory: InsertAdvisory): Promise<Advisory>;
  
  // Session store for authentication
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private queries: Map<string, Query>;
  private advisories: Map<string, Advisory>;
  public sessionStore: any;

  constructor() {
    this.users = new Map();
    this.queries = new Map();
    this.advisories = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Seed some advisory content
    this.seedAdvisoryContent();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      mobile: insertUser.mobile ?? null,
      email: insertUser.email ?? null,
      location: insertUser.location ?? null,
      crops: insertUser.crops ?? null,
      preferredLanguage: insertUser.preferredLanguage ?? 'malayalam',
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createQuery(insertQuery: InsertQuery): Promise<Query> {
    const id = randomUUID();
    const query: Query = {
      ...insertQuery,
      id,
      answer: insertQuery.answer ?? null,
      category: insertQuery.category ?? null,
      imageUrl: insertQuery.imageUrl ?? null,
      rating: insertQuery.rating ?? null,
      createdAt: new Date()
    };
    this.queries.set(id, query);
    return query;
  }

  async getQueriesByUser(userId: string): Promise<Query[]> {
    return Array.from(this.queries.values())
      .filter(query => query.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getQuery(id: string): Promise<Query | undefined> {
    return this.queries.get(id);
  }

  async updateQuery(id: string, updates: Partial<Query>): Promise<Query | undefined> {
    const query = this.queries.get(id);
    if (!query) return undefined;
    
    const updatedQuery = { ...query, ...updates };
    this.queries.set(id, updatedQuery);
    return updatedQuery;
  }

  async getAdvisories(): Promise<Advisory[]> {
    return Array.from(this.advisories.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAdvisory(id: string): Promise<Advisory | undefined> {
    return this.advisories.get(id);
  }

  async createAdvisory(insertAdvisory: InsertAdvisory): Promise<Advisory> {
    const id = randomUUID();
    const advisory: Advisory = {
      ...insertAdvisory,
      id,
      titleMalayalam: insertAdvisory.titleMalayalam ?? null,
      tags: insertAdvisory.tags ?? null,
      views: insertAdvisory.views ?? 0,
      trending: insertAdvisory.trending ?? 'false',
      createdAt: new Date()
    };
    this.advisories.set(id, advisory);
    return advisory;
  }

  private seedAdvisoryContent() {
    const advisories = [
      {
        title: 'Best practices for rice cultivation in monsoon',
        titleMalayalam: 'മഴക്കാലത്ത് നെല്ലുകൃഷിയുടെ മികച്ച രീതികൾ',
        description: 'Essential techniques for successful rice farming during Kerala monsoon season',
        content: 'During monsoon season, proper water management is crucial for rice cultivation. Ensure proper drainage systems and monitor water levels regularly...',
        category: 'crops',
        language: 'malayalam',
        tags: ['rice', 'monsoon', 'kerala', 'cultivation'],
        views: 1250,
        trending: 'true'
      },
      {
        title: 'Common coconut palm diseases and treatment',
        titleMalayalam: 'തെങ്ങിന്റെ സാധാരണ രോഗങ്ങളും ചികിത്സയും',
        description: 'Identify and treat major coconut palm diseases affecting Kerala farms',
        content: 'Coconut palm diseases like Root Wilt and Leaf Rot can severely impact yields. Early identification and proper treatment methods...',
        category: 'pests',
        language: 'malayalam',
        tags: ['coconut', 'diseases', 'treatment', 'kerala'],
        views: 890,
        trending: 'true'
      },
      {
        title: 'Organic fertilizer preparation at home',
        titleMalayalam: 'വീട്ടിൽ ജൈവ വളം തയ്യാറാക്കുന്ന രീതി',
        description: 'Step-by-step guide to prepare organic compost using kitchen waste',
        content: 'Creating organic fertilizer at home is cost-effective and environmentally friendly. Use kitchen scraps, dry leaves, and proper composting techniques...',
        category: 'fertilizer',
        language: 'malayalam',
        tags: ['organic', 'fertilizer', 'compost', 'homemade'],
        views: 567,
        trending: 'false'
      }
    ];

    advisories.forEach(advisory => {
      const id = randomUUID();
      this.advisories.set(id, {
        ...advisory,
        id,
        createdAt: new Date()
      });
    });
  }
}

export const storage = new MemStorage();
