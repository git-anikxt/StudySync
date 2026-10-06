import { clerkClient } from "@clerk/express";

export interface StudySyncProfile {
  xp: number;
  streak: number;
  level: number;
  reputation: number;
  accountabilityScore: number;
  studyHours: number;
  semester: string;
  subjects: string[];
  availability: string;
  bio: string;
  avatar: string;
  lastStudyDate?: string;
  badges: string[];
}

export interface ClerkProfile {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  xp: number;
  streak: number;
  level: number;
  reputation: number;
  accountabilityScore: number;
  studyHours: number;
  semester: string;
  subjects: string[];
  availability: string;
  bio: string;
  lastStudyDate?: string;
  badges: string[];
}

const defaultStudySyncProfile: StudySyncProfile = {
  xp: 0,
  streak: 0,
  level: 1,
  reputation: 0,
  accountabilityScore: 0,
  studyHours: 0,
  semester: "",
  subjects: [],
  availability: "",
  bio: "",
  avatar: "",
  badges: [],
};

type ClerkUser = Awaited<ReturnType<typeof clerkClient.users.getUser>>;

export function getStudySyncMetadata(user: ClerkUser): StudySyncProfile {
  const raw = user.publicMetadata.studySync;
  const stored =
    typeof raw === "object" && raw !== null && !Array.isArray(raw)
      ? (raw as Partial<StudySyncProfile>)
      : {};

  return {
    ...defaultStudySyncProfile,
    ...stored,
    xp: Number.isFinite(stored.xp) ? stored.xp! : 0,
    streak: Number.isFinite(stored.streak) ? stored.streak! : 0,
    level: Number.isFinite(stored.level) ? stored.level! : 1,
    reputation: Number.isFinite(stored.reputation)
      ? stored.reputation!
      : 0,
    accountabilityScore: Number.isFinite(stored.accountabilityScore)
      ? stored.accountabilityScore!
      : 0,
    studyHours: Number.isFinite(stored.studyHours) ? stored.studyHours! : 0,
    semester: typeof stored.semester === "string" ? stored.semester : "",
    subjects: Array.isArray(stored.subjects) ? stored.subjects : [],
    availability:
      typeof stored.availability === "string" ? stored.availability : "",
    bio: typeof stored.bio === "string" ? stored.bio : "",
    avatar: typeof stored.avatar === "string" ? stored.avatar : "",
    badges: Array.isArray(stored.badges) ? stored.badges : [],
  };
}

export function getClerkProfile(user: ClerkUser): ClerkProfile {
  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    "";
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    email.split("@")[0] ||
    user.id;
  const metadata = getStudySyncMetadata(user);

  return {
    _id: user.id,
    name,
    email,
    ...metadata,
    avatar: metadata.avatar || user.imageUrl,
  };
}

export async function getClerkUserProfile(clerkUserId: string) {
  const user = await clerkClient.users.getUser(clerkUserId);
  return getClerkProfile(user);
}

export async function updateStudySyncProfile(
  clerkUserId: string,
  update: (profile: StudySyncProfile) => void
) {
  const user = await clerkClient.users.getUser(clerkUserId);
  const profile = getStudySyncMetadata(user);

  update(profile);

  const updatedUser = await clerkClient.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      studySync: profile,
    },
  });

  return getClerkProfile(updatedUser);
}

export async function getClerkUsersById(clerkUserIds: string[]) {
  const uniqueIds = [...new Set(clerkUserIds)];
  const users: ClerkUser[] = [];

  for (let offset = 0; offset < uniqueIds.length; offset += 100) {
    const userId = uniqueIds.slice(offset, offset + 100);
    if (userId.length === 0) continue;

    const page = await clerkClient.users.getUserList({
      userId,
      limit: userId.length,
    });
    users.push(...page.data);
  }

  return users;
}

export async function getAllClerkUsers() {
  const users: ClerkUser[] = [];
  const limit = 100;

  for (let offset = 0; ; offset += limit) {
    const page = await clerkClient.users.getUserList({ limit, offset });
    users.push(...page.data);

    if (page.data.length < limit) break;
  }

  return users;
}
