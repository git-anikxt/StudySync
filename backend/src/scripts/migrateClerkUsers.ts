import mongoose from "mongoose";
import dotenv from "dotenv";
import { clerkClient } from "@clerk/express";

dotenv.config();

interface LegacyUser {
  _id: mongoose.Types.ObjectId;
  clerkId?: string;
  email?: string;
  name?: string;
  xp?: number;
  streak?: number;
  level?: number;
  reputation?: number;
  accountabilityScore?: number;
  studyHours?: number;
  semester?: string;
  subjects?: string[];
  availability?: string;
  bio?: string;
  avatar?: string;
  lastStudyDate?: Date | string;
  badges?: string[];
}

interface StoredDocument {
  _id: mongoose.Types.ObjectId;
  [key: string]: unknown;
}

const referenceFields = [
  { collection: "goals", field: "userId" },
  { collection: "sessions", field: "userId" },
  { collection: "studyrooms", field: "createdBy" },
  { collection: "chatmessages", field: "senderId" },
  { collection: "accountabilitycontracts", field: "creatorId" },
] as const;

const participantCollection = "studyrooms";

function asStudySyncMetadata(user: LegacyUser) {
  return {
    xp: user.xp ?? 0,
    streak: user.streak ?? 0,
    level: user.level ?? 1,
    reputation: user.reputation ?? 0,
    accountabilityScore: user.accountabilityScore ?? 0,
    studyHours: user.studyHours ?? 0,
    semester: user.semester ?? "",
    subjects: user.subjects ?? [],
    availability: user.availability ?? "",
    bio: user.bio ?? "",
    avatar: user.avatar ?? "",
    ...(user.lastStudyDate
      ? {
          lastStudyDate: new Date(user.lastStudyDate).toISOString(),
        }
      : {}),
    badges: user.badges ?? [],
  };
}

async function collectReferences(
  collectionName: string,
  field: string,
  usersByObjectId: Map<string, LegacyUser>,
  allLegacyUserIds: Set<string>,
  isArray = false
) {
  const collection =
    mongoose.connection.collection<StoredDocument>(collectionName);
  const documents = await collection.find({}).toArray();
  let references = 0;
  let unmatchedUserReferences = 0;
  let orphanReferences = 0;

  for (const document of documents) {
    const value = document[field];
    const values = isArray ? (Array.isArray(value) ? value : []) : [value];

    for (const reference of values) {
      if (!(reference instanceof mongoose.Types.ObjectId)) continue;

      const objectId = reference.toString();
      if (usersByObjectId.has(objectId)) {
        references += 1;
      } else if (allLegacyUserIds.has(objectId)) {
        unmatchedUserReferences += 1;
      } else {
        orphanReferences += 1;
      }
    }
  }

  return {
    documents,
    references,
    unmatchedUserReferences,
    orphanReferences,
  };
}

function hasUnmigratedProfileData(user: LegacyUser) {
  const knownFields = new Set([
    "_id",
    "__v",
    "clerkId",
    "email",
    "name",
    "password",
    "createdAt",
    "updatedAt",
    "xp",
    "streak",
    "level",
    "reputation",
    "accountabilityScore",
    "studyHours",
    "semester",
    "subjects",
    "availability",
    "bio",
    "avatar",
    "lastStudyDate",
    "badges",
  ]);
  const hasUnknownFields = Object.keys(user).some(
    (field) => !knownFields.has(field)
  );

  return Boolean(
    hasUnknownFields ||
      user.xp ||
      user.streak ||
      (user.level && user.level !== 1) ||
      user.reputation ||
      user.accountabilityScore ||
      user.studyHours ||
      user.semester ||
      user.subjects?.length ||
      user.availability ||
      user.bio ||
      user.avatar ||
      user.lastStudyDate ||
      user.badges?.length
  );
}

async function replaceReferences(
  collectionName: string,
  field: string,
  documents: StoredDocument[],
  usersByObjectId: Map<string, LegacyUser>,
  isArray = false
) {
  const collection =
    mongoose.connection.collection<StoredDocument>(collectionName);
  type BulkOperation = Parameters<typeof collection.bulkWrite>[0][number];
  const operations: BulkOperation[] = [];

  for (const document of documents) {
    const value = document[field];

    if (isArray) {
      if (!Array.isArray(value)) continue;
      const replacements = value.map((reference) => {
        if (!(reference instanceof mongoose.Types.ObjectId)) {
          return reference;
        }

        const user = usersByObjectId.get(reference.toString());
        if (!user) {
          throw new Error(
            `Missing Clerk mapping for ${collectionName}.${field}`
          );
        }
        return user.clerkId;
      });

      if (replacements.some((reference, index) => reference !== value[index])) {
        operations.push({
          updateOne: {
            filter: { _id: document._id },
            update: { $set: { [field]: replacements } },
          },
        });
      }
      continue;
    }

    if (!(value instanceof mongoose.Types.ObjectId)) continue;

    const user = usersByObjectId.get(value.toString());
    if (!user) {
      throw new Error(
        `Missing Clerk mapping for ${collectionName}.${field}`
      );
    }
    operations.push({
      updateOne: {
        filter: { _id: document._id },
        update: { $set: { [field]: user.clerkId } },
      },
    });
  }

  for (let offset = 0; offset < operations.length; offset += 500) {
    await collection.bulkWrite(operations.slice(offset, offset + 500));
  }

  return operations.length;
}

async function findUniqueVerifiedClerkUser(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const { data } = await clerkClient.users.getUserList({
    emailAddress: [email.trim()],
    limit: 100,
  });
  const matches = data.filter((user) =>
    user.emailAddresses.some(
      (address) =>
        address.emailAddress.trim().toLowerCase() === normalizedEmail &&
        address.verification?.status === "verified"
    )
  );

  return matches.length === 1 ? matches[0] : null;
}

function isClerkUserNotFound(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 404
  );
}

async function migrate() {
  if (!process.env.MONGODB_URL || !process.env.CLERK_SECRET_KEY) {
    throw new Error("MONGODB_URL and CLERK_SECRET_KEY must be configured.");
  }

  const apply = process.argv.includes("--apply");
  await mongoose.connect(process.env.MONGODB_URL);

  try {
    const usersCollection =
      mongoose.connection.collection<LegacyUser>("users");
    const legacyUsers = await usersCollection.find({}).toArray();
    const usersByObjectId = new Map<string, LegacyUser>();
    const clerkUsersById = new Map<
      string,
      Awaited<ReturnType<typeof clerkClient.users.getUser>>
    >();
    const clerkIds = new Set<string>();
    const duplicateClerkIds = new Set<string>();
    const usersNeedingIdentityMatch: LegacyUser[] = [];
    const allLegacyUserIds = new Set(
      legacyUsers.map((user) => user._id.toString())
    );
    let emailMatchedUsers = 0;
    let unresolvedUsers = 0;

    for (const user of legacyUsers) {
      if (typeof user.clerkId === "string" && user.clerkId.trim()) {
        try {
          await clerkClient.users.getUser(user.clerkId);
          continue;
        } catch (error) {
          if (!isClerkUserNotFound(error)) {
            throw error;
          }
          user.clerkId = undefined;
        }
      }

      usersNeedingIdentityMatch.push(user);
      const clerkUser = user.email?.trim()
        ? await findUniqueVerifiedClerkUser(user.email)
        : null;
      if (!clerkUser) {
        unresolvedUsers += 1;
        continue;
      }

      user.clerkId = clerkUser.id;
      emailMatchedUsers += 1;
    }

    for (const user of legacyUsers) {
      if (
        typeof user.clerkId !== "string" ||
        !user.clerkId.trim()
      ) {
        continue;
      }
      const clerkId = user.clerkId;
      if (clerkIds.has(clerkId)) {
        duplicateClerkIds.add(clerkId);
        continue;
      }

      usersByObjectId.set(user._id.toString(), user);
      clerkIds.add(clerkId);
      asStudySyncMetadata(user);
    }

    if (duplicateClerkIds.size > 0) {
      throw new Error(
        `No data was changed. ${duplicateClerkIds.size} Clerk IDs are duplicated.`
      );
    }

    const audits = await Promise.all(
      referenceFields.map(async (reference) => ({
        reference,
        audit: await collectReferences(
          reference.collection,
          reference.field,
          usersByObjectId,
          allLegacyUserIds
        ),
      }))
    );
    const participantAudit = await collectReferences(
      participantCollection,
      "participants",
      usersByObjectId,
      allLegacyUserIds,
      true
    );
    const unmatchedReferenceCount =
      audits.reduce(
        (total, { audit }) => total + audit.unmatchedUserReferences,
        0
      ) + participantAudit.unmatchedUserReferences;
    const orphanReferenceCount =
      audits.reduce(
        (total, { audit }) => total + audit.orphanReferences,
        0
      ) + participantAudit.orphanReferences;
    const unsafeUnmatchedUsers = usersNeedingIdentityMatch.filter(
      hasUnmigratedProfileData
    ).length;

    if (
      unsafeUnmatchedUsers > 0 ||
      unmatchedReferenceCount > 0 ||
      orphanReferenceCount > 0
    ) {
      throw new Error(
        `No data was changed. ${unresolvedUsers} users lack a unique verified Clerk email match, ${unsafeUnmatchedUsers} unmatched users have profile data, ${unmatchedReferenceCount} activity references point to unmatched users, and ${orphanReferenceCount} references have no legacy user record.`
      );
    }

    const migratableUsers = [...usersByObjectId.values()];

    for (const user of migratableUsers) {
      const clerkId = user.clerkId;
      if (!clerkId) {
        throw new Error("A legacy user is missing its Clerk ID.");
      }
      const clerkUser = await clerkClient.users.getUser(clerkId);
      clerkUsersById.set(clerkId, clerkUser);
    }

    const referenceCount =
      audits.reduce((total, { audit }) => total + audit.references, 0) +
      participantAudit.references;
    const emptyUnmatchedUsers =
      usersNeedingIdentityMatch.length - emailMatchedUsers;

    console.log(
      `${apply ? "Applying" : "Dry run"}: ${migratableUsers.length} Clerk profiles (${emailMatchedUsers} matched by verified email), ${referenceCount} activity references; ${emptyUnmatchedUsers} unmatched legacy accounts with no profile data or activity will be removed.`
    );

    if (!apply) {
      console.log("No data changed. Re-run with --apply to migrate.");
      return;
    }

    for (const user of migratableUsers) {
      const clerkId = user.clerkId;
      if (!clerkId) {
        throw new Error("A legacy user is missing its Clerk ID.");
      }
      const clerkUser = clerkUsersById.get(clerkId);
      if (
        clerkUser &&
        !clerkUser.firstName &&
        !clerkUser.lastName &&
        user.name?.trim()
      ) {
        const [firstName, ...lastName] = user.name.trim().split(/\s+/);
        await clerkClient.users.updateUser(clerkId, {
          firstName,
          lastName: lastName.join(" "),
        });
      }

      await clerkClient.users.updateUserMetadata(clerkId, {
        publicMetadata: {
          studySync: asStudySyncMetadata(user),
        },
      });
    }

    let convertedReferences = 0;
    for (const { reference, audit } of audits) {
      convertedReferences += await replaceReferences(
        reference.collection,
        reference.field,
        audit.documents,
        usersByObjectId
      );
    }
    convertedReferences += await replaceReferences(
      participantCollection,
      "participants",
      participantAudit.documents,
      usersByObjectId,
      true
    );

    for (const { collection, field } of referenceFields) {
      const remaining = await mongoose.connection
        .collection(collection)
        .countDocuments({ [field]: { $type: "objectId" } });
      if (remaining > 0) {
        throw new Error(
          `Migration verification failed: ${remaining} unmigrated ${collection}.${field} references remain.`
        );
      }
    }

    const remainingParticipants = await mongoose.connection
      .collection(participantCollection)
      .countDocuments({ participants: { $type: "objectId" } });
    if (remainingParticipants > 0) {
      throw new Error(
        `Migration verification failed: ${remainingParticipants} rooms still contain legacy participant IDs.`
      );
    }

    if (legacyUsers.length > 0) {
      await usersCollection.drop();
    }

    console.log(
      `Migration complete: ${migratableUsers.length} Clerk profiles updated, ${convertedReferences} references converted, ${emptyUnmatchedUsers} unmatched legacy accounts removed, legacy users collection removed.`
    );
  } finally {
    await mongoose.disconnect();
  }
}

migrate().catch((error: unknown) => {
  console.error("Clerk user migration failed:", error);
  process.exitCode = 1;
});
