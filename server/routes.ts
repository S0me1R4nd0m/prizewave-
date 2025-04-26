import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET_KEY = process.env.SESSION_SECRET || 'fallback-secret-key';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};
import { 
  insertUserSchema, 
  insertGiveawaySchema, 
  insertEntrySchema, 
  insertWinnerSchema,
  insertReferralCodeSchema,
  insertReferralEntrySchema,
  CategoryEnum,
  RegionEnum
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize admin user if it doesn't exist
  (async () => {
    const adminEmail = "levitoda@gmail.com";
    const existingAdmin = await storage.getUserByEmail(adminEmail);

    if (!existingAdmin) {
      const adminUser = await storage.createUser({
        username: "admin",
        email: adminEmail,
        password: await bcrypt.hash("admin123", 10), // You should change this password
        fullName: "Admin User",
        isAdmin: true,
        country: "Global"
      });
      console.log("Admin user created:", adminUser.email);
    }
  })();

  // Auth routes
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await storage.createUser({ ...userData, password: hashedPassword });

      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY);
      const { password, ...userWithoutPassword } = user;

      res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY);
      const { password: _, ...userWithoutPassword } = user;

      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Protected User routes
  app.post("/api/users", authenticateToken, async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(userData);
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Giveaway routes
  app.post("/api/giveaways", async (req: Request, res: Response) => {
    try {
      const giveawayData = insertGiveawaySchema.parse(req.body);
      const giveaway = await storage.createGiveaway(giveawayData);
      res.status(201).json(giveaway);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create giveaway" });
    }
  });

  app.get("/api/giveaways", async (req: Request, res: Response) => {
    try {
      const giveaways = await storage.getAllGiveaways();
      res.json(giveaways);
    } catch (error) {
      res.status(500).json({ message: "Failed to get giveaways" });
    }
  });

  app.get("/api/giveaways/active", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const giveaways = await storage.getActiveGiveaways(limit, offset);
      res.json(giveaways);
    } catch (error) {
      res.status(500).json({ message: "Failed to get active giveaways" });
    }
  });

  app.get("/api/giveaways/featured", async (req: Request, res: Response) => {
    try {
      const giveaways = await storage.getFeaturedGiveaways();
      res.json(giveaways);
    } catch (error) {
      res.status(500).json({ message: "Failed to get featured giveaways" });
    }
  });

  app.get("/api/giveaways/:id", async (req: Request, res: Response) => {
    try {
      const giveawayId = parseInt(req.params.id);
      const giveaway = await storage.getGiveaway(giveawayId);

      if (!giveaway) {
        return res.status(404).json({ message: "Giveaway not found" });
      }

      res.json(giveaway);
    } catch (error) {
      res.status(500).json({ message: "Failed to get giveaway" });
    }
  });

  app.patch("/api/giveaways/:id", async (req: Request, res: Response) => {
    try {
      const giveawayId = parseInt(req.params.id);
      const giveaway = await storage.getGiveaway(giveawayId);

      if (!giveaway) {
        return res.status(404).json({ message: "Giveaway not found" });
      }

      const updatedGiveaway = await storage.updateGiveaway(giveawayId, req.body);
      res.json(updatedGiveaway);
    } catch (error) {
      res.status(500).json({ message: "Failed to update giveaway" });
    }
  });

  app.delete("/api/giveaways/:id", async (req: Request, res: Response) => {
    try {
      const giveawayId = parseInt(req.params.id);
      const success = await storage.deleteGiveaway(giveawayId);

      if (!success) {
        return res.status(404).json({ message: "Giveaway not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete giveaway" });
    }
  });

  // Entry routes
  app.post("/api/entries", async (req: Request, res: Response) => {
    try {
      const entryData = insertEntrySchema.parse(req.body);

      // Check if giveaway exists
      const giveaway = await storage.getGiveaway(entryData.giveawayId);
      if (!giveaway) {
        return res.status(404).json({ message: "Giveaway not found" });
      }

      // Check if user exists
      const user = await storage.getUser(entryData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user already has an entry for this giveaway
      const userEntries = await storage.getEntriesByUser(entryData.userId);
      const existingEntry = userEntries.find(entry => entry.giveawayId === entryData.giveawayId);
      if (existingEntry) {
        return res.status(400).json({ message: "User has already entered this giveaway" });
      }

      const entry = await storage.createEntry(entryData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create entry" });
    }
  });

  app.get("/api/entries/giveaway/:giveawayId", async (req: Request, res: Response) => {
    try {
      const giveawayId = parseInt(req.params.giveawayId);
      const entries = await storage.getEntriesByGiveaway(giveawayId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to get entries" });
    }
  });

  app.get("/api/entries/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const entries = await storage.getEntriesByUser(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to get entries" });
    }
  });

  app.get("/api/entries/count/:giveawayId", async (req: Request, res: Response) => {
    try {
      const giveawayId = parseInt(req.params.giveawayId);
      const count = await storage.getEntryCount(giveawayId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to get entry count" });
    }
  });

  // Winner routes
  app.post("/api/winners", async (req: Request, res: Response) => {
    try {
      const winnerData = insertWinnerSchema.parse(req.body);
      const winner = await storage.createWinner(winnerData);
      res.status(201).json(winner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create winner" });
    }
  });

  app.get("/api/winners", async (req: Request, res: Response) => {
    try {
      const winners = await storage.getAllWinners();
      res.json(winners);
    } catch (error) {
      res.status(500).json({ message: "Failed to get winners" });
    }
  });

  app.get("/api/winners/recent", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const winners = await storage.getRecentWinners(limit);

      // Get user and giveaway details for each winner
      const winnersWithDetails = await Promise.all(
        winners.map(async (winner) => {
          const user = await storage.getUser(winner.userId);
          const giveaway = await storage.getGiveaway(winner.giveawayId);
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
        })
      );

      res.json(winnersWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recent winners" });
    }
  });

  app.get("/api/winners/giveaway/:giveawayId", async (req: Request, res: Response) => {
    try {
      const giveawayId = parseInt(req.params.giveawayId);
      const winners = await storage.getWinnersByGiveaway(giveawayId);
      res.json(winners);
    } catch (error) {
      res.status(500).json({ message: "Failed to get winners" });
    }
  });

  // Selection route
  app.post("/api/giveaways/:id/select-winner", async (req: Request, res: Response) => {
    try {
      const giveawayId = parseInt(req.params.id);

      // Check if giveaway exists and is ended
      const giveaway = await storage.getGiveaway(giveawayId);
      if (!giveaway) {
        return res.status(404).json({ message: "Giveaway not found" });
      }

      const now = new Date();
      if (new Date(giveaway.endDate) > now) {
        return res.status(400).json({ message: "Giveaway has not ended yet" });
      }

      const winner = await storage.selectRandomWinner(giveawayId);

      if (!winner) {
        return res.status(404).json({ message: "No eligible entries found for this giveaway" });
      }

      res.json(winner);
    } catch (error) {
      res.status(500).json({ message: "Failed to select winner" });
    }
  });

  // Categories and Regions
  app.get("/api/categories", (_req: Request, res: Response) => {
    try {
      const categories = CategoryEnum.options;
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get categories" });
    }
  });

  app.get("/api/regions", (_req: Request, res: Response) => {
    try {
      const regions = RegionEnum.options;
      res.json(regions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get regions" });
    }
  });

  // Referral code routes
  app.post("/api/referral-codes", async (req: Request, res: Response) => {
    try {
      const referralCodeData = insertReferralCodeSchema.parse(req.body);

      // Check if user exists
      const user = await storage.getUser(referralCodeData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate a unique code if not provided
      if (!referralCodeData.code) {
        const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        referralCodeData.code = `${user.username}-${randomCode}`;
      }

      const referralCode = await storage.createReferralCode(referralCodeData);
      res.status(201).json(referralCode);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create referral code" });
    }
  });

  app.get("/api/referral-codes/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const referralCodes = await storage.getReferralCodesByUser(userId);
      res.json(referralCodes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get referral codes" });
    }
  });

  app.get("/api/referral-codes/:code", async (req: Request, res: Response) => {
    try {
      const code = req.params.code;
      const referralCode = await storage.getReferralCodeByCode(code);

      if (!referralCode) {
        return res.status(404).json({ message: "Referral code not found" });
      }

      res.json(referralCode);
    } catch (error) {
      res.status(500).json({ message: "Failed to get referral code" });
    }
  });

  // Entry with referral route
  app.post("/api/entries/with-referral", async (req: Request, res: Response) => {
    try {
      const { referralCode, ...entryData } = req.body;
      const parsedEntryData = insertEntrySchema.parse(entryData);

      // Check if giveaway exists
      const giveaway = await storage.getGiveaway(parsedEntryData.giveawayId);
      if (!giveaway) {
        return res.status(404).json({ message: "Giveaway not found" });
      }

      // Check if user exists
      const user = await storage.getUser(parsedEntryData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user already has an entry for this giveaway
      const userEntries = await storage.getEntriesByUser(parsedEntryData.userId);
      const existingEntry = userEntries.find(entry => entry.giveawayId === parsedEntryData.giveawayId);
      if (existingEntry) {
        return res.status(400).json({ message: "User has already entered this giveaway" });
      }

      // Create entry with referral handling
      const entry = await storage.createEntryWithReferral(parsedEntryData, referralCode);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create entry" });
    }
  });

  // Referral stats route
  app.get("/api/referral-stats/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);

      // Get user's referral codes
      const referralCodes = await storage.getReferralCodesByUser(userId);

      // Get stats for each code
      const referralStats = await Promise.all(
        referralCodes.map(async (code) => {
          const count = await storage.getReferralEntryCount(code.id);

          return {
            code: code.code,
            referralCodeId: code.id, 
            entriesGenerated: count,
            isActive: code.isActive,
            createdAt: code.createdAt
          };
        })
      );

      res.json(referralStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get referral stats" });
    }
  });

  // Make user admin (requires existing admin authentication)
  app.post("/api/users/:id/make-admin", authenticateToken, async (req: Request, res: Response) => {
    try {
      // Check if requester is admin
      const requestingUser = await storage.getUser(req.user.id);
      if (!requestingUser?.isAdmin) {
        return res.status(403).json({ message: "Only admins can promote users" });
      }

      const userId = parseInt(req.params.id);
      const success = await storage.makeUserAdmin(userId);

      if (success) {
        res.json({ message: "User promoted to admin successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to promote user" });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}