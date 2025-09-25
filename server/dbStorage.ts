import { eq, desc } from "drizzle-orm";
import { getDb } from "./db";
import { users, events, tickets, fanCredentials } from "@shared/schema";
import type { User, InsertUser, Event, InsertEvent, Ticket, InsertTicket, FanCredential, InsertFanCredential } from "@shared/schema";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  private getDbInstance() {
    try {
      return getDb();
    } catch (error) {
      throw new Error('Database not available. Please ensure DATABASE_URL is configured.');
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const db = this.getDbInstance();
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    const db = this.getDbInstance();
    const result = await db.select().from(users).where(eq(users.walletAddress, walletAddress)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = this.getDbInstance();
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const db = this.getDbInstance();
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  // Event methods
  async getEvent(id: string): Promise<Event | undefined> {
    const db = this.getDbInstance();
    const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return result[0];
  }

  async getAllEvents(): Promise<Event[]> {
    const db = this.getDbInstance();
    return await db.select().from(events).orderBy(desc(events.eventDate));
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const db = this.getDbInstance();
    const result = await db.insert(events).values(insertEvent).returning();
    return result[0];
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined> {
    const db = this.getDbInstance();
    const result = await db.update(events).set(updates).where(eq(events.id, id)).returning();
    return result[0];
  }

  // Ticket methods
  async getTicket(id: string): Promise<Ticket | undefined> {
    const db = this.getDbInstance();
    const result = await db.select().from(tickets).where(eq(tickets.id, id)).limit(1);
    return result[0];
  }

  async getTicketsByUser(userId: string): Promise<Ticket[]> {
    const db = this.getDbInstance();
    return await db.select().from(tickets).where(eq(tickets.ownerId, userId)).orderBy(desc(tickets.purchasedAt));
  }

  async getTicketsByEvent(eventId: string): Promise<Ticket[]> {
    const db = this.getDbInstance();
    return await db.select().from(tickets).where(eq(tickets.eventId, eventId)).orderBy(desc(tickets.purchasedAt));
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const db = this.getDbInstance();
    const result = await db.insert(tickets).values(insertTicket).returning();
    return result[0];
  }

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket | undefined> {
    const db = this.getDbInstance();
    const result = await db.update(tickets).set(updates).where(eq(tickets.id, id)).returning();
    return result[0];
  }

  // Fan Credential methods
  async getFanCredential(id: string): Promise<FanCredential | undefined> {
    const db = this.getDbInstance();
    const result = await db.select().from(fanCredentials).where(eq(fanCredentials.id, id)).limit(1);
    return result[0];
  }

  async getFanCredentialsByUser(userId: string): Promise<FanCredential[]> {
    const db = this.getDbInstance();
    return await db.select().from(fanCredentials).where(eq(fanCredentials.userId, userId)).orderBy(desc(fanCredentials.issuedAt));
  }

  async createFanCredential(insertCredential: InsertFanCredential): Promise<FanCredential> {
    const db = this.getDbInstance();
    const result = await db.insert(fanCredentials).values(insertCredential).returning();
    return result[0];
  }
}