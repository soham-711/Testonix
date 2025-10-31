import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import dotenv from "dotenv";
dotenv.config();

const convex = new ConvexHttpClient(process.env.CONVEX_URL);

export const createRoomController = async (req, res) => {
  try {
    const { ownerUid, roomName, description, inviteEmails = [], customFields = [] } = req.body;
    const result = await convex.mutation(api.createRoom.createRoom, {
      ownerUid,
      roomName,
      description,
      inviteEmails,
      customFields
    });
    // build invite link(s)
    const inviteLink = `${process.env.FRONTEND_URL}/join-room/${result.inviteCode}`;
    // optionally send email invites here via your mailer
    res.status(201).json({ roomId: result.roomId, inviteCode: result.inviteCode, inviteLink });
  } catch (err) {
    console.error("Error creating room", err);
    res.status(500).json({ error: err.message });
  }
};

export const getRoomByInviteCodeController = async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const room = await convex.query(api.createRoom.getRoomByInviteCode, { inviteCode });
    if (!room) return res.status(404).json({ error: "Room not found." });
    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const joinRoomController = async (req, res) => {
  try {
    const { inviteCode, uid, name, email, customData } = req.body;
    // find room by invite code
    const room = await convex.query(api.createRoom.getRoomByInviteCode, { inviteCode });
    if (!room) return res.status(404).json({ error: "Invalid invite." });

    const result = await convex.mutation(api.createRoom.joinRoom, {
      roomId: room._id,
      email,
      uid,
      name,
      customData: customData || {}
    });

    res.json({ success: true, joined: result.joined });
  } catch (err) {
    console.error("join error", err);
    res.status(500).json({ error: err.message });
  }
};
