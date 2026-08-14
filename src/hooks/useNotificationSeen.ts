"use client";

import { useEffect, useState } from "react";
import {
  getSeenNotificationIds,
  markNotificationsSeen,
  subscribeNotificationSeen,
} from "@/lib/notification-seen";

export function useNotificationSeen(userKey?: string | null) {
  const [seenIds, setSeenIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setSeenIds(getSeenNotificationIds(userKey));
    sync();
    return subscribeNotificationSeen(sync);
  }, [userKey]);

  const markSeen = (ids: string[]) => {
    setSeenIds(markNotificationsSeen(ids, userKey));
  };

  return { seenIds, markSeen };
}
