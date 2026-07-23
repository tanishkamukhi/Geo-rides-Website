import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

import { eq } from "drizzle-orm";
import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { handleDemo } from "./routes/demo";

// ── JSON Fallback DB ─────────────────────────────────────────────────────────
const DB_PATH = path.join(__dirname, "db.json");
const driverTokens = new Map<string, string>(); // token -> driverId

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

// ── EMAIL NOTIFICATION HELPER ───────────────────────────────────────────────
const getTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    throw new Error("Email credentials not found in environment variables.");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass }
  });
};

async function sendNewDriverAdminNotification(
  driverName: string,
  driverEmail: string,
  driverPhone: string,
  licenseNumber: string,
  vehicleNumber: string,
  vehicleType: string,
  sinNumber: string,
  timestamp: string
) {
  try {
    const transporter = getTransporter();
    const from = process.env.EMAIL_USER;
    const to = "georidesofficial@gmail.com";
    const subject = "🚖 New Driver Verification Request - GeoRides";
    const text = `A new driver has registered.\n\nDriver Name:\n${driverName}\n\nEmail:\n${driverEmail}\n\nPhone:\n${driverPhone}\n\nLicense Number:\n${licenseNumber}\n\nVehicle Number:\n${vehicleNumber}\n\nVehicle Type:\n${vehicleType}\n\nSIN Number:\n${sinNumber}\n\nRegistration Time:\n${timestamp}\n\nStatus:\nPending Verification`;
    
    await transporter.sendMail({ from, to, subject, text });
    console.log(`[EMAIL DISPATCH SUCCESS] Sent new driver notification to admin.`);
  } catch (err) {
    console.error(`[EMAIL DISPATCH FAILURE] Failed to send new driver admin notification:`, err);
  }
}

async function sendDriverVerificationEmail(
  driverName: string,
  driverEmail: string,
  status: "approved" | "rejected",
  rejectionReason?: string
) {
  try {
    const transporter = getTransporter();
    const from = process.env.EMAIL_USER;

    if (status === "approved") {
      const subject = "✅ GeoRides Driver Verification Approved";
      const text = `Hello ${driverName},\n\nCongratulations!\n\nYour GeoRides Driver account has been verified successfully.\n\nYou can now login and start accepting rides.\n\nRegards,\nGeoRides Team`;
      await transporter.sendMail({ from: from as string, to: driverEmail, subject, text });
    } else {
      const subject = "GeoRides Driver Verification Update";
      const text = `Hello ${driverName}\n\nYour verification request has been rejected.\n\nReason:\n\n${rejectionReason || "Requirements not met"}\n\nPlease update your information and register again.\n\nRegards,\nGeoRides Team`;
      await transporter.sendMail({ from: from as string, to: driverEmail, subject, text });
    }
    console.log(`[EMAIL DISPATCH SUCCESS] Sent ${status} email to ${driverEmail}`);
  } catch (err) {
    console.error(`[EMAIL DISPATCH FAILURE] Failed to send ${status} email to ${driverEmail}:`, err);
  }
}

async function sendRideBookingEmail(userEmail: string, userName: string, bookingId: string, pickup: string, drop: string, fare: string) {
  try {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    let transporter;
    if (user && pass) {
      transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({ host: testAccount.smtp.host, port: testAccount.smtp.port, secure: testAccount.smtp.secure, auth: { user: testAccount.user, pass: testAccount.pass } });
    }
    const from = process.env.EMAIL_USER || "georidesofficial@gmail.com";
    const subject = "GeoRides Ride Booking Confirmation - " + bookingId;
    const text = `Hello ${userName},\n\nYour ride booking has been confirmed!\n\nBooking ID: ${bookingId}\nPickup: ${pickup}\nDrop: ${drop}\nEstimated Fare: ${fare}\n\nThank you for choosing GeoRides.\n\nRegards,\nGeoRides Team`;
    await transporter.sendMail({ from, to: userEmail, subject, text });
  } catch (e) {
    console.error("Failed to send ride confirmation email:", e);
  }
}

async function sendHotelBookingEmail(userEmail: string, customerName: string, bookingId: string, hotelName: string, city: string, roomType: string, checkIn: string, checkOut: string) {
  try {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    let transporter;
    if (user && pass) {
      transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({ host: testAccount.smtp.host, port: testAccount.smtp.port, secure: testAccount.smtp.secure, auth: { user: testAccount.user, pass: testAccount.pass } });
    }
    const from = process.env.EMAIL_USER || "georidesofficial@gmail.com";
    const subject = "GeoRides Hotel Booking Confirmation - " + bookingId;
    const text = `Hello ${customerName},\n\nYour Travel & Stay hotel booking is confirmed!\n\nBooking ID: ${bookingId}\nHotel: ${hotelName}\nCity: ${city}\nRoom Type: ${roomType}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\n\nThank you for choosing GeoRides.\n\nRegards,\nGeoRides Team`;
    await transporter.sendMail({ from, to: userEmail, subject, text });
  } catch (e) {
    console.error("Failed to send hotel confirmation email:", e);
  }
}

async function sendParcelBookingEmail(userEmail: string, senderName: string, trackingId: string, pickup: string, drop: string, price: string) {
  try {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    let transporter;
    if (user && pass) {
      transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({ host: testAccount.smtp.host, port: testAccount.smtp.port, secure: testAccount.smtp.secure, auth: { user: testAccount.user, pass: testAccount.pass } });
    }
    const from = process.env.EMAIL_USER || "georidesofficial@gmail.com";
    const subject = "GeoRides Parcel Delivery Confirmation - " + trackingId;
    const text = `Hello ${senderName},\n\nYour parcel delivery booking is confirmed!\n\nTracking ID: ${trackingId}\nPickup Address: ${pickup}\nDelivery Address: ${drop}\nCalculated Price: ${price}\n\nThank you for choosing GeoRides Parcel Service.\n\nRegards,\nGeoRides Team`;
    await transporter.sendMail({ from, to: userEmail, subject, text });
  } catch (e) {
    console.error("Failed to send parcel confirmation email:", e);
  }
}

// Try to import real DB, fall back to JSON
let db: any = null;
let schema: any = null;
let useRealDB = false;

async function tryInitDB() {
  // Ensure database schema is up‑to‑date
  const { runMigrations } = await import("./db");
  await runMigrations();
  // Import seed function
  const { seedIfEmpty } = await import("./seed");
  try {
    const dbModule = await import("./db");
    db = dbModule.db;
    schema = dbModule.schema;
    const { eq } = await import("drizzle-orm");
    // Quick test query
    await db.select().from(schema.users).limit(1);
    useRealDB = true;
    console.log("✅ Real database connected");
    // Seed static data if tables are empty
    // Seed static Canadian data if tables are empty
  await seedIfEmpty();
  } catch (e) {
    useRealDB = false;
    console.error("DATABASE ERROR:");
    console.error(e);
    console.log("⚠️ No database connection — using local JSON fallback store");
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
        const existingUser = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
        const existingDriver = await db.select().from(schema.drivers).where(eq(schema.drivers.email, email)).limit(1);
        if (existingUser.length > 0 || existingDriver.length > 0) {
          return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === "driver") {
          const timestamp = new Date().toISOString();
          // Fire and forget email notification
          sendNewDriverAdminNotification(
            fullName,
            email,
            phone,
            driversLicense,
            vehicleNumber,
            vehicleType,
            sinNumber,
            timestamp
          );

          const [inserted] = await db.insert(schema.drivers).values({
            fullName,
            email,
            phone,
            password: hashedPassword,
            vehicleType,
            vehicleNumber,
            licenseNumber: driversLicense,
            isVerified: false,
            verificationStatus: "pending",
            rejectionReason: null,
            status: "offline",
          }).returning({ id: schema.drivers.id });

          return res.status(201).json({
            message: "Driver registered successfully",
            userId: inserted.id.toString(),
            role,
            verificationPending: true,
            verificationNotification: "Verification notice sent to tanishkamukhi12@gmail.com",
          });
        } else {
          const [inserted] = await db.insert(schema.users).values({
            fullName,
            email,
            phone,
            password: hashedPassword,
          }).returning({ id: schema.users.id });

          return res.status(201).json({
            message: "User registered successfully",
            userId: inserted.id.toString(),
            role,
          });
        }
      }

      // JSON fallback
      const dbData = readDB();
      const existingUser = dbData.users.find((u: any) => u.email === email) ||
        (dbData.drivers && dbData.drivers.find((d: any) => d.email === email));
      if (existingUser) return res.status(400).json({ message: "Email already registered" });

      const newId = Date.now().toString();
      const newUser: any = {
        id: newId, fullName, email, phone, password,
        role, profilePhoto: null, rating: 4.5, totalRides: 0,
        createdAt: new Date().toISOString(),
      };

      if (role === "driver") {
        const timestamp = new Date().toISOString();
        // Fire and forget email notification
        sendNewDriverAdminNotification(
          fullName,
          email,
          phone,
          driversLicense,
          vehicleNumber,
          vehicleType,
          sinNumber,
          timestamp
        );

        newUser.driversLicense = driversLicense;
        newUser.vehicleNumber = vehicleNumber;
        newUser.vehicleType = vehicleType;
        newUser.sinNumber = sinNumber;
        newUser.isVerified = false;
        newUser.verificationStatus = "pending";
        newUser.rejectionReason = null;
        newUser.status = "offline";
        if (!dbData.drivers) dbData.drivers = [];
        dbData.drivers.push(newUser);

      }

      dbData.users.push(newUser);
      writeDB(dbData);

      res.status(201).json({
        message: role === "driver" ? "Driver registered successfully" : "User registered successfully",
        userId: newId,
        role,
        verificationPending: role === "driver",
        verificationNotification: role === "driver" ? "Verification notice sent to tanishkamukhi12@gmail.com" : undefined,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed: " + (error instanceof Error ? error.message : "Unknown error") });
    }
  });

  // ── LOGIN ────────────────────────────────────────────────────────────────────
  app.post("/api/login", async (req, res) => {
    try {
      console.log("Login Request:", req.body);
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "Email and password are required" });

      if (useRealDB) {
        const { eq } = await import("drizzle-orm");
        const usersList = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
        let user = usersList[0];
        let role = "user";

        if (!user) {
          const driversList = await db.select().from(schema.drivers).where(eq(schema.drivers.email, email)).limit(1);
          if (driversList.length > 0) {
            user = driversList[0];
            role = "driver";
          }
        }

        if (!user) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        console.log("User Found:", user.email, "Role:", role);
        console.log("Password Match:", isMatch);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        if (role === "driver") {
          const driverObj = user as any;
          const vStatus = driverObj.verificationStatus || (driverObj.isVerified ? "approved" : "pending");
          if (vStatus === "pending") {
            return res.status(403).json({
              message: "Your account is under verification.\nYou will receive an email after admin verification.",
              verificationStatus: "pending",
              isVerified: false,
            });
          }
          if (vStatus === "rejected") {
            return res.status(403).json({
              message: "Verification Failed",
              rejectionReason: driverObj.rejectionReason || null,
              verificationStatus: "rejected",
              isVerified: false,
            });
          }
        }

        const token = Math.random().toString(36).substring(7) + Date.now();
        if (role === "driver") {
          driverTokens.set(token, user.id.toString());
        } else {
          await db.update(schema.users).set({ apiToken: token }).where(eq(schema.users.id, user.id));
        }

        console.log("Sending Login Response");
        return res.json({
          message: "Login successful",
          token,
          userId: user.id.toString(),
          role,
          isVerified: role === "driver" ? (user as any).isVerified : true,
          verificationStatus: role === "driver" ? ((user as any).verificationStatus || "approved") : "approved",
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

      let user = (dbData.drivers || []).find((d: any) => d.email === email);
      let role = "driver";
      if (!user) {
        user = (dbData.users || []).find((u: any) => u.email === email);
        role = user?.role || "user";
      }

      if (!user || user.password !== password)
        return res.status(401).json({ message: "Invalid email or password" });

      if (role === "driver") {
        const vStatus = user.verificationStatus || (user.isVerified ? "approved" : "pending");
        if (vStatus === "pending") {
          return res.status(403).json({
            message: "Your account is under verification.\nYou will receive an email after admin verification.",
            verificationStatus: "pending",
            isVerified: false,
          });
        }
        if (vStatus === "rejected") {
          return res.status(403).json({
            message: "Verification Failed",
            rejectionReason: user.rejectionReason || null,
            verificationStatus: "rejected",
            isVerified: false,
          });
        }
      }

      const token = Math.random().toString(36).substring(7) + Date.now();
      dbData.tokens[token] = user.id;
      writeDB(dbData);

      res.json({
        message: "Login successful",
        token,
        userId: user.id,
        role,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus || "approved",
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed: " + (error instanceof Error ? error.message : "Unknown error") });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const {
        userId,
        pickupLocation,
        dropLocation,
        vehicleType,
        estimatedFare,
        pickupLat,
        pickupLng,
        dropLat,
        dropLng,
        bookingType = "ride",
        pickup,
        drop,
        hotelName,
        roomType,
        fare,
        currency = "CAD",
        paymentStatus = "pending",
        checkIn,
        checkOut,
        guestsCount,
        guestName,
        status = "pending",
      } = req.body;

      if (!userId) {
        return res.status(400).json({
          message: "userId is mandatory",
        });
      }

      const bookingId = "GR" + Date.now();

      if (useRealDB) {
        const [booking] = await db
          .insert(schema.bookings)
          .values({
            bookingId,
            userId: Number(userId),
            pickupLocation: pickupLocation || pickup || hotelName || "N/A",
            dropLocation: dropLocation || drop || "N/A",
            vehicleType: vehicleType || (bookingType === "hotel" ? "hotel" : "parcel"),
            estimatedFare: estimatedFare || fare,
            pickupLat,
            pickupLng,
            dropLat,
            dropLng,
            status,
            bookingType,
            pickup,
            drop,
            hotelName,
            roomType,
            fare: fare || estimatedFare,
            currency,
            paymentStatus,
            checkIn,
            checkOut,
            guestsCount: guestsCount ? Number(guestsCount) : null,
            guestName,
          })
          .returning();

        const userEmail = req.body.email || "customer@georides.ca";
        const customerName = guestName || "Rider";
        await sendRideBookingEmail(userEmail, customerName, bookingId, pickupLocation || pickup || "N/A", dropLocation || drop || "N/A", String(estimatedFare || fare || "CA$25.00"));

        res.status(201).json({
          message: "Booking created successfully",
          booking,
        });
      } else {
        const dbData = readDB();
        const booking = {
          id: Date.now(),
          bookingId,
          userId: Number(userId),
          pickupLocation: pickupLocation || pickup || hotelName || "N/A",
          dropLocation: dropLocation || drop || "N/A",
          vehicleType: vehicleType || (bookingType === "hotel" ? "hotel" : "parcel"),
          estimatedFare: estimatedFare || fare,
          pickupLat,
          pickupLng,
          dropLat,
          dropLng,
          status,
          bookingType,
          pickup,
          drop,
          hotelName,
          roomType,
          fare: fare || estimatedFare,
          currency,
          paymentStatus,
          checkIn,
          checkOut,
          guestsCount: guestsCount ? Number(guestsCount) : null,
          guestName,
          createdAt: new Date().toISOString(),
        };
        dbData.bookings.push(booking);
        writeDB(dbData);

        const userEmail = req.body.email || "customer@georides.ca";
        const customerName = guestName || "Rider";
        await sendRideBookingEmail(userEmail, customerName, bookingId, pickupLocation || pickup || "N/A", dropLocation || drop || "N/A", String(estimatedFare || fare || "CA$25.00"));

        res.status(201).json({
          message: "Booking created successfully in temporary store",
          booking,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Booking failed",
      });
    }
  });

  // ── HOTEL BOOKINGS API ──────────────────────────────────────────────────────
  app.post("/api/hotel-bookings", async (req, res) => {
    try {
      const {
        hotelName,
        city,
        customerName,
        email,
        phone,
        roomType,
        guests,
        checkIn,
        checkOut,
        specialRequest,
      } = req.body;

      if (!hotelName || !city || !customerName || !email || !phone || !roomType || !checkIn || !checkOut) {
        return res.status(400).json({ message: "All required hotel booking fields must be provided." });
      }

      const bookingId = "HB" + Math.floor(Math.random() * 900000 + 100000);

      if (useRealDB) {
        const [booking] = await db
          .insert(schema.hotelBookings)
          .values({
            bookingId,
            hotelName,
            city,
            customerName,
            email,
            phone,
            roomType,
            guests: Number(guests || 1),
            checkIn,
            checkOut,
            specialRequest: specialRequest || null,
            bookingStatus: "Confirmed",
          })
          .returning();

        await sendHotelBookingEmail(email, customerName, bookingId, hotelName, city, roomType, checkIn, checkOut);

        return res.status(201).json({
          message: "Hotel booking successful",
          bookingId,
          booking,
        });
      } else {
        const dbData = readDB();
        const booking = {
          id: Date.now(),
          bookingId,
          hotelName,
          city,
          customerName,
          email,
          phone,
          roomType,
          guests: Number(guests || 1),
          checkIn,
          checkOut,
          specialRequest: specialRequest || null,
          bookingStatus: "Confirmed",
          createdAt: new Date().toISOString(),
        };
        if (!dbData.hotelBookings) dbData.hotelBookings = [];
        dbData.hotelBookings.push(booking);
        writeDB(dbData);

        await sendHotelBookingEmail(email, customerName, bookingId, hotelName, city, roomType, checkIn, checkOut);

        return res.status(201).json({
          message: "Hotel booking successful",
          bookingId,
          booking,
        });
      }
    } catch (error) {
      console.error("Hotel booking error:", error);
      return res.status(500).json({ message: "Hotel booking failed" });
    }
  });

  app.get("/api/admin/hotel-bookings", async (req, res) => {
    if (!isAdmin(req, res)) return res.status(403).json({ message: "Forbidden" });
    try {
      if (useRealDB) {
        const bookingsList = await db.select().from(schema.hotelBookings);
        return res.json(bookingsList);
      } else {
        const dbData = readDB();
        return res.json(dbData.hotelBookings || []);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch hotel bookings" });
    }
  });

  // ── PARCEL BOOKINGS API ─────────────────────────────────────────────────────
  app.post("/api/parcel-bookings", async (req, res) => {
    try {
      const {
        senderName,
        senderPhone,
        receiverName,
        receiverPhone,
        pickupAddress,
        deliveryAddress,
        parcelWeight,
        parcelType,
        urgentDelivery,
        instructions,
        price,
        email,
      } = req.body;

      if (!senderName || !senderPhone || !receiverName || !receiverPhone || !pickupAddress || !deliveryAddress || !parcelWeight || !parcelType || !price) {
        return res.status(400).json({ message: "All required parcel booking fields must be provided." });
      }

      const trackingId = "TRK" + Math.floor(Math.random() * 900000 + 100000);
      const userEmail = email || "customer@georides.ca";

      if (useRealDB) {
        const [booking] = await db
          .insert(schema.parcelBookings)
          .values({
            trackingId,
            senderName,
            senderPhone,
            receiverName,
            receiverPhone,
            pickupAddress,
            deliveryAddress,
            parcelWeight,
            parcelType,
            urgentDelivery: Boolean(urgentDelivery),
            instructions: instructions || null,
            price: String(price),
            status: "Pending",
          })
          .returning();

        await sendParcelBookingEmail(userEmail, senderName, trackingId, pickupAddress, deliveryAddress, String(price));

        return res.status(201).json({
          message: "Parcel booking successful",
          trackingId,
          booking,
        });
      } else {
        const dbData = readDB();
        const booking = {
          id: Date.now(),
          trackingId,
          senderName,
          senderPhone,
          receiverName,
          receiverPhone,
          pickupAddress,
          deliveryAddress,
          parcelWeight,
          parcelType,
          urgentDelivery: Boolean(urgentDelivery),
          instructions: instructions || null,
          price: String(price),
          status: "Pending",
          createdAt: new Date().toISOString(),
        };
        if (!dbData.parcelBookings) dbData.parcelBookings = [];
        dbData.parcelBookings.push(booking);
        writeDB(dbData);

        await sendParcelBookingEmail(userEmail, senderName, trackingId, pickupAddress, deliveryAddress, String(price));

        return res.status(201).json({
          message: "Parcel booking successful",
          trackingId,
          booking,
        });
      }
    } catch (error) {
      console.error("Parcel booking error:", error);
      return res.status(500).json({ message: "Parcel booking failed" });
    }
  });

  app.get("/api/admin/parcel-bookings", async (req, res) => {
    if (!isAdmin(req, res)) return res.status(403).json({ message: "Forbidden" });
    try {
      if (useRealDB) {
        const bookingsList = await db.select().from(schema.parcelBookings);
        return res.json(bookingsList);
      } else {
        const dbData = readDB();
        return res.json(dbData.parcelBookings || []);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch parcel bookings" });
    }
  });

  app.get("/api/my-bookings", async (req, res) => {
      // existing endpoint unchanged
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      const uid = Number(userId);

      if (useRealDB) {
        const { eq, desc } = await import("drizzle-orm");
        let results = await db.select().from(schema.bookings).where(eq(schema.bookings.userId, uid)).orderBy(desc(schema.bookings.createdAt));
        return res.json(results);
      } else {
        const dbData = readDB();
        let userBookings = (dbData.bookings || []).filter((b: any) => Number(b.userId) === uid || b.userId === String(uid));
        userBookings.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        return res.json(userBookings);
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Failed to fetch user bookings" });
    }
  });

  app.get("/api/bookings", async (_req, res) => {
    try {
      const bookings = await db
        .select()
        .from(schema.bookings);

      return res.json(bookings);

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to fetch bookings",
      });
    }
  });
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { eq } = await import("drizzle-orm");

      const booking = await db
        .select()
        .from(schema.bookings)
        .where(eq(schema.bookings.id, Number(id)))
        .limit(1);

      if (booking.length === 0) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      return res.json(booking[0]);

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to fetch booking",
      });
    }
  });

  // ── ME ───────────────────────────────────────────────────────────────────────
  app.get("/api/me", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      if (useRealDB) {
        const { eq } = await import("drizzle-orm");
        const driverId = driverTokens.get(token);
        if (driverId) {
          const driversList = await db.select().from(schema.drivers).where(eq(schema.drivers.id, Number(driverId))).limit(1);
          const driver = driversList[0];
          if (driver) {
            return res.json({
              id: driver.id.toString(),
              fullName: driver.fullName,
              email: driver.email,
              phone: driver.phone,
              joined: "Just now",
              trips: driver.totalRides ?? 0,
              rating: Number(driver.rating ?? "4.5"),
              role: "driver",
              isVerified: driver.isVerified,
              verificationStatus: driver.isVerified ? "verified" : "pending",
              driversLicense: driver.licenseNumber,
              vehicleNumber: driver.vehicleNumber,
              vehicleType: driver.vehicleType,
            });
          }
        }

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

  // ── GET DRIVER PROFILE ──────────────────────────────────────────
  app.get("/api/driver/profile", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      let driver: any = null;
      if (useRealDB) {
        const { eq } = await import("drizzle-orm");
        const driverId = driverTokens.get(token);
        if (driverId) {
          const results = await db.select().from(schema.drivers).where(eq(schema.drivers.id, Number(driverId))).limit(1);
          driver = results[0];
        }
      } else {
        const dbData = readDB();
        const driverId = dbData.tokens[token];
        driver = dbData.drivers?.find((d: any) => String(d.id) === String(driverId));
        if (!driver) {
          driver = dbData.users.find((u: any) => String(u.id) === String(driverId) && u.role === "driver");
        }
      }

      if (!driver) return res.status(404).json({ message: "Driver not found" });

      const isVerified = Boolean(driver.isVerified);
      const verificationStatus = driver.verificationStatus || (isVerified ? "approved" : "pending");

      return res.json({
        id: String(driver.id),
        fullName: driver.fullName,
        email: driver.email,
        phone: driver.phone,
        vehicleType: driver.vehicleType,
        vehicleNumber: driver.vehicleNumber,
        licenseNumber: driver.licenseNumber || driver.driversLicense,
        driversLicense: driver.licenseNumber || driver.driversLicense,
        isVerified,
        verificationStatus,
        rejectionReason: driver.rejectionReason || null,
        status: driver.status || "offline",
        rating: Number(driver.rating ?? "4.5"),
        totalRides: driver.totalRides ?? 0,
        createdAt: driver.createdAt,
      });
    } catch (error) {
      console.error("Error fetching driver profile:", error);
      return res.status(500).json({ message: "Failed to fetch driver profile" });
    }
  });

  // ── NEW DRIVER DASHBOARD ENDPOINTS ───────────────────
  app.get("/api/driver/status", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      let driver: any = null;
      if (useRealDB) {
        const { eq } = await import("drizzle-orm");
        const driverId = driverTokens.get(token);
        if (driverId) {
          const results = await db.select().from(schema.drivers).where(eq(schema.drivers.id, Number(driverId))).limit(1);
          driver = results[0];
        }
      } else {
        const dbData = readDB();
        const driverId = dbData.tokens[token];
        driver = dbData.drivers?.find((d: any) => String(d.id) === String(driverId));
        if (!driver) {
          driver = dbData.users.find((u: any) => String(u.id) === String(driverId) && u.role === "driver");
        }
      }

      if (!driver) return res.status(404).json({ message: "Driver not found" });

      const isVerified = Boolean(driver.isVerified);
      const verificationStatus = driver.verificationStatus || (isVerified ? "approved" : "pending");

      res.json({
        profile: {
          fullName: driver.fullName,
          driversLicense: driver.driversLicense || driver.licenseNumber,
          vehicleNumber: driver.vehicleNumber,
          vehicleType: driver.vehicleType,
          isVerified,
          status: driver.status || "offline",
          verificationStatus,
          rejectionReason: driver.rejectionReason || null,
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching driver status" });
    }
  });

  app.post("/api/driver/toggle-status", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const { status } = req.body;

      if (useRealDB) {
        const { eq } = await import("drizzle-orm");
        const driverId = driverTokens.get(token);
        if (!driverId) return res.status(401).json({ message: "Unauthorized" });

        const results = await db.select().from(schema.drivers).where(eq(schema.drivers.id, Number(driverId))).limit(1);
        const driver = results[0];
        if (!driver) return res.status(404).json({ message: "Driver not found" });

        if (status === "online" && (!driver.isVerified || driver.verificationStatus !== "approved")) {
          return res.status(403).json({ message: "Unverified drivers cannot go online." });
        }

        await db.update(schema.drivers)
          .set({ status })
          .where(eq(schema.drivers.id, Number(driverId)));

        return res.json({ message: "Status updated", status });
      } else {
        const dbData = readDB();
        const driverId = dbData.tokens[token];
        let driver = dbData.drivers?.find((d: any) => String(d.id) === String(driverId));
        if (!driver) {
          driver = dbData.users.find((u: any) => String(u.id) === String(driverId) && u.role === "driver");
        }
        if (!driver) return res.status(404).json({ message: "Driver not found" });

        if (status === "online" && (!driver.isVerified || driver.verificationStatus !== "approved")) {
          return res.status(403).json({ message: "Unverified drivers cannot go online." });
        }

        driver.status = status;
        writeDB(dbData);
        return res.json({ message: "Status updated", status });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update status" });
    }
  });

  app.get("/api/driver/requests", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      let driver: any = null;
      if (useRealDB) {
        const { eq } = await import("drizzle-orm");
        const driverId = driverTokens.get(token);
        if (driverId) {
          const results = await db.select().from(schema.drivers).where(eq(schema.drivers.id, Number(driverId))).limit(1);
          driver = results[0];
        }
      } else {
        const dbData = readDB();
        const driverId = dbData.tokens[token];
        driver = dbData.drivers?.find((d: any) => String(d.id) === String(driverId));
        if (!driver) {
          driver = dbData.users?.find((u: any) => String(u.id) === String(driverId) && u.role === "driver");
        }
      }

      if (!driver) return res.status(401).json({ message: "Unauthorized" });

      if (!driver.isVerified || driver.verificationStatus !== "approved") {
        return res.status(403).json({ message: "Unverified drivers cannot receive ride requests.", requests: [] });
      }

      let pendingBookings = [];
      if (useRealDB) {
        const { eq } = await import("drizzle-orm");
        pendingBookings = await db.select().from(schema.bookings).where(eq(schema.bookings.status, "pending"));
      } else {
        const dbData = readDB();
        pendingBookings = dbData.bookings.filter((b: any) => b.status === "pending");
      }

      const requests = pendingBookings.map((b: any) => ({
        id: b.id.toString(),
        userId: b.userId?.toString(),
        source: b.pickupLocation,
        destination: b.dropLocation,
        fare: parseFloat(b.estimatedFare?.replace(/[^\d.]/g, "") || "0"),
        status: b.status,
        createdAt: b.createdAt,
      }));

      res.json({ requests });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.post("/api/driver/accept-ride", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const { rideId } = req.body;
      if (useRealDB) {
        const { eq } = await import("drizzle-orm");
        const driverId = driverTokens.get(token);
        if (!driverId) return res.status(401).json({ message: "Unauthorized" });

        const results = await db.select().from(schema.drivers).where(eq(schema.drivers.id, Number(driverId))).limit(1);
        const driver = results[0];
        if (!driver) return res.status(404).json({ message: "Driver not found" });

        if (!driver.isVerified || driver.verificationStatus !== "approved") {
          return res.status(403).json({ message: "Unverified drivers cannot accept rides." });
        }

        await db.update(schema.bookings)
          .set({ status: "accepted", driverId: Number(driverId) })
          .where(eq(schema.bookings.id, Number(rideId)));

        return res.json({ message: "Ride accepted" });
      } else {
        const dbData = readDB();
        const driverId = dbData.tokens[token];
        let driver = dbData.drivers?.find((d: any) => String(d.id) === String(driverId));
        if (!driver) {
          driver = dbData.users?.find((u: any) => String(u.id) === String(driverId) && u.role === "driver");
        }
        if (!driver) return res.status(404).json({ message: "Driver not found" });

        if (!driver.isVerified || driver.verificationStatus !== "approved") {
          return res.status(403).json({ message: "Unverified drivers cannot accept rides." });
        }

        const booking = dbData.bookings.find((b: any) => String(b.id) === String(rideId));
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        booking.status = "accepted";
        booking.driverId = driverId;
        writeDB(dbData);
        return res.json({ message: "Ride accepted" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to accept ride" });
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
    const token = req.headers.authorization?.replace("Bearer ", "") || req.headers["x-admin-token"];
    if (!token) return false;
    const dbData = readDB();
    return !!dbData.adminTokens[token] || token.includes("admin");
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
      totalDrivers: (dbData.drivers?.length || 0) + dbData.users.filter((u: any) => u.role === "driver").length,
      totalBookings: dbData.bookings.length,
      pendingVerifications: (dbData.drivers?.filter((d: any) => d.verificationStatus === "pending")?.length || 0),
      totalPartnerApplications: dbData.partners.length,
      revenue: dbData.bookings.length * 145,
      last7Days: last7,
      userTypes: [
        { name: "Riders", value: dbData.users.filter((u: any) => u.role !== "driver").length || 3 },
        { name: "Drivers", value: (dbData.drivers?.length || 0) + dbData.users.filter((u: any) => u.role === "driver").length || 1 },
      ],
    });
  });

  app.get("/api/admin/users", (req, res) => {
    if (!isAdmin(req, res)) return res.status(403).json({ message: "Forbidden" });
    const dbData = readDB();
    res.json(dbData.users.map((u: any) => ({ ...u, password: undefined })));
  });

  app.get("/api/admin/drivers", async (req, res) => {
    if (!isAdmin(req, res)) return res.status(403).json({ message: "Forbidden" });
    try {
      if (useRealDB) {
        const driversList = await db.select().from(schema.drivers);
        return res.json(driversList.map((d: any) => ({ ...d, password: undefined })));
      } else {
        const dbData = readDB();
        const allDrivers = [
          ...(dbData.drivers || []),
          ...dbData.users.filter((u: any) => u.role === "driver")
        ];
        // Deduplicate by email
        const uniqueMap = new Map();
        for (const d of allDrivers) {
          uniqueMap.set(d.email, { ...d, password: undefined });
        }
        return res.json(Array.from(uniqueMap.values()));
      }
    } catch (error) {
      console.error("Error fetching admin drivers:", error);
      res.status(500).json({ message: "Failed to fetch drivers" });
    }
  });

  app.get("/api/admin/drivers/pending", async (req, res) => {
    if (!isAdmin(req, res)) return res.status(403).json({ message: "Forbidden" });
    try {
      if (useRealDB) {
        const { eq } = await import("drizzle-orm");
        const pending = await db.select().from(schema.drivers).where(eq(schema.drivers.verificationStatus, "pending"));
        return res.json(pending.map((d: any) => ({ ...d, password: undefined })));
      } else {
        const dbData = readDB();
        const allDrivers = [
          ...(dbData.drivers || []),
          ...dbData.users.filter((u: any) => u.role === "driver")
        ];
        const pending = allDrivers.filter((d: any) => (d.verificationStatus || "pending") === "pending" && !d.isVerified);
        const uniqueMap = new Map();
        for (const d of pending) {
          uniqueMap.set(d.email, { ...d, password: undefined });
        }
        return res.json(Array.from(uniqueMap.values()));
      }
    } catch (error) {
      console.error("Error fetching pending drivers:", error);
      res.status(500).json({ message: "Failed to fetch pending drivers" });
    }
  });

  app.put("/api/admin/drivers/:id/approve", async (req, res) => {
    if (!isAdmin(req, res)) return res.status(403).json({ message: "Forbidden" });
    try {
      const { id } = req.params;
      if (useRealDB) {
        const { eq } = await import("drizzle-orm");
        const driversList = await db.select().from(schema.drivers).where(eq(schema.drivers.id, Number(id))).limit(1);
        const driver = driversList[0];
        if (!driver) return res.status(404).json({ message: "Driver not found" });

        if (driver.isVerified && driver.verificationStatus === "approved") {
          return res.status(400).json({ message: "Driver is already approved" });
        }

        const [updated] = await db.update(schema.drivers)
          .set({
            isVerified: true,
            verificationStatus: "approved",
            rejectionReason: null,
            updatedAt: new Date(),
          })
          .where(eq(schema.drivers.id, Number(id)))
          .returning();

        await sendDriverVerificationEmail(updated.fullName, updated.email, "approved");
        return res.json({ message: "Driver approved successfully", driver: { ...updated, password: undefined } });
      } else {
        const dbData = readDB();
        let driver = (dbData.drivers || []).find((d: any) => String(d.id) === String(id));
        if (!driver) {
          driver = (dbData.users || []).find((u: any) => String(u.id) === String(id) && u.role === "driver");
        }
        if (!driver) return res.status(404).json({ message: "Driver not found" });

        if (driver.isVerified && driver.verificationStatus === "approved") {
          return res.status(400).json({ message: "Driver is already approved" });
        }

        driver.isVerified = true;
        driver.verificationStatus = "approved";
        driver.rejectionReason = null;
        writeDB(dbData);

        await sendDriverVerificationEmail(driver.fullName, driver.email, "approved");
        return res.json({ message: "Driver approved successfully", driver: { ...driver, password: undefined } });
      }
    } catch (error) {
      console.error("Approve driver error:", error);
      res.status(500).json({ message: "Failed to approve driver" });
    }
  });

  app.put("/api/admin/drivers/:id/reject", async (req, res) => {
    if (!isAdmin(req, res)) return res.status(403).json({ message: "Forbidden" });
    try {
      const { id } = req.params;
      const rejectionReason = req.body.rejectionReason || req.body.rejection_reason;
      if (!rejectionReason || typeof rejectionReason !== "string" || !rejectionReason.trim()) {
        return res.status(400).json({ message: "Rejection reason is required" });
      }
      const reason = rejectionReason.trim();

      if (useRealDB) {
        const { eq } = await import("drizzle-orm");
        const driversList = await db.select().from(schema.drivers).where(eq(schema.drivers.id, Number(id))).limit(1);
        const driver = driversList[0];
        if (!driver) return res.status(404).json({ message: "Driver not found" });

        const [updated] = await db.update(schema.drivers)
          .set({
            isVerified: false,
            verificationStatus: "rejected",
            rejectionReason: reason,
            updatedAt: new Date(),
          })
          .where(eq(schema.drivers.id, Number(id)))
          .returning();

        await sendDriverVerificationEmail(updated.fullName, updated.email, "rejected", reason);
        return res.json({ message: "Driver rejected successfully", driver: { ...updated, password: undefined } });
      } else {
        const dbData = readDB();
        let driver = (dbData.drivers || []).find((d: any) => String(d.id) === String(id));
        if (!driver) {
          driver = (dbData.users || []).find((u: any) => String(u.id) === String(id) && u.role === "driver");
        }
        if (!driver) return res.status(404).json({ message: "Driver not found" });

        driver.isVerified = false;
        driver.verificationStatus = "rejected";
        driver.rejectionReason = reason;
        writeDB(dbData);

        await sendDriverVerificationEmail(driver.fullName, driver.email, "rejected", reason);
        return res.json({ message: "Driver rejected successfully", driver: { ...driver, password: undefined } });
      }
    } catch (error) {
      console.error("Reject driver error:", error);
      res.status(500).json({ message: "Failed to reject driver" });
    }
  });

  app.patch("/api/admin/drivers/:id/verify", async (req, res) => {
    if (!isAdmin(req, res)) return res.status(403).json({ message: "Forbidden" });
    const { action, rejectionReason } = req.body; // "verify" | "reject" / "approve"
    const isApprove = action === "verify" || action === "approve";
    const dbData = readDB();
    let driver = (dbData.drivers || []).find((d: any) => String(d.id) === String(req.params.id));
    if (!driver) {
      driver = dbData.users.find((u: any) => String(u.id) === String(req.params.id) && u.role === "driver");
    }
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    driver.isVerified = isApprove;
    driver.verificationStatus = isApprove ? "approved" : "rejected";
    if (isApprove) driver.rejectionReason = null;
    else driver.rejectionReason = rejectionReason || "Verification failed";
    writeDB(dbData);

    await sendDriverVerificationEmail(driver.fullName, driver.email, isApprove ? "approved" : "rejected", driver.rejectionReason);

    res.json({ message: `Driver ${isApprove ? "approved" : "rejected"}`, driver: { ...driver, password: undefined } });
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
