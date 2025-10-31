import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import dotenv from "dotenv";
dotenv.config();

const convex = new ConvexHttpClient(process.env.CONVEX_URL);

// Publish Exam Controller
export const publishExam = async (req, res) => {
  try {
    const {
      ownerUid,
      examName,
      examSubtitle,
      startDate,
      startTime,
      endDate,
      endTime,
      totalTimeLimit,
      totalMarks,
      published,
      questions,
      securitySettings,
    } = req.body;

    const createdAt = Date.now();
    const updatedAt = Date.now();

    const result = await convex.mutation(api.cerateExam.createExam, {
      ownerUid,
      examName,
      examSubtitle,
      startDate,
      startTime,
      endDate,
      endTime,
      totalTimeLimit,
      totalMarks,
      published,
      createdAt,
      updatedAt,
      questions,
      securitySettings,
    });

    res.status(201).json({
      success: true,
      message: "Exam published successfully",
      examId: result.examId,
    });
  } catch (error) {
    console.error("Error publishing exam:", error);
    res.status(500).json({ success: false, message: "Failed to publish exam" });
  }
};
