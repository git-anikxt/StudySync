import ChatMessage from "../models/ChatMessage";

export const getRoomMessages =
  async (
    req: any,
    res: any
  ) => {
    try {
      const messages =
        await ChatMessage.find({
          roomId:
            req.params.roomId,
        })
          .sort({
            createdAt: 1,
          })
          .limit(100);

      res.json({
        success: true,
        messages,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
      });
    }
  };