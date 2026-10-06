import { Request, Response } from "express";
import {
  getAllClerkUsers,
  getStudySyncMetadata,
} from "../services/clerkProfile";

export const getLeaderboard = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await getAllClerkUsers();

    const leaderboard = users
      .map((user) => {
        const profile = getStudySyncMetadata(user);
        const score =
          profile.xp +
          profile.reputation * 2 +
          profile.streak * 5;
        const name =
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          user.username ||
          user.id;

        return {
          userId: user.id,
          name,
          xp: profile.xp,
          reputation: profile.reputation,
          level: profile.level,
          streak: profile.streak,
          badges: profile.badges,
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