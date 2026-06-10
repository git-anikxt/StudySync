import Goal from "../models/Goal";
import User from "../models/User";

export const getDashboard = async (
  req: any,
  res: any
) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    const goals = await Goal.find({
      userId: req.user.id,
    });

    const completedGoals =
      goals.filter(
        (goal) =>
          goal.status === "completed"
      ).length;

    const activeGoals =
      goals.filter(
        (goal) =>
          goal.status !== "completed"
      ).length;

    res.json({
      success: true,

      stats: {
        xp: user?.xp,
        level: user?.level,
        reputation: user?.reputation,
        streak: user?.streak,

        totalGoals:
          goals.length,

        completedGoals,

        activeGoals,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};