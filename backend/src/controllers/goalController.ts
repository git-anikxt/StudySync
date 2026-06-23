import { Request, Response } from "express";

import Goal from "../models/Goal";
import User from "../models/User";
import { awardBadge } from "../utils/badgeUtils";

export const createGoal = async (
  req: any,
  res: Response
) => {
  try {
    const goal = await Goal.create({
      userId: req.user.id,

      title: req.body.title,

      description:
        req.body.description,

      deadline:
        req.body.deadline,
    });

    res.status(201).json({
      success: true,
      goal,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

export const getGoals = async (
  req: any,
  res: Response
) => {
  try {
    const goals = await Goal.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      goals,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

export const updateGoal = async (
  req: any,
  res: Response
) => {
  try {
    const goal =
      await Goal.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json({
      success: true,
      goal,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

export const deleteGoal = async (
  req: Request,
  res: Response
) => {
  try {
    await Goal.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Goal deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

export const completeGoal = async (
  req: any,
  res: Response
) => {
  try {
    const goal = await Goal.findById(
      req.params.id
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    if (goal.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Already completed",
      });
    }

    goal.status = "completed";

    await goal.save();

    const user = await User.findById(
      req.user.id
    );

    if (user) {
      user.xp += 50;

      user.reputation += 10;

      user.level =
        Math.floor(user.xp / 100) + 1;

      if (
        user.reputation >= 100
      ) {
        awardBadge(
          user,
          "Study Champion"
        );
      }

      await user.save();
    }

    res.json({
      success: true,
      message: "Goal completed",
      xpEarned: 50,
      reputationEarned: 10,
      currentLevel:
        user?.level,
      badges:
        user?.badges,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};