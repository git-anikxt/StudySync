import Session from "../models/Session";
import User from "../models/User";
import { awardBadge } from "../utils/badgeUtils";
export const startSession = async (
  req: any,
  res: any
) => {
  try {
    const session =
      await Session.create({
        userId: req.user.id,
        roomId: req.body.roomId,
        startTime: new Date(),
      });

    res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

export const endSession = async (
  req: any,
  res: any
) => {
  try {
    const session =
      await Session.findById(
        req.params.id
      );

    if (!session) {
      return res.status(404).json({
        success: false,
        message:
          "Session not found",
      });
    }

    session.endTime = new Date();

    session.duration = Math.floor(
      (session.endTime.getTime() -
        session.startTime.getTime()) /
        60000
    );

    await session.save();

    const user =
      await User.findById(
        session.userId
      );

    let earnedXP = 0;
    let earnedReputation = 0;

    if (user) {
      const today = new Date();

      const lastStudy =
        user.lastStudyDate
          ? new Date(
              user.lastStudyDate
            )
          : null;

      if (!lastStudy) {
        user.streak = 1;
      } else {
        const diffDays =
          Math.floor(
            (today.getTime() -
              lastStudy.getTime()) /
              (1000 *
                60 *
                60 *
                24)
          );

        if (diffDays === 1) {
          user.streak += 1;
        } else if (
          diffDays > 1
        ) {
          user.streak = 1;
        }
      }
      if (user.streak >= 7) {
  awardBadge(
    user,
    "7 Day Streak"
  );
}

if (user.streak >= 30) {
  awardBadge(
    user,
    "30 Day Consistency"
  );
}
      user.lastStudyDate =
        today;

      earnedXP = Math.max(
        10,
        Math.floor(
          session.duration / 10
        ) * 10
      );

      user.xp += earnedXP;

      user.level =
        Math.floor(
          user.xp / 100
        ) + 1;

      earnedReputation =
        Math.max(
          1,
          Math.floor(
            session.duration / 30
          )
        );

      user.reputation +=
        earnedReputation;

      await user.save();
    }

    res.json({
      success: true,

      duration:
        session.duration,

      earnedXP,

      earnedReputation,

      level:
        user?.level,

      streak:
        user?.streak,

      session,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};