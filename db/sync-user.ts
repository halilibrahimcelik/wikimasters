import db from ".";
import { usersSync } from "./schema";

type StackUser = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
};

export const ensureUserExist = async (user: StackUser) => {
  await db
    .insert(usersSync)
    .values({
      id: user.id,
      name: user.displayName,
      email: user.primaryEmail,
    })
    .onConflictDoUpdate({
      target: usersSync.id,
      set: {
        name: user.displayName,
        email: user.primaryEmail,
      },
    });
};
