// convex/publishExamToRooms.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ✅ Publish an exam to one or more rooms
export const publishExamToRooms = mutation({
  args: {
    examId: v.id("exams"),
    roomIds: v.array(v.id("rooms")),
  },
  handler: async (ctx, { examId, roomIds }) => {
    const exam = await ctx.db.get(examId);
    if (!exam) throw new Error("Exam not found");

    const results = [];
    for (const roomId of roomIds) {
      const room = await ctx.db.get(roomId);
      if (!room) {
        results.push({ roomId, ok: false, reason: "Room not found" });
        continue;
      }

      // Check if already published
      const alreadyPublished = await ctx.db
        .query("publishedExams")
        .withIndex("by_roomId", (q) => q.eq("roomId", roomId))
        .filter((q) => q.eq(q.field("examId"), examId))
        .first();

      if (alreadyPublished) {
        results.push({ roomId, ok: false, reason: "Already published" });
        continue;
      }

      // Insert new published exam entry
      await ctx.db.insert("publishedExams", {
        examId,
        roomId,
        publishedAt: Date.now(),
      });

      results.push({ roomId, ok: true });
    }

    // Mark exam as published (optional)
    await ctx.db.patch(examId, { published: true });

    return { examId, results };
  },
});

// ✅ Get all rooms owned by a user
export const getRoomsByOwnerUid = query({
  args: { ownerUid: v.string() },
  handler: async (ctx, { ownerUid }) => {
    return await ctx.db
      .query("rooms")
      .withIndex("by_ownerUid", (q) => q.eq("ownerUid", ownerUid))
      .collect();
  },
});

// ✅ Get all published exams for a specific room
export const getPublishedExamsByRoomId = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const published = await ctx.db
      .query("publishedExams")
      .withIndex("by_roomId", (q) => q.eq("roomId", roomId))
      .collect();

    const results = [];
    for (const p of published) {
      const exam = await ctx.db.get(p.examId);
      if (exam) results.push({ ...p, exam });
    }
    return results;
  },
});
