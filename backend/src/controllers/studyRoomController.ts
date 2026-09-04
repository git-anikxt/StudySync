import StudyRoom from "../models/StudyRoom";

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
    const rooms =
      await StudyRoom.find()
        .populate(
          "createdBy",
          "name"
        )
        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,
      rooms,
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
    const room =
      await StudyRoom.findById(
        req.params.id
      ).populate(
        "participants",
        "name xp reputation"
      );

    res.json({
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