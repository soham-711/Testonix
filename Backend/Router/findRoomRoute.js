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

// router.get("/members/:ownerUid", async (req, res) => {
//   try {
//     const { ownerUid } = req.params;
//     const members = await convex.query(api.roomMembers.getActiveMembersByOwnerUid, { ownerUid });
//     res.json({ members });
//     console.log(members);
    
//   } catch (err) {
//     console.error("Error fetching members:", err);
//     res.status(500).json({ error: err.message });
//   }
// });


router.get("/members/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;

    // Convex API call to fetch only joined members for that specific room
    const members = await convex.query(api.roomMembers.getJoinedMembersByRoomId, { roomId });

    res.json({ members });
    console.log("Members for room:", roomId, members);
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/allmembers/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;

    // Call the Convex query to get all members for this room
    const members = await convex.query(api.roomMembers.getAllMembersByRoomId, { roomId });

    res.json({ members });
  } catch (err) {
    console.error("Error fetching members by roomId:", err);
    res.status(500).json({ error: err.message });
  }
});



export default router;
