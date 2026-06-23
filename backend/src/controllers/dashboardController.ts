import Goal from "../models/Goal";
import User from "../models/User";
import Session from "../models/Session";
import AccountabilityContract from "../models/AccountabilityContract";

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
    const contracts =
      await AccountabilityContract.find({
        creatorId: req.user.id,
      });

    const activeContracts =
      contracts.filter(
        (contract) =>
          contract.status === "active"
      ).length;

    const completedContracts =
      contracts.filter(
        (contract) =>
          contract.status ===
          "completed"
      ).length;

    const missedContracts =
      contracts.filter(
        (contract) =>
          contract.status ===
          "missed"
      ).length;
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
    const sessions = await Session.find({
      userId: req.user.id,
    });

    const totalMinutes =
      sessions.reduce(
        (sum, session) =>
          sum + session.duration,
        0
      );

    const totalHours = Number(
      (totalMinutes / 60).toFixed(1)
    );
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
        studyHours: totalHours,
        badges: user?.badges,
        accountabilityScore:
          user?.accountabilityScore,
        activeContracts,
        completedContracts,
        missedContracts,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

