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
    const user =
      await User.findByIdAndUpdate(
        req.user.id,
        req.body,
        {
          new: true,
        }
      );

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