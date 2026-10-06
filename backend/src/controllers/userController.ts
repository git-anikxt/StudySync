import { getClerkUserProfile, updateStudySyncProfile } from "../services/clerkProfile";

export const getProfile = async (
  req: any,
  res: any
) => {
  try {
    const user = await getClerkUserProfile(req.user.id);

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
    const user = await updateStudySyncProfile(req.user.id, (profile) => {
      profile.semester = req.body.semester ?? profile.semester;
      profile.subjects = req.body.subjects ?? profile.subjects;
      profile.availability = req.body.availability ?? profile.availability;
      profile.bio = req.body.bio ?? profile.bio;
      profile.avatar = req.body.avatar ?? profile.avatar;
    });

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