import { Request, Response } from "express";
import User from "../models/User";

export const getLeaderboard = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await User.find(
      {},
      {
        password: 0,
      }
    )
      .sort({
        reputation: -1,
        xp: -1,
      })
      .limit(20);

    const leaderboard = users.map(
      (user, index) => ({
        rank: index + 1,
        name: user.name,
        xp: user.xp,
        reputation: user.reputation,
        level: user.level,
        streak: user.streak,
      })
    );

    res.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch leaderboard",
    });
  }
};