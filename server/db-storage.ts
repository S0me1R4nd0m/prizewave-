import { db } from './db';
import { IStorage } from './storage';
import { 
  users, User, InsertUser, 
  giveaways, Giveaway, InsertGiveaway,
  entries, Entry, InsertEntry,
  winners, Winner, InsertWinner,
  referralCodes, ReferralCode, InsertReferralCode,
  referralEntries, ReferralEntry, InsertReferralEntry
} from '@shared/schema';
import { eq, desc, and, or } from 'drizzle-orm';
import { sql } from 'drizzle-orm/sql';
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from './db';

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool: pool as any, 
      createTableIfMissing: true 
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Giveaway operations
  async createGiveaway(insertGiveaway: InsertGiveaway): Promise<Giveaway> {
    const [giveaway] = await db.insert(giveaways).values(insertGiveaway).returning();
    return giveaway;
  }

  async getGiveaway(id: number): Promise<Giveaway | undefined> {
    const [giveaway] = await db.select().from(giveaways).where(eq(giveaways.id, id));
    return giveaway;
  }

  async getAllGiveaways(): Promise<Giveaway[]> {
    return await db.select().from(giveaways);
  }

  async getActiveGiveaways(limit = 10, offset = 0): Promise<Giveaway[]> {
    const now = new Date();
    return await db.select()
      .from(giveaways)
      .where(
        and(
          eq(giveaways.isActive, true),
          or(
            sql`${giveaways.endDate} > NOW()`,
            eq(giveaways.endDate, sql`NOW()`)
          )
        )
      )
      .limit(limit)
      .offset(offset);
  }

  async getFeaturedGiveaways(): Promise<Giveaway[]> {
    const now = new Date();
    return await db.select()
      .from(giveaways)
      .where(
        and(
          eq(giveaways.isFeatured, true),
          eq(giveaways.isActive, true),
          or(
            sql`${giveaways.endDate} > NOW()`,
            eq(giveaways.endDate, sql`NOW()`)
          )
        )
      )
      .limit(4);
  }

  async updateGiveaway(id: number, giveawayUpdate: Partial<Giveaway>): Promise<Giveaway | undefined> {
    const [updatedGiveaway] = await db.update(giveaways)
      .set(giveawayUpdate)
      .where(eq(giveaways.id, id))
      .returning();
    return updatedGiveaway;
  }

  async deleteGiveaway(id: number): Promise<boolean> {
    const result = await db.delete(giveaways).where(eq(giveaways.id, id));
    return result.rowCount > 0;
  }

  // Entry operations
  async createEntry(insertEntry: InsertEntry): Promise<Entry> {
    const now = new Date();
    const entryWithDefaults = {
      ...insertEntry,
      entryDate: now,
      isWinner: false,
      referralCodeId: insertEntry.referralCodeId ?? null,
      entrySource: insertEntry.entrySource ?? null
    };

    const [entry] = await db.insert(entries).values(entryWithDefaults).returning();
    return entry;
  }

  async getEntry(id: number): Promise<Entry | undefined> {
    const [entry] = await db.select().from(entries).where(eq(entries.id, id));
    return entry;
  }

  async getEntriesByUser(userId: number): Promise<Entry[]> {
    return await db.select().from(entries).where(eq(entries.userId, userId));
  }

  async getEntriesByGiveaway(giveawayId: number): Promise<Entry[]> {
    return await db.select().from(entries).where(eq(entries.giveawayId, giveawayId));
  }

  async getEntryCount(giveawayId: number): Promise<number> {
    const result = await db.select({ count: sql`count(*)` })
      .from(entries)
      .where(eq(entries.giveawayId, giveawayId));
    
    return parseInt(result[0].count.toString());
  }

  // Winner operations
  async createWinner(insertWinner: InsertWinner): Promise<Winner> {
    const now = new Date();
    const winnerWithDefaults = {
      ...insertWinner,
      announcementDate: insertWinner.announcementDate || now,
      testimonial: insertWinner.testimonial || null,
      location: insertWinner.location || null
    };

    const [winner] = await db.insert(winners).values(winnerWithDefaults).returning();
    
    // Mark the entry as a winner
    await db.update(entries)
      .set({ isWinner: true })
      .where(eq(entries.id, winner.entryId));
    
    return winner;
  }

  async getWinner(id: number): Promise<Winner | undefined> {
    const [winner] = await db.select().from(winners).where(eq(winners.id, id));
    return winner;
  }

  async getWinnersByGiveaway(giveawayId: number): Promise<Winner[]> {
    return await db.select().from(winners).where(eq(winners.giveawayId, giveawayId));
  }

  async getRecentWinners(limit = 5): Promise<Winner[]> {
    return await db.select()
      .from(winners)
      .orderBy(desc(winners.announcementDate))
      .limit(limit);
  }

  async getWinnerWithUserAndGiveaway(winnerId: number): Promise<any | undefined> {
    const [winner] = await db.select().from(winners).where(eq(winners.id, winnerId));
    
    if (!winner) return undefined;
    
    const [user] = await db.select().from(users).where(eq(users.id, winner.userId));
    const [giveaway] = await db.select().from(giveaways).where(eq(giveaways.id, winner.giveawayId));
    
    return {
      ...winner,
      user: user ? {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        country: user.country
      } : null,
      giveaway: giveaway ? {
        id: giveaway.id,
        title: giveaway.title,
        prize: giveaway.prize,
        category: giveaway.category,
        imageUrl: giveaway.imageUrl
      } : null
    };
  }

  async getAllWinners(): Promise<Winner[]> {
    return await db.select().from(winners);
  }

  // Referral code operations
  async createReferralCode(insertReferralCode: InsertReferralCode): Promise<ReferralCode> {
    const now = new Date();
    const referralCodeWithDefaults = {
      ...insertReferralCode,
      createdAt: now,
      isActive: insertReferralCode.isActive !== undefined ? insertReferralCode.isActive : true
    };

    const [referralCode] = await db.insert(referralCodes).values(referralCodeWithDefaults).returning();
    return referralCode;
  }

  async getReferralCode(id: number): Promise<ReferralCode | undefined> {
    const [referralCode] = await db.select().from(referralCodes).where(eq(referralCodes.id, id));
    return referralCode;
  }

  async getReferralCodeByCode(code: string): Promise<ReferralCode | undefined> {
    const [referralCode] = await db.select().from(referralCodes).where(eq(referralCodes.code, code));
    return referralCode;
  }

  async getReferralCodesByUser(userId: number): Promise<ReferralCode[]> {
    return await db.select().from(referralCodes).where(eq(referralCodes.userId, userId));
  }

  // Referral entry operations
  async createReferralEntry(insertReferralEntry: InsertReferralEntry): Promise<ReferralEntry> {
    const now = new Date();
    const referralEntryWithDefaults = {
      ...insertReferralEntry,
      createdAt: now,
      entryId: insertReferralEntry.entryId || null,
      bonusEntries: insertReferralEntry.bonusEntries || 1
    };

    const [referralEntry] = await db.insert(referralEntries).values(referralEntryWithDefaults).returning();
    return referralEntry;
  }

  async getReferralEntry(id: number): Promise<ReferralEntry | undefined> {
    const [referralEntry] = await db.select().from(referralEntries).where(eq(referralEntries.id, id));
    return referralEntry;
  }

  async getReferralEntriesByReferralCode(referralCodeId: number): Promise<ReferralEntry[]> {
    return await db.select().from(referralEntries).where(eq(referralEntries.referralCodeId, referralCodeId));
  }

  async getReferralEntriesByUser(userId: number): Promise<ReferralEntry[]> {
    const userReferralCodes = await this.getReferralCodesByUser(userId);
    const referralCodeIds = userReferralCodes.map(rc => rc.id);
    
    // If user has no referral codes, return empty array
    if (referralCodeIds.length === 0) return [];
    
    // Get all referral entries for user's referral codes
    return await db.select()
      .from(referralEntries)
      .where(sql`${referralEntries.referralCodeId} IN (${referralCodeIds.join(',')})`);
  }

  async getReferralEntriesByGiveaway(giveawayId: number): Promise<ReferralEntry[]> {
    return await db.select().from(referralEntries).where(eq(referralEntries.giveawayId, giveawayId));
  }

  async getReferralEntryCount(referralCodeId: number): Promise<number> {
    const result = await db.select({ count: sql`count(*)` })
      .from(referralEntries)
      .where(eq(referralEntries.referralCodeId, referralCodeId));
    
    return parseInt(result[0].count.toString());
  }

  // Special operations
  async createEntryWithReferral(entry: InsertEntry, referralCode?: string): Promise<Entry> {
    let referralCodeRecord: ReferralCode | undefined;
    let newEntry: Entry;
    
    // Create the entry first
    newEntry = await this.createEntry(entry);
    
    // Process referral if provided
    if (referralCode) {
      referralCodeRecord = await this.getReferralCodeByCode(referralCode);
      
      if (referralCodeRecord && referralCodeRecord.isActive) {
        // Make sure user isn't referring themselves
        if (referralCodeRecord.userId !== entry.userId) {
          await this.processReferralBonus(
            referralCodeRecord.id,
            entry.userId,
            entry.giveawayId
          );
        }
      }
    }
    
    return newEntry;
  }

  async processReferralBonus(referralCodeId: number, referredUserId: number, giveawayId: number): Promise<void> {
    // Create referral entry record
    await this.createReferralEntry({
      referralCodeId,
      referredUserId,
      giveawayId,
      bonusEntries: 1
    });
    
    // Get referral code owner
    const referralCode = await this.getReferralCode(referralCodeId);
    if (!referralCode) return;
    
    // Create bonus entry for referral code owner
    const referrerEntries = await this.getEntriesByUser(referralCode.userId);
    const existingEntry = referrerEntries.find(e => e.giveawayId === giveawayId);
    
    if (!existingEntry) {
      // Create a new entry for the referrer if they don't have one yet
      await this.createEntry({
        userId: referralCode.userId,
        giveawayId,
        entrySource: 'referral_bonus'
      });
    }
  }

  // Selection operations
  async selectRandomWinner(giveawayId: number): Promise<Winner | undefined> {
    const entriesForGiveaway = await this.getEntriesByGiveaway(giveawayId);
    
    if (entriesForGiveaway.length === 0) {
      return undefined;
    }
    
    // Get a random entry
    const randomIndex = Math.floor(Math.random() * entriesForGiveaway.length);
    const winningEntry = entriesForGiveaway[randomIndex];
    
    // Create the winner
    return await this.createWinner({
      giveawayId,
      userId: winningEntry.userId,
      entryId: winningEntry.id
    });
  }
}
async makeUserAdmin(userId: number): Promise<boolean> {
  const [updatedUser] = await db.update(users)
    .set({ isAdmin: true })
    .where(eq(users.id, userId))
    .returning();
  return !!updatedUser;
}
