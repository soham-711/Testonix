import express from "express";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const router = express.Router();
const convex = new ConvexHttpClient(process.env.CONVEX_URL);

// ✅ Publish exam to selected rooms
router.post("/publishtoroom", async (req, res) => {
  try {
    const { examId, roomIds } = req.body;

    if (!examId || !Array.isArray(roomIds)) {
      return res.status(400).json({ error: "examId and roomIds required" });
    }

    const result = await convex.mutation(api.publishExamToRooms.publishExamToRooms, {
      examId,
      roomIds,
    });

    res.json({ success: true, result });
  } catch (err) {
    console.error("Error publishing exam:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
