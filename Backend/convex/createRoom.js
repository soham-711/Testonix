// convex/rooms.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createRoom = mutation({
  args: {
    ownerUid: v.string(),
    roomName: v.string(),
    description: v.optional(v.string()),
    inviteEmails: v.array(v.string()), // initial invites
    customFields: v.optional(v.array(v.string())), // e.g. ["studentId", "regNo"]
  },
  handler: async (ctx, args) => {
    const inviteCode = crypto.randomUUID().slice(0, 8); // short code
    const createdAt = Date.now();

    const roomId = await ctx.db.insert("rooms", {
      ownerUid: args.ownerUid,
      roomName: args.roomName,
      description: args.description || "",
      inviteCode,
      customFields: args.customFields || [],
      createdAt,
    });

    // insert a roomMembers entry for every invited email (joined: false)
    for (const email of args.inviteEmails) {
      await ctx.db.insert("roomMembers", {
        roomId,
        uid: "",
        name: "",
        email,
        joined: false,
        joinedAt: Date.now(),
        customData: {},
        marks: {},
      });
    }

    return { roomId, inviteCode };
  },
});

export const getRoomByInviteCode = query({
  args: { inviteCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rooms")
      .withIndex("by_inviteCode", (q) => q.eq("inviteCode", args.inviteCode))
      .unique();
  },
});


export const getRoomMembers = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("roomMembers")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .collect();
  },
});


export const joinRoom = mutation({
  args: {
    roomId: v.id("rooms"),
    email: v.string(),     // the invited email (used to find the placeholder entry)
    uid: v.string(),       // firebase uid (or your user id)
    name: v.string(),
    customData: v.record(v.string(), v.string()), // filled custom fields
  },
  handler: async (ctx, args) => {
    // find the roomMember by roomId & email
    const member = await ctx.db
      .query("roomMembers")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .filter((q) => q.eq(q.field("email"), args.email))
      .unique();

    if (!member) {
      // if no placeholder, create one (invited not required)
      await ctx.db.insert("roomMembers", {
        roomId: args.roomId,
        uid: args.uid,
        name: args.name,
        email: args.email,
        joined: true,
        joinedAt: Date.now(),
        customData: args.customData,
        marks: {},
      });
      // notify owner
      await ctx.db.insert("notifications", {
        userUid: (await ctx.db.get(args.roomId)).ownerUid,
        type: "ROOM_JOIN",
        message: `${args.name} joined ${args.roomId}`,
        createdAt: Date.now(),
        read: false,
      });
      return { joined: true };
    }

    // patch the existing member entry
    await ctx.db.patch(member._id, {
      uid: args.uid,
      name: args.name,
      joined: true,
      joinedAt: Date.now(),
      customData: args.customData,
    });

    // notify owner
    const room = await ctx.db.get(args.roomId);
    await ctx.db.insert("notifications", {
      userUid: room.ownerUid,
      type: "ROOM_JOIN",
      message: `${args.name} (${args.email}) joined ${room.roomName}`,
      createdAt: Date.now(),
      read: false,
      meta: { roomId: String(args.roomId), memberEmail: args.email },
    });

    return { joined: true };
  },
});


export const updateMemberMarks = mutation({
  args: {
    roomMemberId: v.id("roomMembers"),
    examId: v.string(),
    marks: v.number(),
    totalMarks: v.number(),
  },
  handler: async (ctx, args) => {
    const member = await ctx.db.get(args.roomMemberId);
    const existingMarks = member.marks || {};
    existingMarks[args.examId] = args.marks;
    await ctx.db.patch(args.roomMemberId, { marks: existingMarks });
    // Optionally insert a notification to owner
  },
});



export const getRoomsByOwner = query({
  args: { ownerUid: v.string() },
  handler: async (ctx, { ownerUid }) => {
    // Fetch all rooms that match the owner's UID
    const rooms = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("ownerUid"), ownerUid))
      .collect();

    return rooms;
  },
});