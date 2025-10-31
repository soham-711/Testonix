// backend/routes/roomRoutes.js
import express from "express";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const convex = new ConvexHttpClient(process.env.CONVEX_URL);

// ✅ Route: Get rooms by owner UID
router.get("/owner/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const rooms = await convex.query(api.createRoom.getRoomsByOwner, { ownerUid: uid });
    res.json({ rooms });
    console.log(rooms);
    
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
