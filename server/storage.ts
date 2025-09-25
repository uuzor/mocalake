import { type User, type InsertUser, type Event, type InsertEvent, type Ticket, type InsertTicket, type FanCredential, type InsertFanCredential } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Event methods
  getEvent(id: string): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined>;
  
  // Ticket methods
  getTicket(id: string): Promise<Ticket | undefined>;
  getTicketsByUser(userId: string): Promise<Ticket[]>;
  getTicketsByEvent(eventId: string): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket | undefined>;
  
  // Fan Credential methods
  getFanCredential(id: string): Promise<FanCredential | undefined>;
  getFanCredentialsByUser(userId: string): Promise<FanCredential[]>;
  createFanCredential(credential: InsertFanCredential): Promise<FanCredential>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private events: Map<string, Event>;
  private tickets: Map<string, Ticket>;
  private fanCredentials: Map<string, FanCredential>;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.tickets = new Map();
    this.fanCredentials = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      reputationScore: 0,
      verifiedFan: false,
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

  // Event methods
  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = {
      ...insertEvent,
      id,
      soldTickets: 0,
      contractAddress: null,
      createdBy: null,
      createdAt: new Date()
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...updates };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  // Ticket methods
  async getTicket(id: string): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async getTicketsByUser(userId: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(
      (ticket) => ticket.ownerId === userId
    );
  }

  async getTicketsByEvent(eventId: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(
      (ticket) => ticket.eventId === eventId
    );
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = randomUUID();
    const ticket: Ticket = {
      ...insertTicket,
      id,
      tokenId: null,
      isUsed: false,
      purchasedAt: new Date()
    };
    this.tickets.set(id, ticket);
    return ticket;
  }

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;
    
    const updatedTicket = { ...ticket, ...updates };
    this.tickets.set(id, updatedTicket);
    return updatedTicket;
  }

  // Fan Credential methods
  async getFanCredential(id: string): Promise<FanCredential | undefined> {
    return this.fanCredentials.get(id);
  }

  async getFanCredentialsByUser(userId: string): Promise<FanCredential[]> {
    return Array.from(this.fanCredentials.values()).filter(
      (credential) => credential.userId === userId
    );
  }

  async createFanCredential(insertCredential: InsertFanCredential): Promise<FanCredential> {
    const id = randomUUID();
    const credential: FanCredential = {
      ...insertCredential,
      id,
      issuedAt: new Date()
    };
    this.fanCredentials.set(id, credential);
    return credential;
  }
}

import { DatabaseStorage } from "./dbStorage";

// Use database storage in production, memory storage for development/testing
export const storage = process.env.NODE_ENV === 'test' ? new MemStorage() : new DatabaseStorage();
