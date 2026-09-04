import { Response, NextFunction } from "express";
import { clerkClient, getAuth } from "@clerk/express";

import User from "../models/User";

export const protect = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = getAuth(req);
    const clerkUserId = auth.userId;

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    let user = await User.findOne({
      clerkId: clerkUserId,
    });

    if (!user) {
      // First time this Clerk user hits the API — provision a
      // StudySync user so every controller can rely on req.user.id.
      const clerkUser = await clerkClient.users.getUser(clerkUserId);

      const email =
        clerkUser.primaryEmailAddress?.emailAddress ??
        clerkUser.emailAddresses[0]?.emailAddress ??
        "";

      const fullName = [clerkUser.firstName, clerkUser.lastName]
        .filter(Boolean)
        .join(" ");

      const name = fullName || email.split("@")[0] || clerkUserId;

      user = await User.findOneAndUpdate(
        { clerkId: clerkUserId },
        {
          $setOnInsert: {
            name,
            email,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );
    }

    req.user = {
      id: user!._id.toString(),
    };

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};
