// convex/users.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveUser = mutation({
  args: {
    uid: v.string(),
    name: v.string(),
    email: v.string(),
    photoURL: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_uid", (q) => q.eq("uid", args.uid))
      .unique();

    if (!existing) {
      await ctx.db.insert("users", { ...args, createdAt: Date.now() });
    } else {
      await ctx.db.patch(existing._id, args);
    }
  },
});

export const getUserByUid = query({
  args: { uid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_uid", (q) => q.eq("uid", args.uid))
      .unique();
  },
});
