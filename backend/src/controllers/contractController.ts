import { Response } from "express";

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