# Backend

## Clerk user-data migration

The application no longer uses MongoDB `User` documents for authentication,
profiles, or study statistics. The migration command transfers supported
profile/stat fields to Clerk `publicMetadata.studySync`, converts activity
ownership references to Clerk IDs, and removes the legacy `users` collection
only after verifying the converted references.

Run the command with the backend environment configured:

```powershell
npm run migrate:clerk-users
```

This is a read-only preflight. It verifies Clerk identities and checks that
every activity reference can be preserved. Legacy accounts without a usable
Clerk identity are removable only when they have no app-profile data or
activity references; otherwise the migration stops without changing data.

After reviewing the preflight output and backing up the target database, apply
the migration with:

```powershell
npm run migrate:clerk-users -- --apply
```

Stop the backend before applying the migration so older processes cannot write
MongoDB `ObjectId` ownership references during cutover.
