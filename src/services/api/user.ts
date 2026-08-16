import { apiRequest, withLangQuery } from "./client";
import { authedApiRequest } from "./authed-client";
import type { AuthTokens } from "@/services/auth/parse-login";
import type { ApiResponse } from "./types";

export type UserProfile = {
  _id: string;
  fullname: string;
  email: string;
  /** Cloudinary (or similar) URL when the user has a profile picture. */
  profilePic?: string | null;
};

export type LogoutFlag = "one" | "all";

export type ProfilePicUploadData = {
  url: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readString(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }
  if (typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }
  return null;
}

function readProfilePicUrl(value: unknown): string | null {
  const direct = readString(value);
  if (direct) {
    // Absolute http(s), protocol-relative, or site-relative paths.
    if (
      /^https?:\/\//i.test(direct) ||
      direct.startsWith("//") ||
      direct.startsWith("/")
    ) {
      return direct.startsWith("//") ? `https:${direct}` : direct;
    }
    // Cloudinary-style host without scheme.
    if (/^(res\.)?cloudinary\.com\//i.test(direct)) {
      return `https://${direct}`;
    }
  }

  const row = asRecord(value);
  if (!row) return null;

  return (
    readProfilePicUrl(row.url) ??
    readProfilePicUrl(row.secure_url) ??
    readProfilePicUrl(row.secureUrl) ??
    readProfilePicUrl(row.path) ??
    readProfilePicUrl(row.profilePic) ??
    readProfilePicUrl(row.profile_pic) ??
    readProfilePicUrl(row.image)
  );
}

/** Pull the uploaded image URL from varied PATCH /user/profile-pic payloads. */
export function normalizeProfilePicUploadUrl(data: unknown): string | null {
  const direct = readProfilePicUrl(data);
  if (direct) return direct;

  const row = asRecord(data);
  if (!row) return null;

  return (
    readProfilePicUrl(row.data) ??
    readProfilePicUrl(row.url) ??
    readProfilePicUrl(row.profilePic) ??
    readProfilePicUrl(row.profile_pic) ??
    readProfilePicUrl(row.image) ??
    readProfilePicUrl(row.avatar) ??
    readProfilePicUrl(row.picture) ??
    readProfilePicUrl(row.file)
  );
}

/** Normalize GET /user payloads that may nest user fields or use alternate keys. */
export function normalizeUserProfile(data: unknown): UserProfile | null {
  let row = asRecord(data);
  if (!row) return null;

  const nested =
    asRecord(row.user) ?? asRecord(row.profile) ?? asRecord(row.data);
  if (
    nested &&
    (nested.email != null ||
      nested.fullname != null ||
      nested._id != null ||
      nested.id != null)
  ) {
    row = nested;
  }

  const _id =
    readString(row._id) ?? readString(row.id) ?? readString(row.userId) ?? "";
  const fullname =
    readString(row.fullname) ??
    readString(row.fullName) ??
    readString(row.name) ??
    "";
  const email = readString(row.email) ?? "";

  // Need at least one identifying field; bare envelope keys are not a profile.
  if (!_id && !fullname && !email) return null;

  const profilePic =
    readProfilePicUrl(row.profilePic) ??
    readProfilePicUrl(row.profile_pic) ??
    readProfilePicUrl(row.profileImage) ??
    readProfilePicUrl(row.profileImageUrl) ??
    readProfilePicUrl(row.profilePicture) ??
    readProfilePicUrl(row.image) ??
    readProfilePicUrl(row.imageUrl) ??
    readProfilePicUrl(row.avatar) ??
    readProfilePicUrl(row.picture) ??
    readProfilePicUrl(row.photo);

  return {
    _id: _id || email || "unknown",
    fullname,
    email,
    profilePic,
  };
}

/** GET /user */
export async function getProfile(): Promise<ApiResponse<UserProfile>> {
  const response = await authedApiRequest<unknown>("/user", { method: "GET" });
  const profile =
    normalizeUserProfile(response.data) ??
    // Some backends put user fields on the envelope root (no `data` wrapper).
    normalizeUserProfile(response);

  return {
    ...response,
    data: profile ?? undefined,
  };
}

/** POST /user/logout — `one` = this device, `all` = every device */
export function logoutUser(flag: LogoutFlag = "one") {
  return authedApiRequest("/user/logout", {
    method: "POST",
    body: JSON.stringify({ flag }),
  });
}

/** DELETE /user/freeze — soft-delete account */
export function freezeAccount() {
  return authedApiRequest("/user/freeze", { method: "DELETE" });
}

/**
 * POST /user/rotate-token
 * Authorization must be the refresh token (not access).
 * Prefer server-side rotation via NextAuth jwt callback / refreshAccessToken —
 * this helper is for direct calls when a refresh token string is already available.
 */
export function rotateToken(refreshToken: string) {
  return apiRequest<AuthTokens>("/user/rotate-token", {
    method: "POST",
    accessToken: refreshToken,
  });
}

/** PATCH /user/name?lang=ar — body `{ fullname }` */
export async function updateUserName(
  fullname: string,
): Promise<ApiResponse<UserProfile>> {
  const submitted = fullname.trim();
  const response = await authedApiRequest<unknown>(
    withLangQuery("/user/name"),
    {
      method: "PATCH",
      body: JSON.stringify({ fullname: submitted }),
    },
  );
  const profile =
    normalizeUserProfile(response.data) ?? normalizeUserProfile(response);

  const apiName = profile?.fullname?.trim();
  const resolvedName =
    apiName && apiName.toLowerCase() === submitted.toLowerCase()
      ? apiName
      : submitted;

  return {
    message: typeof response.message === "string" ? response.message : "",
    success: response.success !== false,
    status: response.status ?? 200,
    data: profile
      ? {
          _id: profile._id,
          fullname: resolvedName,
          email: profile.email,
          // Omit null/empty pic so callers don't wipe cached avatars.
          ...(profile.profilePic ? { profilePic: profile.profilePic } : {}),
        }
      : {
          _id: "unknown",
          fullname: resolvedName,
          email: "",
        },
  };
}

/**
 * PATCH /user/profile-pic?lang=ar — multipart upload.
 * Backend multer field is `file` (NestJS FileInterceptor). Docs mentioned
 * `profilePic`, but that returns Multer "Unexpected field".
 */
export async function uploadProfilePic(file: File) {
  const filename = guessProfilePicFilename(file);
  const formData = new FormData();
  formData.append("file", file, filename);
  const response = await authedApiRequest<unknown>(
    withLangQuery("/user/profile-pic"),
    {
      method: "PATCH",
      body: formData,
    },
  );

  let url =
    normalizeProfilePicUploadUrl(response.data) ??
    normalizeProfilePicUploadUrl(response);

  // Some backends omit the URL in the upload response — read it from GET /user.
  if (!url) {
    try {
      const profile = await getProfile();
      url = profile.data?.profilePic ?? null;
    } catch {
      // Keep upload success even if the follow-up profile read fails.
    }
  }

  return {
    ...response,
    data: url ? { url } : undefined,
  } satisfies ApiResponse<ProfilePicUploadData>;
}

function guessProfilePicFilename(file: File) {
  const original = file.name?.trim();
  if (original && /\.(jpe?g|png)$/i.test(original)) return original;
  if (file.type === "image/png") return "profile.png";
  return "profile.jpg";
}

/** DELETE /user/profile-pic?lang=ar */
export function deleteProfilePic() {
  return authedApiRequest(withLangQuery("/user/profile-pic"), {
    method: "DELETE",
  });
}
