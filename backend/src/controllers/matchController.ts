import User from "../models/User";

export const findMatches = async (
  req: any,
  res: any
) => {
  try {
    const currentUser =
      await User.findById(
        req.user.id
      );

    if (!currentUser) {
      return res.status(404).json({
        success: false,
      });
    }

    const matches =
      await User.find({
        _id: {
          $ne: currentUser._id,
        },

        semester:
          currentUser.semester,

        availability:
          currentUser.availability,

        subjects: {
          $in:
            currentUser.subjects,
        },
      })
        .select(
          "name semester subjects availability reputation xp"
        )
        .limit(10);

    res.json({
      success: true,
      matches,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};