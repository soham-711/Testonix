import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./Router/userRoutes.js"
import examRoutes from "./Router/examRoutes.js";
import createRoom from "./Router/createRoomRoutes.js";
import findRoom from "./Router/findRoomRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/users", userRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/rooms", createRoom);
app.use("/api/rooms", findRoom);
// health check
app.get("/health", (req, res) => {
  res.json({ status: "Testonix server is running ✅" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
