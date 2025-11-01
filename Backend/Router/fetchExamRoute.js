import express from "express";
import { api } from "../convex/_generated/api.js";
import { ConvexHttpClient } from "convex/browser";
import dotenv from "dotenv";

dotenv.config();

export const convex = new ConvexHttpClient(process.env.CONVEX_URL);

const router = express.Router();

/**
 * GET /api/exams/fetch/:userId
 * Fetch all exams available for a specific user (based on their joined rooms)
 */
router.get("/fetch/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Call convex query
    const exams = await convex.query(api.fetchExam.getUserExams, { userId });

    if (!exams || exams.length === 0) {
      return res.status(404).json({ message: "No exams found for this user." });
    }

    res.json({ exams });
  } catch (err) {
    console.error("❌ Error fetching exams:", err);
    res.status(500).json({ error: err.message || "Server error while fetching exams." });
  }
});

export default router;
