import { 
  User, InsertUser, 
  Giveaway, InsertGiveaway, 
  Entry, InsertEntry, 
  Winner, InsertWinner,
  ReferralCode, InsertReferralCode,
  ReferralEntry, InsertReferralEntry
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Giveaway operations
  createGiveaway(giveaway: InsertGiveaway): Promise<Giveaway>;
  getGiveaway(id: number): Promise<Giveaway | undefined>;
  getAllGiveaways(): Promise<Giveaway[]>;
  getActiveGiveaways(limit?: number, offset?: number): Promise<Giveaway[]>;
  getFeaturedGiveaways(): Promise<Giveaway[]>;
  updateGiveaway(id: number, giveaway: Partial<Giveaway>): Promise<Giveaway | undefined>;
  deleteGiveaway(id: number): Promise<boolean>;
  
  // Entry operations
  createEntry(entry: InsertEntry): Promise<Entry>;
  getEntry(id: number): Promise<Entry | undefined>;
  getEntriesByUser(userId: number): Promise<Entry[]>;
  getEntriesByGiveaway(giveawayId: number): Promise<Entry[]>;
  getEntryCount(giveawayId: number): Promise<number>;
  
  // Winner operations
  createWinner(winner: InsertWinner): Promise<Winner>;
  getWinner(id: number): Promise<Winner | undefined>;
  getWinnersByGiveaway(giveawayId: number): Promise<Winner[]>;
  getRecentWinners(limit?: number): Promise<Winner[]>;
  getWinnerWithUserAndGiveaway(winnerId: number): Promise<any | undefined>;
  getAllWinners(): Promise<Winner[]>;
  
  // Selection operations
  selectRandomWinner(giveawayId: number): Promise<Winner | undefined>;
  
  // Referral code operations
  createReferralCode(referralCode: InsertReferralCode): Promise<ReferralCode>;
  getReferralCode(id: number): Promise<ReferralCode | undefined>;
  getReferralCodeByCode(code: string): Promise<ReferralCode | undefined>;
  getReferralCodesByUser(userId: number): Promise<ReferralCode[]>;
  
  // Referral entry operations
  createReferralEntry(referralEntry: InsertReferralEntry): Promise<ReferralEntry>;
  getReferralEntry(id: number): Promise<ReferralEntry | undefined>;
  getReferralEntriesByReferralCode(referralCodeId: number): Promise<ReferralEntry[]>;
  getReferralEntriesByUser(userId: number): Promise<ReferralEntry[]>;
  getReferralEntriesByGiveaway(giveawayId: number): Promise<ReferralEntry[]>;
  getReferralEntryCount(referralCodeId: number): Promise<number>;
  
  // Special operations
  createEntryWithReferral(entry: InsertEntry, referralCode?: string): Promise<Entry>;
  processReferralBonus(referralCodeId: number, referredUserId: number, giveawayId: number): Promise<void>;
}

export class Storage implements IStorage {
  private giveaways: Map<number, Giveaway>;
  private winners: Map<number, Winner>;
  private entries: Map<number, Entry>;
  private users: Map<number, User>;
  private referralCodes: Map<number, ReferralCode>;
  private referralEntries: Map<number, ReferralEntry>;

  private giveawayId: number;
  private winnerId: number;
  private entryId: number;
  private userId: number;
  private referralCodeId: number;
  private referralEntryId: number;

  constructor() {
    this.giveaways = new Map();
    this.winners = new Map();
    this.entries = new Map();
    this.users = new Map();
    this.referralCodes = new Map();
    this.referralEntries = new Map();

    this.giveawayId = 1;
    this.winnerId = 1;
    this.entryId = 1;
    this.userId = 1;
    this.referralCodeId = 1;
    this.referralEntryId = 1;
  }

  // User operations
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values())
      .find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values())
      .find(user => user.email === email);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Giveaway operations
  async createGiveaway(insertGiveaway: InsertGiveaway): Promise<Giveaway> {
    const id = this.giveawayId++;
    const giveaway: Giveaway = { ...insertGiveaway, id };
    this.giveaways.set(id, giveaway);
    return giveaway;
  }

  async getGiveaway(id: number): Promise<Giveaway | undefined> {
    return this.giveaways.get(id);
  }

  async getAllGiveaways(): Promise<Giveaway[]> {
    return Array.from(this.giveaways.values());
  }

  async getActiveGiveaways(limit = 10, offset = 0): Promise<Giveaway[]> {
    const now = new Date();
    return Array.from(this.giveaways.values())
      .filter(giveaway => 
        giveaway.isActive && 
        new Date(giveaway.endDate) >= now
      )
      .slice(offset, offset + limit);
  }

  async getFeaturedGiveaways(): Promise<Giveaway[]> {
    const now = new Date();
    return Array.from(this.giveaways.values())
      .filter(giveaway => 
        giveaway.isFeatured && 
        giveaway.isActive && 
        new Date(giveaway.endDate) >= now
      );
  }

  async updateGiveaway(id: number, giveawayUpdate: Partial<Giveaway>): Promise<Giveaway | undefined> {
    const giveaway = this.giveaways.get(id);
    if (!giveaway) return undefined;

    const updatedGiveaway = { ...giveaway, ...giveawayUpdate };
    this.giveaways.set(id, updatedGiveaway);
    return updatedGiveaway;
  }

  async deleteGiveaway(id: number): Promise<boolean> {
    return this.giveaways.delete(id);
  }

  // Entry operations  
  async createEntry(insertEntry: InsertEntry): Promise<Entry> {
    const id = this.entryId++;
    const entry: Entry = { 
      ...insertEntry, 
      id, 
      entryDate: new Date(), 
      isWinner: false 
    };
    this.entries.set(id, entry);
    return entry;
  }

  async getEntry(id: number): Promise<Entry | undefined> {
    return this.entries.get(id);
  }

  async getEntriesByUser(userId: number): Promise<Entry[]> {
    return Array.from(this.entries.values())
      .filter(entry => entry.userId === userId);
  }

  async getEntriesByGiveaway(giveawayId: number): Promise<Entry[]> {
    return Array.from(this.entries.values())
      .filter(entry => entry.giveawayId === giveawayId);
  }

  async getEntryCount(giveawayId: number): Promise<number> {
    return (await this.getEntriesByGiveaway(giveawayId)).length;
  }

  // Winner operations
  async createWinner(insertWinner: InsertWinner): Promise<Winner> {
    const id = this.winnerId++;
    const winner: Winner = { ...insertWinner, id, winDate: new Date() };
    this.winners.set(id, winner);
    return winner;
  }

  async getWinner(id: number): Promise<Winner | undefined> {
    return this.winners.get(id);
  }

  async getAllWinners(): Promise<Winner[]> {
    return Array.from(this.winners.values());
  }

  async getWinnersByGiveaway(giveawayId: number): Promise<Winner[]> {
    return Array.from(this.winners.values())
      .filter(winner => winner.giveawayId === giveawayId);
  }

  async getRecentWinners(limit = 5): Promise<Winner[]> {
    return Array.from(this.winners.values())
      .sort((a, b) => b.winDate.getTime() - a.winDate.getTime())
      .slice(0, limit);
  }

  async getWinnerWithUserAndGiveaway(winnerId: number): Promise<any | undefined> {
      const winner = this.winners.get(winnerId);
      if (!winner) return undefined;
      
      const user = this.users.get(winner.userId);
      const giveaway = this.giveaways.get(winner.giveawayId);
      
      if (!user || !giveaway) return undefined;
      
      return {
          ...winner,
          user,
          giveaway
      };
  }


  // Referral operations
  async createReferralCode(insertReferralCode: InsertReferralCode): Promise<ReferralCode> {
    const id = this.referralCodeId++;
    const referralCode: ReferralCode = { 
      ...insertReferralCode, 
      id, 
      createdAt: new Date(),
      isActive: true
    };
    this.referralCodes.set(id, referralCode);
    return referralCode;
  }

  async getReferralCode(id: number): Promise<ReferralCode | undefined> {
    return this.referralCodes.get(id);
  }

  async getReferralCodeByCode(code: string): Promise<ReferralCode | undefined> {
    return Array.from(this.referralCodes.values())
      .find(rc => rc.code === code && rc.isActive);
  }

  async getReferralCodesByUser(userId: number): Promise<ReferralCode[]> {
    return Array.from(this.referralCodes.values())
      .filter(rc => rc.userId === userId);
  }

  async createReferralEntry(insertReferralEntry: InsertReferralEntry): Promise<ReferralEntry> {
    const id = this.referralEntryId++;
    const referralEntry: ReferralEntry = { 
      ...insertReferralEntry, 
      id, 
      createdAt: new Date() 
    };
    this.referralEntries.set(id, referralEntry);
    return referralEntry;
  }

  async getReferralEntriesByCode(referralCodeId: number): Promise<ReferralEntry[]> {
    return Array.from(this.referralEntries.values())
      .filter(re => re.referralCodeId === referralCodeId);
  }

  async getReferralEntryCount(referralCodeId: number): Promise<number> {
    return (await this.getReferralEntriesByCode(referralCodeId)).length;
  }

  async createEntryWithReferral(insertEntry: InsertEntry, referralCode?: string): Promise<Entry> {
    const entry = await this.createEntry(insertEntry);

    if (referralCode) {
      const code = await this.getReferralCodeByCode(referralCode);
      if (code) {
        await this.processReferralBonus(code.id, insertEntry.userId, insertEntry.giveawayId);
      }
    }

    return entry;
  }

  async processReferralBonus(referralCodeId: number, referredUserId: number, giveawayId: number): Promise<void> {
    await this.createReferralEntry({
      referralCodeId,
      referredUserId,
      giveawayId,
      bonusEntries: 1
    });

    const referralCode = await this.getReferralCode(referralCodeId);
    if (!referralCode) return;

    const referrerEntries = await this.getEntriesByUser(referralCode.userId);
    const existingEntry = referrerEntries.find(e => e.giveawayId === giveawayId);

    if (!existingEntry) {
      await this.createEntry({
        userId: referralCode.userId,
        giveawayId,
        entrySource: 'referral_bonus'
      });
    }
  }

  async selectRandomWinner(giveawayId: number): Promise<Winner | undefined> {
    const entriesForGiveaway = await this.getEntriesByGiveaway(giveawayId);

    if (entriesForGiveaway.length === 0) {
      return undefined;
    }

    const randomIndex = Math.floor(Math.random() * entriesForGiveaway.length);
    const winningEntry = entriesForGiveaway[randomIndex];

    return await this.createWinner({
      giveawayId,
      userId: winningEntry.userId,
      entryId: winningEntry.id
    });
  }
}

export const storage = new Storage();