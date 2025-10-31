// backend/controllers/userController.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import dotenv from "dotenv";

dotenv.config();

export const convex = new ConvexHttpClient(process.env.CONVEX_URL);

// ✅ Create or update user
export const saveUser = async (req, res) => {
  try {
    const { uid, name, email, photoURL } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await convex.mutation(api.user.saveUser, {
      uid,
      name,
      email,
      photoURL,
    });

    res.status(200).json({ success: true, message: "User saved", result });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ success: false, error: "Failed to save user" });
  }
};

// ✅ Optional: Get user by UID
export const getUserByUid = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({ error: "UID is required" });
    }

    const result = await convex.query(api.users.getUserByUid, { uid });
    if (!result) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ success: true, user: result });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, error: "Failed to fetch user" });
  }
};
