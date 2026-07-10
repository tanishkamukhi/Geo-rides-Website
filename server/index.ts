import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { handleDemo } from "./routes/demo";

// ── JSON Fallback DB ─────────────────────────────────────────────────────────
const DB_PATH = path.join(__dirname, "db.json");

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch {
    return { users: [], drivers: [], bookings: [], partners: [], tokens: {}, adminTokens: {} };
  }
}

function writeDB(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Try to import real DB, fall back to JSON
let db: any = null;
let schema: any = null;
let useRealDB = false;

async function tryInitDB() {
  try {
    const dbModule = await import("./db");
    db = dbModule.db;
    schema = dbModule.schema;
    const { eq } = await import("drizzle-orm");
    // Quick test query
    await db.select().from(schema.users).limit(1);
    useRealDB = true;
    console.log("✅ Real database connected");
  } catch (e) {
    useRealDB = false;
    console.log("⚠️  No database connection — using local JSON fallback store");
  }
}

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Init DB attempt
  tryInitDB();

  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  app.get("/api/ping", (_req, res) => {
    res.json({ message: process.env.PING_MESSAGE ?? "ping" });
  });

  app.get("/api/demo", handleDemo);

  // ── REGISTER ────────────────────────────────────────────────────────────────
  app.post("/api/register", async (req, res) => {
    try {
      const { fullName, email, phone, password, confirmPassword, role = "user",
        driversLicense, vehicleNumber, vehicleType, sinNumber } = req.body;

      if (!fullName || !email || !phone || !password)
        return res.status(400).json({ message: "All fields are required" });
      if (password !== confirmPassword)
        return res.status(400).json({ message: "Passwords don't match" });
      if (password.length < 6)
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      if (!email.includes("@"))
        return res.status(400).json({ message: "Invalid email" });

      if (role === "driver") {
        if (!driversLicense || !vehicleNumber || !vehicleType || !sinNumber)
          return res.status(400).json({ message: "Driver details are required (DL, vehicle, SIN)" });
      }

      if (useRealDB) {
        const { eq } = await import("drizzle-orm");
        const existing = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
        if (existing.length > 0) return res.status(400).json({ message: "Email already registered" });

        const [inserted] = await db.insert(schema.users).values({
          fullName, email, phone, password,
        }).returning({ id: schema.users.id });

        return res.status(201).json({
          message: "User registered successfully",
          userId: inserted.id.toString(),
        });
      }

      // JSON fallback
      const dbData = readDB();
      const existingUser = dbData.users.find((u: any) => u.email === email);
      if (existingUser) return res.status(400).json({ message: "Email already registered" });

      const newId = Date.now().toString();
      const newUser: any = {
        id: newId, fullName, email, phone, password,
        role, profilePhoto: null, rating: 4.5, totalRides: 0,
        createdAt: new Date().toISOString(),
      };

      if (role === "driver") {
        newUser.driversLicense = driversLicense;
        newUser.vehicleNumber = vehicleNumber;
        newUser.vehicleType = vehicleType;
        newUser.sinNumber = sinNumber;
        newUser.isVerified = false;
        newUser.verificationStatus = "pending";
        newUser.status = "offline";
      }

      dbData.users.push(newUser);
      writeDB(dbData);

      res.status(201).json({
        message: "User registered successfully",
        userId: newId,
        role,
        verificationPending: role === "driver",
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed: " + (error instanceof Error ? error.message : "Unknown error") });
    }
  });

  // ── LOGIN ────────────────────────────────────────────────────────────────────
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "Email and password are required" });

      if (useRealDB) {
        const { eq } = await import("drizzle-orm");
        const usersList = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
        const user = usersList[0];
        if (!user || user.password !== password)
          return res.status(401).json({ message: "Invalid email or password" });

        const token = Math.random().toString(36).substring(7) + Date.now();
        await db.update(schema.users).set({ apiToken: token }).where(eq(schema.users.id, user.id));

        return res.json({
          message: "Login successful", token, userId: user.id.toString(), role: "user",
        });
      }

      // JSON fallback
      const dbData = readDB();

      // Check admin credentials
      if (email === "admin@georides.ca" && password === "admin123") {
        const adminToken = "admin-" + Math.random().toString(36).substring(7) + Date.now();
        dbData.adminTokens[adminToken] = true;
        writeDB(dbData);
        return res.json({ message: "Login successful", token: adminToken, userId: "admin", role: "admin" });
      }

      const user = dbData.users.find((u: any) => u.email === email);
      if (!user || user.password !== password)
        return res.status(401).json({ message: "Invalid email or password" });

      const token = Math.random().toString(36).substring(7) + Date.now();
      dbData.tokens[token] = user.id;
      writeDB(dbData);

      res.json({
        message: "Login successful",
        token,
        userId: user.id,
        role: user.role || "user",
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed: " + (error instanceof Error ? error.message : "Unknown error") });
    }
  });

  // ── ME ───────────────────────────────────────────────────────────────────────
  app.get("/api/me", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      if (useRealDB) {
        const { eq } = await import("drizzle-orm");
        const usersList = await db.select().from(schema.users).where(eq(schema.users.apiToken, token)).limit(1);
        const user = usersList[0];
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.json({
          id: user.id.toString(), fullName: user.fullName, email: user.email,
          phone: user.phone, joined: "Just now", trips: user.totalRides ?? 0,
          rating: Number(user.rating ?? "5.0"), role: "user",
        });
      }

      const dbData = readDB();
      if (dbData.adminTokens[token]) {
        return res.json({ id: "admin", fullName: "Admin", email: "admin@georides.ca", role: "admin" });
      }
      const userId = dbData.tokens[token];
      if (!userId) return res.status(404).json({ message: "User not found" });
      const user = dbData.users.find((u: any) => u.id === userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json({
        id: user.id, fullName: user.fullName, email: user.email, phone: user.phone,
        role: user.role || "user", joined: new Date(user.createdAt).toLocaleDateString(),
        trips: user.totalRides || 0, rating: user.rating || 4.5,
        isVerified: user.isVerified, verificationStatus: user.verificationStatus,
        driversLicense: user.driversLicense, vehicleNumber: user.vehicleNumber,
        vehicleType: user.vehicleType,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  });

  // ── BOOK RIDE ────────────────────────────────────────────────────────────────
  app.post("/api/book-ride", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const dbData = readDB();
      const userId = dbData.tokens[token];
      if (!userId && !dbData.adminTokens[token]) return res.status(401).json({ message: "Unauthorized" });

      const { pickupLocation, dropLocation, vehicleType } = req.body;
      if (!pickupLocation || !dropLocation || !vehicleType)
        return res.status(400).json({ message: "Missing required fields" });

      const bookingId = "GEO" + Math.random().toString(36).substring(2, 11).toUpperCase();
      const estimatedFare = Math.floor(Math.random() * 300) + 100;
      const estimatedTime = Math.floor(Math.random() * 6) + 3;

      const booking = {
        id: Date.now().toString(), bookingId, userId,
        pickupLocation, dropLocation, vehicleType,
        estimatedFare: `CA$${estimatedFare}`, status: "pending",
        createdAt: new Date().toISOString(),
      };
      dbData.bookings.push(booking);
      writeDB(dbData);

      res.status(201).json({
        message: "Ride booked successfully",
        bookingId, estimatedFare: `CA$${estimatedFare}`,
        estimatedTime: `${estimatedTime} mins`,
      });
    } catch (error) {
      console.error("Booking error:", error);
      res.status(500).json({ message: "Booking failed" });
    }
  });

  // ── DRIVER: Get ride requests ─────────────────────────────────────────────
  app.get("/api/driver/rides", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ message: "Unauthorized" });
      const dbData = readDB();
      const userId = dbData.tokens[token];
      const user = dbData.users.find((u: any) => u.id === userId && u.role === "driver");
      if (!user) return res.status(403).json({ message: "Driver not found" });

      const pending = dbData.bookings.filter((b: any) => b.status === "pending");
      res.json(pending);
    } catch (error) {
      res.status(500).json({ message: "Error fetching rides" });
    }
  });

  // ── DRIVER: Accept/decline ride ─────────────────────────────────────────────
  app.patch("/api/driver/rides/:id", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ message: "Unauthorized" });
      const { action } = req.body; // "accept" | "decline"
      const dbData = readDB();
      const userId = dbData.tokens[token];
      const booking = dbData.bookings.find((b: any) => b.id === req.params.id);
      if (!booking) return res.status(404).json({ message: "Booking not found" });

      booking.status = action === "accept" ? "accepted" : "declined";
      if (action === "accept") booking.driverId = userId;
      writeDB(dbData);
      res.json({ message: `Ride ${action}ed`, booking });
    } catch (error) {
      res.status(500).json({ message: "Error updating ride" });
    }
  });

  // ── DRIVER: Toggle online status ─────────────────────────────────────────────
  app.patch("/api/driver/status", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ message: "Unauthorized" });
      const { status } = req.body;
      const dbData = readDB();
      const userId = dbData.tokens[token];
      const user = dbData.users.find((u: any) => u.id === userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      user.status = status;
      writeDB(dbData);
      res.json({ message: "Status updated", status });
    } catch (error) {
      res.status(500).json({ message: "Error" });
    }
  });

  // ── PARTNER APPLICATION ───────────────────────────────────────────────────
  app.post("/api/partner", async (req, res) => {
    try {
      const { fullName, email, phone, vehicleType, driversLicense, message } = req.body;
      if (!fullName || !email || !phone)
        return res.status(400).json({ message: "Required fields missing" });
      const dbData = readDB();
      dbData.partners.push({
        id: Date.now().toString(), fullName, email, phone,
        vehicleType, driversLicense, message,
        status: "pending", createdAt: new Date().toISOString(),
      });
      writeDB(dbData);
      res.status(201).json({ message: "Application submitted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Submission failed" });
    }
  });

  // ── ADMIN ROUTES ─────────────────────────────────────────────────────────────
  function isAdmin(req: any, res: any) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return false;
    const dbData = readDB();
    return !!dbData.adminTokens[token];
  }

  app.get("/api/admin/stats", (req, res) => {
    if (!isAdmin(req, res)) return res.status(403).json({ message: "Forbidden" });
    const dbData = readDB();
    const today = new Date();
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const label = d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
      const count = dbData.bookings.filter((b: any) => {
        const bd = new Date(b.createdAt);
        return bd.toDateString() === d.toDateString();
      }).length + Math.floor(Math.random() * 8); // demo data
      const revenue = count * (Math.floor(Math.random() * 50) + 80);
      return { date: label, rides: count, revenue };
    });

    res.json({
      totalUsers: dbData.users.filter((u: any) => u.role !== "driver").length,
      totalDrivers: dbData.users.filter((u: any) => u.role === "driver").length,
      totalBookings: dbData.bookings.length,
      pendingVerifications: dbData.users.filter((u: any) => u.role === "driver" && !u.isVerified).length,
      totalPartnerApplications: dbData.partners.length,
      revenue: dbData.bookings.length * 145,
      last7Days: last7,
      userTypes: [
        { name: "Riders", value: dbData.users.filter((u: any) => u.role !== "driver").length || 3 },
        { name: "Drivers", value: dbData.users.filter((u: any) => u.role === "driver").length || 1 },
      ],
    });
  });

  app.get("/api/admin/users", (req, res) => {
    if (!isAdmin(req, res)) return res.status(403).json({ message: "Forbidden" });
    const dbData = readDB();
    res.json(dbData.users.map((u: any) => ({ ...u, password: undefined })));
  });

  app.get("/api/admin/drivers", (req, res) => {
    if (!isAdmin(req, res)) return res.status(403).json({ message: "Forbidden" });
    const dbData = readDB();
    res.json(dbData.users.filter((u: any) => u.role === "driver").map((u: any) => ({ ...u, password: undefined })));
  });

  app.patch("/api/admin/drivers/:id/verify", (req, res) => {
    if (!isAdmin(req, res)) return res.status(403).json({ message: "Forbidden" });
    const { action } = req.body; // "verify" | "reject"
    const dbData = readDB();
    const driver = dbData.users.find((u: any) => u.id === req.params.id && u.role === "driver");
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    driver.isVerified = action === "verify";
    driver.verificationStatus = action === "verify" ? "verified" : "rejected";
    writeDB(dbData);
    res.json({ message: `Driver ${action}d`, driver: { ...driver, password: undefined } });
  });

  app.get("/api/admin/bookings", (req, res) => {
    if (!isAdmin(req, res)) return res.status(403).json({ message: "Forbidden" });
    const dbData = readDB();
    res.json(dbData.bookings);
  });

  app.get("/api/admin/partners", (req, res) => {
    if (!isAdmin(req, res)) return res.status(403).json({ message: "Forbidden" });
    const dbData = readDB();
    res.json(dbData.partners);
  });

  app.patch("/api/admin/users/:id/ban", (req, res) => {
    if (!isAdmin(req, res)) return res.status(403).json({ message: "Forbidden" });
    const dbData = readDB();
    const user = dbData.users.find((u: any) => u.id === req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isBanned = !user.isBanned;
    writeDB(dbData);
    res.json({ message: user.isBanned ? "User banned" : "User unbanned" });
  });

  return app;
}
