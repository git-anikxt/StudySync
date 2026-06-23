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
    );

    const leaderboard = users
      .map((user) => {
        const score =
          user.xp +
          user.reputation * 2 +
          user.streak * 5;

        return {
          name: user.name,
          xp: user.xp,
          reputation:
            user.reputation,
          level: user.level,
          streak: user.streak,
          badges:
            user.badges,
          score,
        };
      })
      .sort(
        (a, b) =>
          b.score - a.score
      )
      .slice(0, 20)
      .map((user, index) => ({
        rank: index + 1,
        ...user,
      }));

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