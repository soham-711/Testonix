import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createExam = mutation({
  args: {
    examName: v.string(),
    examSubtitle: v.string(),
    startDate: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endDate: v.optional(v.string()),
    endTime: v.optional(v.string()),
    gformlink: v.optional(v.string()),
    totalTimeLimit: v.float64(),
    totalMarks: v.optional(v.float64()),
    published: v.boolean(),
    ownerUid: v.string(),
    createdAt: v.float64(),
    updatedAt: v.float64(),
    questions: v.array(
      v.object({
        question: v.string(),
        type: v.union(v.literal("SAQ"), v.literal("MCQ")),
        options: v.array(v.string()),
        multipleAnswers: v.boolean(),
        marks: v.float64(),
        correctAnswer: v.string(),
        image: v.optional(v.string()),
        video: v.optional(v.string()),
        timeLimit: v.optional(v.float64()),
        order: v.optional(v.float64()),
        createdAt: v.float64(),
        updatedAt: v.float64(),
      })
    ),
    securitySettings: v.object({
      preventMinimize: v.boolean(),
      preventBrowserSwitch: v.boolean(),
      enableCamera: v.boolean(),
      preventCopyPaste: v.boolean(),
      fullScreenMode: v.boolean(),
    }),
  },

  handler: async (ctx, args) => {
    const examId = await ctx.db.insert("exams", {
      ownerUid: args.ownerUid,
      examName: args.examName,
      examSubtitle: args.examSubtitle,
      startDate: args.startDate,
      startTime: args.startTime,
      endDate: args.endDate,
      endTime: args.endTime,
      totalTimeLimit: args.totalTimeLimit,
      totalMarks: args.totalMarks,
      published: args.published,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
    });

    await ctx.db.insert("securitySettings", {
      examId,
      ...args.securitySettings,
    });

    for (const q of args.questions) {
      await ctx.db.insert("questions", {
        examId,
        ...q,
        createdAt: q.createdAt || Date.now(),
        updatedAt: q.updatedAt || Date.now(),
      });
    }

    return { examId };
  },
});


