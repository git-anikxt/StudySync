import User from "../models/User";

export const getProfile = async (
  req: any,
  res: any
) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

export const updateProfile = async (
  req: any,
  res: any
) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.semester =
      req.body.semester ??
      user.semester;

    user.subjects =
      req.body.subjects ??
      user.subjects;

    user.availability =
      req.body.availability ??
      user.availability;

    user.bio =
      req.body.bio ??
      user.bio;

    user.avatar =
      req.body.avatar ??
      user.avatar;

    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};