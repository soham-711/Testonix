import express from "express";
import {
  createRoomController,
  getRoomByInviteCodeController,
  joinRoomController
} from "../Controller/createRoomController.js";

const router = express.Router();

router.post("/create", createRoomController);
router.get("/by-invite/:inviteCode", getRoomByInviteCodeController);
router.post("/join", joinRoomController);

export default router;
