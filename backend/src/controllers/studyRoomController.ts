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