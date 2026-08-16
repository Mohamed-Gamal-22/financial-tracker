"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useNotificationSeen } from "@/hooks/useNotificationSeen";
import { getNotifications } from "@/services/api/notification";
import { countUnreadNotifications } from "@/lib/notification-seen";

export function useNotifications() {
  const { user } = useAuth();
  const userKey = user?.id || user?.email || null;
  const { seenIds, markSeen } = useNotificationSeen(userKey);

  const query = useQuery({
    queryKey: ["notifications", "ar"],
    queryFn: async () => (await getNotifications()).data ?? [],
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const items = query.data ?? [];
  const unreadCount = useMemo(
    () => countUnreadNotifications(items, seenIds),
    [items, seenIds],
  );

  return {
    items,
    unreadCount,
    seenIds,
    markSeen,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}
