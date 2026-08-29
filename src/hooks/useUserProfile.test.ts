import { describe, expect, it, vi } from "vitest";
import {
  syncProfilePicCache,
  userProfileQueryKey,
  USER_PROFILE_QUERY_FILTER,
} from "./useUserProfile";

describe("userProfileQueryKey / syncProfilePicCache", () => {
  it("builds a stable query key", () => {
    expect(userProfileQueryKey("a@b.com")).toEqual([
      "user",
      "profile",
      "a@b.com",
    ]);
    expect(USER_PROFILE_QUERY_FILTER).toEqual({
      queryKey: ["user", "profile"],
    });
  });

  it("updates profilePic on matching cached profiles", () => {
    const setQueriesData = vi.fn(
      (
        _filter: unknown,
        updater: (prev: { fullname: string; profilePic?: string | null } | undefined) => unknown,
      ) => {
        updater({ fullname: "أحمد", profilePic: null });
        updater(undefined);
      },
    );

    syncProfilePicCache(
      { setQueriesData } as never,
      "https://cdn.example.com/a.jpg",
    );

    expect(setQueriesData).toHaveBeenCalledWith(
      USER_PROFILE_QUERY_FILTER,
      expect.any(Function),
    );
    const updater = setQueriesData.mock.calls[0][1] as (prev: {
      fullname: string;
      profilePic?: string | null;
    } | undefined) => unknown;
    expect(updater({ fullname: "أحمد", profilePic: null })).toEqual({
      fullname: "أحمد",
      profilePic: "https://cdn.example.com/a.jpg",
    });
    expect(updater(undefined)).toBeUndefined();
  });
});
