import {
  getAllClerkUsers,
  getClerkProfile,
  getClerkUserProfile,
} from "../services/clerkProfile";

export const findMatches = async (
  req: any,
  res: any
) => {
  try {
    const currentUser = await getClerkUserProfile(req.user.id);
    const users = await getAllClerkUsers();
    const matches = users
      .filter((user) => user.id !== currentUser._id)
      .map(getClerkProfile)
      .filter(
        (user) =>
          user.semester === currentUser.semester &&
          user.availability === currentUser.availability &&
          user.subjects.some((subject) =>
            currentUser.subjects.includes(subject)
          )
      )
      .slice(0, 10)
      .map((user) => ({
        _id: user._id,
        name: user.name,
        semester: user.semester,
        subjects: user.subjects,
        availability: user.availability,
        reputation: user.reputation,
        xp: user.xp,
      }));

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