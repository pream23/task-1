"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/contants";
import { error, log } from "console";
import { redirect } from "next/navigation";

interface UserDocument {
  $id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
  accountId: string;
}

const getUserByEmail = async (email: string): Promise<UserDocument | null> => {
  try {
    const { databases } = await createAdminClient();
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("email", email)]
    );
    return result.total > 0 ? result.documents[0] : null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
};

const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  throw typeof error === "object" && error !== null && "message" in error
    ? error
    : new Error(message);
};

export const sendEmailOTP = async ({
  email,
}: {
  email: string;
}): Promise<string> => {
  const { account } = await createAdminClient();

  try {
    const token = await account.createEmailToken(ID.unique(), email);
    return token.userId;
  } catch (error) {
    handleError(error, "Failed to send OTP");
    throw error; // Re-throw after handling
  }
};

export const createAccount = async ({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  try {
    // Check for existing user first
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create OTP and get accountId
    const accountId = await sendEmailOTP({ email });
    if (!accountId) {
      throw new Error("Failed to create account ID");
    }

    // Create user document
    if (!existingUser) {
      const { databases } = await createAdminClient();
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        ID.unique(),
        {
          firstName,
          lastName,
          email,
          password,
          avatar: avatarPlaceholderUrl,
          accountId,
        }
      );
    }

    return parseStringify({ accountId });
  } catch (error) {
    handleError(error, "Failed to create account");
    throw error;
  }
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

export const getCurrentUser = async () => {
  const { databases, account } = await createSessionClient();

  const result = await account.get();

  const user = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("accountId", result.$id)]
  );
  if (user.total <= 0) return null;

  return parseStringify(user.documents[0]);
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();
  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out");
  } finally {
    redirect("/sign-in");
  }
};

export const signInUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    } else {
      throw new Error("User not found with this email");
    }
  } catch (error) {
    handleError(error, "Failed to sign In user");
  }
};
