import { Response } from "express";
import User from "../models/User";
import Goal from "../models/Goal";
import { awardBadge } from "../utils/badgeUtils";
import AccountabilityContract from "../models/AccountabilityContract";

export const createContract = async (
  req: any,
  res: Response
) => {
  try {
    const {
      witnessId,
      goalId,
      deadline,
    } = req.body;

    const contract =
      await AccountabilityContract.create({
        creatorId: req.user.id,

        witnessId,

        goalId,

        deadline,
      });

    res.status(201).json({
      success: true,
      contract,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

export const missContract = async (
  req: any,
  res: Response
) => {
  try {
    const contract =
      await AccountabilityContract.findById(
        req.params.id
      );

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    if (contract.status !== "active") {
      return res.status(400).json({
        success: false,
        message:
          "Contract already processed",
      });
    }

    contract.status = "missed";

    await contract.save();

    const user = await User.findById(
      req.user.id
    );

    if (user) {
      user.reputation = Math.max(
        0,
        user.reputation - 15
      );

      user.accountabilityScore =
        Math.max(
          0,
          user.accountabilityScore - 10
        );

      await user.save();
    }

    res.json({
      success: true,
      message: "Contract missed",
      reputationLost: 15,
      accountabilityLost: 10,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

export const getContracts = async (
  req: any,
  res: Response
) => {
  try {
    const contracts =
      await AccountabilityContract.find({
        creatorId: req.user.id,
      })
        .populate(
          "goalId",
          "title status"
        )
        .populate(
          "witnessId",
          "name email"
        );

    res.json({
      success: true,
      contracts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

export const completeContract = async (
  req: any,
  res: Response
) => {
  try {
    const contract =
      await AccountabilityContract.findById(
        req.params.id
      );

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    if (contract.status !== "active") {
      return res.status(400).json({
        success: false,
        message:
          "Contract already processed",
      });
    }

    contract.status = "completed";

    await contract.save();

    const user = await User.findById(
      req.user.id
    );

    if (user) {
  user.xp += 100;

  user.reputation += 25;

  user.level =
    Math.floor(user.xp / 100) + 1;

  if (user.reputation >= 100) {
    awardBadge(
      user,
      "Study Champion"
    );
  }

  if (
    user.accountabilityScore >=
    100
  ) {
    awardBadge(
      user,
      "Accountability Master"
    );
  }

  await user.save();
}

    res.json({
      success: true,
      message:
        "Contract completed successfully",
      xpEarned: 100,
      reputationEarned: 25,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};