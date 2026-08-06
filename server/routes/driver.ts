import express from "express";
import jwt from "jsonwebtoken";
import { and, eq, desc, sum, sql } from "drizzle-orm";
import { db } from "../db";
import { users, drivers, bookings } from "../../drizzle/schema";

const driverRouter = express.Router();

// Middleware to authenticate driver
const authenticateDriver = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    let driverId = decoded.id;

    const results = await db.select().from(drivers).where(eq(drivers.id, Number(driverId))).limit(1);
    const driver = results[0];

    if (!driver) {
      const userResults = await db.select().from(users).where(eq(users.id, Number(driverId))).limit(1);
      if (userResults[0] && (decoded.role === "driver" || userResults[0].role === "driver")) {
        return res.status(403).json({ message: "Driver profile not found in drivers table" });
      }
      return res.status(401).json({ message: "Driver not found" });
    }

    (req as any).driver = driver;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

driverRouter.use(authenticateDriver);

// Profile & Vehicle Details
driverRouter.get("/profile", async (req, res) => {
  const driver = (req as any).driver;
  const { password, ...driverData } = driver;
  res.json({ driver: driverData });
});

// Driver Status
driverRouter.get("/status", async (req, res) => {
  const driver = (req as any).driver;
  res.json({ status: driver.status });
});

// Availability Toggle
driverRouter.post("/toggle-status", async (req, res) => {
  const driver = (req as any).driver;
  const { status } = req.body;

  if (status === "online" && (!driver.isVerified || driver.verificationStatus !== "approved")) {
    return res.status(403).json({ message: "Unverified drivers cannot go online." });
  }

  await db.update(drivers)
    .set({ status })
    .where(eq(drivers.id, driver.id));

  res.json({ message: "Status updated", status });
});

// Ride Requests
driverRouter.get("/requests", async (req, res) => {
  const driver = (req as any).driver;

  if (!driver.isVerified || driver.verificationStatus !== "approved") {
    return res.status(403).json({ message: "Unverified drivers cannot receive ride requests.", requests: [] });
  }

  const pendingBookings = await db.select().from(bookings).where(eq(bookings.status, "pending"));
  console.log("Pending Bookings:", pendingBookings);
  const requests = pendingBookings.map((b) => ({
    id: b.id.toString(),
    userId: b.userId?.toString(),
    source: b.pickupLocation || b.pickup,
    destination: b.dropLocation || b.drop,
    fare: parseFloat(b.estimatedFare?.replace(/[^\d.]/g, "") || b.fare || "0"),
    status: b.status,
    createdAt: b.createdAt,
  }));
  console.log("Requests Response:", requests);
  res.json({ requests });
});

// Accept Ride
driverRouter.post("/accept-ride", async (req, res) => {
  const driver = (req as any).driver;
  const { rideId } = req.body;

  if (!driver.isVerified || driver.verificationStatus !== "approved") {
    return res.status(403).json({ message: "Unverified drivers cannot accept rides." });
  }

  const result = await db.update(bookings)
    .set({ status: "accepted", driverId: driver.id })
    .where(eq(bookings.id, Number(rideId)))
    .returning();

  if (result.length === 0) {
    return res.status(404).json({ message: "Ride not found or already accepted" });
  }

  res.json({ message: "Ride accepted" });
});
driverRouter.patch("/rides/:id", async (req, res) => {
  const driver = (req as any).driver;
  const rideId = Number(req.params.id);
  const { status } = req.body;

  const updateData: any = { status };

  if (status === "started") {
    updateData.startedAt = new Date();
  }

  if (status === "completed") {
    updateData.completedAt = new Date();
  }

  const result = await db
    .update(bookings)
    .set(updateData)
    .where(
      and(
        eq(bookings.id, rideId),
        eq(bookings.driverId, driver.id)
      )
    )
    .returning();

  if (result.length === 0) {
    return res.status(404).json({ message: "Ride not found" });
  }

  res.json({
    message: "Ride status updated",
    ride: result[0],
  });
});

// Reject Ride
driverRouter.post("/reject-ride", async (req, res) => {
  const driver = (req as any).driver;
  const { rideId } = req.body;

  res.json({ message: "Ride rejected" });
});

// Current Ride
driverRouter.get("/current-ride", async (req, res) => {
  console.log("=== CURRENT RIDE API ===");

  const driver = (req as any).driver;

  console.log("Driver:", driver.id);

  const currentRides = await db
    .select()
    .from(bookings)
    .where(eq(bookings.driverId, driver.id))
    .where(eq(bookings.status, "accepted"));

  console.log("Accepted:", currentRides);

  const startedRides = await db
    .select()
    .from(bookings)
    .where(eq(bookings.driverId, driver.id))
    .where(eq(bookings.status, "started"));

  console.log("Started:", startedRides);

  if (currentRides.length > 0) {
    console.log("Returning accepted");
    return res.json({ ride: currentRides[0] });
  }

  if (startedRides.length > 0) {
    console.log("Returning started");
    return res.json({ ride: startedRides[0] });
  }

  console.log("Returning null");
  return res.json({ ride: null });
});

// Ride History
driverRouter.get("/rides", async (req, res) => {
  const driver = (req as any).driver;

  const completedRides = await db.select()
    .from(bookings)
    .where(eq(bookings.driverId, driver.id))
    .where(eq(bookings.status, "completed"))
    .orderBy(desc(bookings.createdAt));

  res.json({ rides: completedRides });
});

// Earnings
driverRouter.get("/earnings", async (req, res) => {
  const driver = (req as any).driver;

  const rides = await db.select()
    .from(bookings)
    .where(eq(bookings.driverId, driver.id))
    .where(eq(bookings.status, "completed"));

  let totalEarnings = 0;
  rides.forEach(r => {
    const fare = parseFloat(r.actualFare?.replace(/[^\d.]/g, "") || r.estimatedFare?.replace(/[^\d.]/g, "") || r.fare || "0");
    totalEarnings += fare;
  });

  const dailyEarnings = rides.reduce((acc, r) => {
    const date = new Date(r.completedAt || r.createdAt).toLocaleDateString();
    const fare = parseFloat(r.actualFare?.replace(/[^\d.]/g, "") || r.estimatedFare?.replace(/[^\d.]/g, "") || r.fare || "0");
    acc[date] = (acc[date] || 0) + fare;
    return acc;
  }, {} as Record<string, number>);

  res.json({ totalEarnings, dailyEarnings });
});

// Wallet
driverRouter.get("/wallet", async (req, res) => {
  const driver = (req as any).driver;

  const rides = await db.select()
    .from(bookings)
    .where(eq(bookings.driverId, driver.id))
    .where(eq(bookings.status, "completed"));

  let balance = 0;
  rides.forEach(r => {
    const fare = parseFloat(r.actualFare?.replace(/[^\d.]/g, "") || r.estimatedFare?.replace(/[^\d.]/g, "") || r.fare || "0");
    balance += fare;
  });

  res.json({ balance, currency: "CAD" });
});

// Notifications
driverRouter.get("/notifications", async (req, res) => {
  const driver = (req as any).driver;
  res.json({
    notifications: [
      { id: 1, title: "Welcome to GeoRides!", message: "Your driver account is active.", read: false, createdAt: driver.createdAt }
    ]
  });
});

// Ride Progress Status update 
driverRouter.patch("/rides/:id", async (req, res) => {
  const driver = (req as any).driver;
  const { status } = req.body;
  const rideId = req.params.id;

  const result = await db.update(bookings)
    .set({ status })
    .where(eq(bookings.id, Number(rideId)))
    .where(eq(bookings.driverId, driver.id))
    .returning();

  if (result.length === 0) {
    return res.status(404).json({ message: "Ride not found" });
  }

  res.json({ message: "Ride status updated", ride: result[0] });
});

export default driverRouter;
