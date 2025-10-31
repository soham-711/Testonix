import express from "express";
import { publishExam } from "../Controller/examController.js";

const router = express.Router();

// Publish Exam
router.post("/publish", publishExam);

export default router;
