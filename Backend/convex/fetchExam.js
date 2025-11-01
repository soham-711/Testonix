// convex/exams.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUserExams = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    try {
      // STEP 1: Fetch all rooms where user is a member
      const roomMembers = await ctx.db
        .query("roomMembers")
        .withIndex("by_uid", (q) => q.eq("uid", userId))
        .filter((q) => q.eq(q.field("joined"), true))
        .collect();

      console.log(`Found ${roomMembers.length} rooms for user ${userId}`);

      if (roomMembers.length === 0) {
        return {
          exams: [],
          message: "No rooms found for this user",
        };
      }

      const roomIds = roomMembers.map((member) => member.roomId);

      // STEP 2: Fetch all published exams for these rooms
      const publishedExams = await Promise.all(
        roomIds.map(async (roomId) => {
          return await ctx.db
            .query("publishedExams")
            .withIndex("by_roomId", (q) => q.eq("roomId", roomId))
            .collect();
        })
      );

      // Flatten the array of arrays
      const allPublishedExams = publishedExams.flat();
      
      console.log(`Found ${allPublishedExams.length} published exams across rooms`);

      if (allPublishedExams.length === 0) {
        return {
          exams: [],
          message: "No exams found in your rooms",
        };
      }

      // STEP 3: Fetch exam details, questions, and security settings for each exam
      const examsWithDetails = await Promise.all(
        allPublishedExams.map(async (publishedExam) => {
          try {
            // Get exam basic info
            const exam = await ctx.db.get(publishedExam.examId);
            if (!exam) {
              console.warn(`Exam ${publishedExam.examId} not found`);
              return null;
            }

            // Get room info
            const room = await ctx.db.get(publishedExam.roomId);
            
            // Get questions for this exam
            const questions = await ctx.db
              .query("questions")
              .withIndex("by_examId", (q) => q.eq("examId", publishedExam.examId))
              .order("asc")
              .collect();

            // Get security settings for this exam
            const securitySettings = await ctx.db
              .query("securitySettings")
              .withIndex("by_examId", (q) => q.eq("examId", publishedExam.examId))
              .first();

            return {
              exam: {
                _id: exam._id,
                examName: exam.examName,
                examSubtitle: exam.examSubtitle,
                startDate: exam.startDate,
                startTime: exam.startTime,
                endDate: exam.endDate,
                endTime: exam.endTime,
                totalTimeLimit: exam.totalTimeLimit,
                totalMarks: exam.totalMarks,
                published: exam.published,
                createdAt: exam.createdAt,
                updatedAt: exam.updatedAt,
              },
              room: room ? {
                _id: room._id,
                roomName: room.roomName,
                description: room.description,
              } : null,
              questions: questions.map(q => ({
                _id: q._id,
                question: q.question,
                type: q.type,
                options: q.options,
                multipleAnswers: q.multipleAnswers,
                marks: q.marks,
                correctAnswer: q.correctAnswer,
                image: q.image,
                video: q.video,
                timeLimit: q.timeLimit,
                order: q.order,
              })),
              securitySettings: securitySettings ? {
                preventMinimize: securitySettings.preventMinimize,
                preventBrowserSwitch: securitySettings.preventBrowserSwitch,
                enableCamera: securitySettings.enableCamera,
                preventCopyPaste: securitySettings.preventCopyPaste,
                fullScreenMode: securitySettings.fullScreenMode,
              } : null,
              publishedInfo: {
                publishedAt: publishedExam.publishedAt,
                roomId: publishedExam.roomId,
              }
            };
          } catch (error) {
            console.error(`Error fetching details for exam ${publishedExam.examId}:`, error);
            return null;
          }
        })
      );

      // Filter out any null values (exams that couldn't be fetched)
      const validExams = examsWithDetails.filter(exam => exam !== null);

      console.log(`Successfully fetched ${validExams.length} exams with details`);

      return {
        exams: validExams,
        count: validExams.length,
      };

    } catch (error) {
      console.error("Error in getUserExams:", error);
      throw new Error("Failed to fetch user exams");
    }
  },
});