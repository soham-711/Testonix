// backend/routes/userRoutes.ts
import express from "express";
import { saveUser, getUserByUid } from "../Controller/userController.js";

const router = express.Router();

// Save user (Google sign-in)
router.post("/createuser", saveUser);

// Get user by uid
router.get("/fetchuserdata", getUserByUid);

export default router;
