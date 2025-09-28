import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertEventSchema, insertTicketSchema, insertFanCredentialSchema } from "@shared/schema";
import { generateJwt } from "./jwt";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/wallet/:address", async (req, res) => {
    try {
      const user = await storage.getUserByWalletAddress(req.params.address);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const { contractAddress, imageUrl, soldTickets } = req.body;
      const event = await storage.updateEvent(req.params.id, {
        contractAddress,
        imageUrl,
        soldTickets
      });
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to update event" });
    }
  });

  // Ticket routes
  app.get("/api/tickets/user/:userId", async (req, res) => {
    try {
      const tickets = await storage.getTicketsByUser(req.params.userId);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/tickets/event/:eventId", async (req, res) => {
    try {
      const tickets = await storage.getTicketsByEvent(req.params.eventId);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/tickets", async (req, res) => {
    try {
      const ticketData = insertTicketSchema.parse(req.body);
      const ticket = await storage.createTicket(ticketData);
      
      // Update event sold tickets count
      const event = await storage.getEvent(ticketData.eventId);
      if (event) {
        await storage.updateEvent(event.id, {
          soldTickets: (event.soldTickets || 0) + 1
        });
      }
      
      res.json(ticket);
    } catch (error) {
      res.status(400).json({ error: "Invalid ticket data" });
    }
  });

  app.put("/api/tickets/:id/redeem", async (req, res) => {
    try {
      const ticket = await storage.updateTicket(req.params.id, { isUsed: true });
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: "Failed to redeem ticket" });
    }
  });

  app.put("/api/tickets/:id", async (req, res) => {
    try {
      const { tokenId, isUsed } = req.body;
      const ticket = await storage.updateTicket(req.params.id, { tokenId, isUsed });
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: "Failed to update ticket" });
    }
  });

  // Fan credential routes
  app.get("/api/credentials/user/:userId", async (req, res) => {
    try {
      const credentials = await storage.getFanCredentialsByUser(req.params.userId);
      res.json(credentials);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/credentials", async (req, res) => {
    try {
      const credentialData = insertFanCredentialSchema.parse(req.body);
      const credential = await storage.createFanCredential(credentialData);
      
      // Update user reputation score based on credential type
      const user = await storage.getUser(credentialData.userId);
      if (user) {
        const bonusPoints = credentialData.credentialType === 'early_supporter' ? 100 : 
                           credentialData.credentialType === 'attendance' ? 50 : 25;
        await storage.updateUser(user.id, {
          reputationScore: (user.reputationScore || 0) + bonusPoints,
          verifiedFan: true
        });
      }
      
      res.json(credential);
    } catch (error) {
      res.status(400).json({ error: "Invalid credential data" });
    }
  });

  app.post("/api/credentials/verify", async (req, res) => {
    try {
      const { userId, artistName, credentialType } = req.body;
      
      if (!userId || !artistName || !credentialType) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const credentials = await storage.getFanCredentialsByUser(userId);
      const hasCredential = credentials.some(cred => 
        cred.artistName === artistName && cred.credentialType === credentialType
      );
      
      res.json({ verified: hasCredential });
    } catch (error) {
      res.status(500).json({ error: "Verification failed" });
    }
  });

  // Wallet connection endpoint
  app.post("/api/auth/connect", async (req, res) => {
    try {
      const { walletAddress, mocaId } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }
      
      // Check if user already exists
      let user = await storage.getUserByWalletAddress(walletAddress);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          walletAddress,
          mocaId: mocaId || undefined,
          username: undefined
        });
      } else {
        // Update existing user with mocaId if provided
        if (mocaId && user.mocaId !== mocaId) {
          user = await storage.updateUser(user.id, { mocaId }) || user;
        }
      }
      
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  // JWT generation endpoint for credential issuance
  app.post("/api/auth/jwt", async (req, res) => {
    try {
      const { partnerId } = req.body;
      
      if (!partnerId) {
        return res.status(400).json({ error: "Partner ID required" });
      }
      
      // Get private key from environment (should be set securely)
      const privateKey = process.env.MOCA_PRIVATE_KEY;
      if (!privateKey) {
        return res.status(500).json({ error: "Server configuration error: Private key not found" });
      }
      
      const jwt = await generateJwt({ partnerId, privateKey });
      
      if (!jwt) {
        return res.status(500).json({ error: "Failed to generate JWT" });
      }
      
      res.json({ token: jwt });
    } catch (error) {
      console.error("JWT generation error:", error);
      res.status(500).json({ error: "JWT generation failed" });
    }
  });

  // Ticket purchase endpoint with credential issuance
  app.post("/api/tickets/purchase", async (req, res) => {
    try {
      const { eventId, userId, userDid } = req.body;
      
      if (!eventId || !userId || !userDid) {
        return res.status(400).json({ error: "Event ID, User ID, and User DID required" });
      }
      
      // Get event details
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      // Check if event is sold out
      const soldTickets = event.soldTickets || 0;
      if (soldTickets >= event.maxTickets) {
        return res.status(400).json({ error: "Event is sold out" });
      }
      
      // Get user details
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Create ticket record in database
      const ticketData = {
        eventId: event.id,
        ownerId: user.id,
        purchasePrice: event.ticketPrice
      };
      
      const ticket = await storage.createTicket(ticketData);
      
      // Update event sold tickets count
      await storage.updateEvent(event.id, {
        soldTickets: soldTickets + 1
      });
      
      // Prepare credential subject data for issuance
      const credentialSubject = {
        ticketId: ticket.id,
        eventName: event.title,
        artistName: event.artistName,
        eventDate: event.eventDate.toISOString().split('T')[0], // YYYY-MM-DD format
        venue: event.venue,
        ticketType: "general", // Default type, could be extended
        purchasePrice: event.ticketPrice.toString(),
        originalBuyer: userDid,
        transferable: false, // Anti-scalping measure
        purchaseTimestamp: new Date().toISOString().split('T')[0],
        validUntil: event.eventDate.toISOString().split('T')[0],
        seatInfo: "General Admission", // Default, could be extended
        isUsed: false,
        maxResalePrice: Math.floor(event.ticketPrice * 1.1).toString() // 10% markup max
      };
      
      res.json({ 
        ticket,
        credentialSubject,
        message: "Ticket purchased successfully. Ready for credential issuance." 
      });
    } catch (error) {
      console.error("Ticket purchase error:", error);
      res.status(500).json({ error: "Ticket purchase failed" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
