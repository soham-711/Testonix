import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  // =========================
  // USERS TABLE
  // =========================
  users: defineTable({
    uid: v.string(),
    name: v.string(),
    email: v.string(),
    photoURL: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_uid", ["uid"]),

  // =========================
  // EXAMS TABLE
  // =========================
  exams: defineTable({
    ownerUid: v.string(),
    examName: v.string(),
    examSubtitle: v.string(),
    startDate: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endDate: v.optional(v.string()),
    endTime: v.optional(v.string()),
    totalTimeLimit: v.number(),
    totalMarks: v.optional(v.number()),
    published: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_ownerUid", ["ownerUid"]),

  // =========================
  // QUESTIONS TABLE
  // =========================
  questions: defineTable({
    examId: v.id("exams"),
    question: v.string(),
    type: v.union(v.literal("SAQ"), v.literal("MCQ")),
    options: v.array(v.string()),
    multipleAnswers: v.boolean(),
    marks: v.number(),
    correctAnswer: v.string(),
    image: v.optional(v.string()),
    video: v.optional(v.string()),
    timeLimit: v.optional(v.number()),
    order: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_examId", ["examId"]),

  // =========================
  // SECURITY SETTINGS TABLE
  // =========================
  securitySettings: defineTable({
    examId: v.id("exams"),
    preventMinimize: v.boolean(),
    preventBrowserSwitch: v.boolean(),
    enableCamera: v.boolean(),
    preventCopyPaste: v.boolean(),
    fullScreenMode: v.boolean(),
  }).index("by_examId", ["examId"]),

  // =========================
  // ROOMS TABLE
  // =========================
  rooms: defineTable({
  ownerUid: v.string(),
  roomName: v.string(),
  description: v.optional(v.string()),
  inviteCode: v.string(),

  // These define what custom fields the members must fill out
  customFields: v.optional(v.array(v.string())), // e.g. ["studentId", "regNo"]

  createdAt: v.number(),
}).index("by_ownerUid", ["ownerUid"])
  .index("by_inviteCode", ["inviteCode"]),


// =========================
// ROOM MEMBERS TABLE
// =========================

roomMembers: defineTable({
  roomId: v.id("rooms"), // reference to the room
  uid: v.optional(v.string()), // set when joined
  name: v.optional(v.string()),
  email: v.string(),
  joined: v.boolean(),
  joinedAt: v.optional(v.float64()), // ✅ optional fixed
  customData: v.optional(v.record(v.string(), v.string())), 
  marks: v.optional(v.record(v.string(), v.number())),
})
.index("by_roomId", ["roomId"])
.index("by_email", ["email"]),




  // =========================
  // PUBLISHED EXAMS
  // =========================
  publishedExams: defineTable({
    examId: v.id("exams"),
    roomId: v.id("rooms"),
    publishedAt: v.number(),
  }).index("by_roomId", ["roomId"]),

  // =========================
  // STUDENT SUBMISSIONS
  // =========================
  submissions: defineTable({
    examId: v.id("exams"),
    studentUid: v.string(),
    answers: v.array(
      v.object({
        questionId: v.id("questions"),
        answer: v.string(),
      })
    ),
    score: v.optional(v.number()),
    submittedAt: v.number(),
  })
    .index("by_examId", ["examId"])
    .index("by_studentUid", ["studentUid"]),
});
