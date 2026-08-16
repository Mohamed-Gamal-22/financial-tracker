"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, type UserProfile } from "@/services/api/user";
import { useAuth } from "@/hooks/useAuth";

export const userProfileQueryKey = (email = "") =>
  ["user", "profile", email] as const;

/** Matches every `["user", "profile", …]` query (sidebar, top bar, profile page, …). */
export const USER_PROFILE_QUERY_FILTER = { queryKey: ["user", "profile"] as const };

export function syncProfilePicCache(
  queryClient: ReturnType<typeof useQueryClient>,
  profilePic: string | null,
) {
  queryClient.setQueriesData<UserProfile>(USER_PROFILE_QUERY_FILTER, (prev) =>
    prev ? { ...prev, profilePic } : prev,
  );
}

/** Shared profile query so avatar/name stay in sync across the app. */
export function useUserProfile() {
  const { user } = useAuth();
  const email = user?.email ?? "";

  const query = useQuery({
    queryKey: userProfileQueryKey(email),
    queryFn: async () => {
      const response = await getProfile();
      if (response.data) return response.data;

      if (user?.email || user?.fullname) {
        return {
          _id: user.email || "session",
          fullname: user.fullname || "",
          email: user.email || "",
          profilePic: null as string | null,
        } satisfies UserProfile;
      }

      throw new Error("تعذر قراءة بيانات الحساب");
    },
    enabled: Boolean(email),
    staleTime: 60_000,
  });

  const profile = query.data ?? null;
  const displayName = profile?.fullname || user?.fullname || user?.email || "مستخدم";
  const profilePic = profile?.profilePic ?? null;

  return {
    ...query,
    user,
    profile,
    displayName,
    profilePic,
  };
}
