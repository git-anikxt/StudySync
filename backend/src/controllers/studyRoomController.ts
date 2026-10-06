import StudyRoom from "../models/StudyRoom";
import {
  getClerkProfile,
  getClerkUsersById,
} from "../services/clerkProfile";

export const createRoom = async (
  req: any,
  res: any
) => {
  try {
    const room =
      await StudyRoom.create({
        name: req.body.name,
        subject: req.body.subject,

        createdBy: req.user.id,

        participants: [req.user.id],
      });

    res.status(201).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

export const getRooms = async (
  req: any,
  res: any
) => {
  try {
    const rooms = await StudyRoom.find().sort({
          createdAt: -1,
        });
    const users = await getClerkUsersById(
      rooms.map((room) => room.createdBy)
    );
    const profiles = new Map(
      users.map((user) => [user.id, getClerkProfile(user)])
    );

    res.json({
      success: true,
      rooms: rooms.map((room) => {
        const creator = profiles.get(room.createdBy);
        return {
          ...room.toObject(),
          createdBy: creator
            ? { _id: creator._id, name: creator.name }
            : null,
        };
      }),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

export const joinRoom = async (
  req: any,
  res: any
) => {
  try {
    const room =
      await StudyRoom.findById(
        req.params.id
      );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const alreadyJoined =
      room.participants.some(
        (participantId: any) =>
          participantId.toString() ===
          req.user.id
      );

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message:
          "Already joined",
      });
    }

    room.participants.push(
      req.user.id
    );

    await room.save();

    res.json({
      success: true,
      message:
        "Joined room successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

export const leaveRoom = async (
  req: any,
  res: any
) => {
  try {
    const room =
      await StudyRoom.findById(
        req.params.id
      );

    if (!room) {
      return res.status(404).json({
        success: false,
      });
    }

    room.participants =
      room.participants.filter(
        (id: any) =>
          id.toString() !==
          req.user.id
      );

    await room.save();

    res.json({
      success: true,
      message:
        "Left room successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

export const getRoomParticipants = async (
  req: any,
  res: any
) => {
  try {
    const room = await StudyRoom.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const users = await getClerkUsersById(room.participants);
    const profiles = new Map(
      users.map((user) => [user.id, getClerkProfile(user)])
    );

    res.json({
      success: true,
      room: {
        ...room.toObject(),
        participants: room.participants
          .map((id) => profiles.get(id))
          .filter((profile) => profile !== undefined)
          .map((profile) => ({
            _id: profile._id,
            name: profile.name,
            xp: profile.xp,
            reputation: profile.reputation,
          })),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};