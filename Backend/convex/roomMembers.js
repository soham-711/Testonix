import { query } from "./_generated/server";
import { v } from "convex/values";

export const getMembersByOwnerUid = query({
  args: { ownerUid: v.string() },
  handler: async (ctx, { ownerUid }) => {
    // Step 1: Get all rooms owned by this user
    const rooms = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("ownerUid"), ownerUid))
      .collect();

    if (rooms.length === 0) return [];

    // Step 2: Fetch members for each room
    const allMembers = [];
    for (const room of rooms) {
      const members = await ctx.db
        .query("roomMembers")
        .withIndex("by_roomId", (q) => q.eq("roomId", room._id))
        .collect();

      // Attach readable room info
      for (const member of members) {
        allMembers.push({
          roomId: room._id,
          roomName: room.name,
          ownerUid: room.ownerUid,
          ...member,
        });
      }
    }
    return allMembers;
  },
});



// export const getActiveMembersByOwnerUid = query({
//   args: { ownerUid: v.string() },
//   handler: async (ctx, { ownerUid }) => {
//     // Step 1: Get all rooms created by this owner
//     const rooms = await ctx.db
//       .query("rooms")
//       .filter((q) => q.eq(q.field("ownerUid"), ownerUid))
//       .collect();

//     if (rooms.length === 0) return [];

//     // Step 2: Collect joined members only
//     const joinedMembers = [];

//     for (const room of rooms) {
//       const members = await ctx.db
//         .query("roomMembers")
//         .withIndex("by_roomId", (q) => q.eq("roomId", room._id))
//         .filter((q) => q.eq(q.field("joined"), true)) // ✅ Only joined
//         .collect();

//       // Add room info to each member
//       for (const member of members) {
//         joinedMembers.push({
//           roomId: room._id,
//           roomName: room.name,
//           ownerUid: room.ownerUid,
//           ...member,
//         });
//       }
//     }

//     return joinedMembers;
//   },
// });


export const getJoinedMembersByRoomId = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const room = await ctx.db.get(roomId);
    if (!room) throw new Error("Room not found");

    // Fetch members whose "joined" is true for this room only
    const joinedMembers = await ctx.db
      .query("roomMembers")
      .withIndex("by_roomId", (q) => q.eq("roomId", roomId))
      .filter((q) => q.eq(q.field("joined"), true))
      .collect();

    return joinedMembers.map((member) => ({
      ...member,
      roomId: room._id,
      roomName: room.roomName || room.name,
    }));
  },
});


export const getAllMembersByRoomId = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    // 1️⃣ Verify that the room exists
    const room = await ctx.db.get(roomId);
    if (!room) throw new Error("Room not found");

    // 2️⃣ Fetch *all* members for this room (joined or not)
    const allMembers = await ctx.db
      .query("roomMembers")
      .withIndex("by_roomId", (q) => q.eq("roomId", roomId))
      .collect();

    // 3️⃣ Return enriched data with room info
    return allMembers.map((member) => ({
      ...member,
      roomId: room._id,
      roomName: room.roomName || room.name,
      ownerUid: room.ownerUid,
    }));
  },
});