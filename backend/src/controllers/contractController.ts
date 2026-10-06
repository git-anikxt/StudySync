import { Response } from "express";
import Goal from "../models/Goal";
import AccountabilityContract from "../models/AccountabilityContract";
import { awardBadge } from "../utils/badgeUtils";
import { updateStudySyncProfile } from "../services/clerkProfile";

export const createContract = async (
  req: any,
  res: Response
) => {
  try {
    const {
      title,
      goalId,
      deadline,
      rewardXp,
      penaltyReputation,
    } = req.body;

    const goal = await Goal.findOne({
      _id: goalId,
      userId: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    const contract =
      await AccountabilityContract.create({
        creatorId: req.user.id,
        title,
        goalId,
        deadline,
        rewardXp:
          rewardXp ?? 100,
        penaltyReputation:
          penaltyReputation ?? 20,
      });

    res.status(201).json({
      success: true,
      contract,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to create contract",
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
      }).populate(
        "goalId",
        "title status"
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
    const contract = await AccountabilityContract.findOne({
      _id: req.params.id,
      creatorId: req.user.id,
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message:
          "Contract not found",
      });
    }

    if (
      contract.status !==
      "active"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Contract already processed",
      });
    }

    contract.status =
      "completed";

    await contract.save();

    await updateStudySyncProfile(req.user.id, (profile) => {
      profile.xp += contract.rewardXp;
      profile.reputation += 25;
      profile.accountabilityScore += 10;
      profile.level = Math.floor(profile.xp / 100) + 1;

      if (profile.reputation >= 100) {
        awardBadge(profile, "Study Champion");
      }

      if (profile.accountabilityScore >= 100) {
        awardBadge(profile, "Accountability Master");
      }
    });

    res.json({
      success: true,
      message:
        "Commitment completed",
      xpEarned:
        contract.rewardXp,
      reputationEarned: 25,
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
    const contract = await AccountabilityContract.findOne({
      _id: req.params.id,
      creatorId: req.user.id,
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message:
          "Contract not found",
      });
    }

    if (
      contract.status !==
      "active"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Contract already processed",
      });
    }

    contract.status =
      "missed";

    await contract.save();

    await updateStudySyncProfile(req.user.id, (profile) => {
      profile.reputation = Math.max(
        0,
        profile.reputation - contract.penaltyReputation
      );
      profile.accountabilityScore = Math.max(
        0,
        profile.accountabilityScore - 10
      );
    });

    res.json({
      success: true,
      message:
        "Commitment missed",
      reputationLost:
        contract.penaltyReputation,
      accountabilityLost: 10,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};