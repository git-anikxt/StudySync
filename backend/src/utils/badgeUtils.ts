export const awardBadge = (
  user: any,
  badge: string
) => {
  if (
    !user.badges.includes(
      badge
    )
  ) {
    user.badges.push(
      badge
    );
  }
};