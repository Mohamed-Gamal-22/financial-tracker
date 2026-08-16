"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserAvatar from "@/components/UserAvatar";
import { useAlert } from "@/app/(auth)/alerts";
import {
  deleteProfilePic,
  uploadProfilePic,
  type UserProfile,
} from "@/services/api/user";
import { formatApiErrorMessage } from "@/services/api/fieldErrors";
import { ApiError } from "@/services/api/types";
import {
  syncProfilePicCache,
  USER_PROFILE_QUERY_FILTER,
} from "@/hooks/useUserProfile";

const MAX_PROFILE_PIC_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

type ProfileSummaryCardProps = {
  name: string;
  email: string;
  profilePic?: string | null;
};

type PendingUpload = {
  file: File;
  previewUrl: string;
};

function isBlobUrl(url: string | null | undefined) {
  return Boolean(url && url.startsWith("blob:"));
}

export default function ProfileSummaryCard({
  name,
  email,
  profilePic,
}: ProfileSummaryCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<PendingUpload | null>(
    null,
  );
  /** Instant avatar — updates on confirm without a page reload. */
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profilePic ?? null);
  const activeBlobRef = useRef<string | null>(null);
  const deleteTitleId = useId();
  const deleteDescId = useId();
  const confirmTitleId = useId();
  const confirmDescId = useId();

  function revokeIfBlob(url: string | null | undefined) {
    if (!isBlobUrl(url)) return;
    URL.revokeObjectURL(url!);
    if (activeBlobRef.current === url) activeBlobRef.current = null;
  }

  function replaceAvatar(next: string | null) {
    setAvatarUrl((prev) => {
      if (prev && prev !== next) revokeIfBlob(prev);
      return next;
    });
    activeBlobRef.current = isBlobUrl(next) ? next : null;
  }

  // When the server profile pic arrives, swap blob preview → CDN URL.
  useEffect(() => {
    if (!profilePic) return;
    replaceAvatar(profilePic);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to server prop
  }, [profilePic]);

  useEffect(() => {
    return () => {
      revokeIfBlob(activeBlobRef.current);
    };
  }, []);

  const uploadMutation = useMutation({
    mutationFn: ({
      file,
    }: {
      file: File;
      previewUrl: string;
    }) => uploadProfilePic(file),
    onSuccess: async (response, variables) => {
      const serverUrl = response.data?.url ?? null;

      if (serverUrl) {
        replaceAvatar(serverUrl);
        revokeIfBlob(variables.previewUrl);
        syncProfilePicCache(queryClient, serverUrl);
        await queryClient.invalidateQueries(USER_PROFILE_QUERY_FILTER);
        // Keep optimistic URL if refetch races ahead of CDN.
        syncProfilePicCache(queryClient, serverUrl);
      } else {
        // Keep local preview visible; resolve CDN URL from refreshed profile.
        replaceAvatar(variables.previewUrl);
        await queryClient.invalidateQueries(USER_PROFILE_QUERY_FILTER);

        const cached = queryClient
          .getQueriesData<UserProfile>(USER_PROFILE_QUERY_FILTER)
          .map(([, data]) => data?.profilePic)
          .find((pic) => Boolean(pic) && !isBlobUrl(pic));

        if (cached) {
          replaceAvatar(cached);
          revokeIfBlob(variables.previewUrl);
          syncProfilePicCache(queryClient, cached);
        }
      }

      showAlert({
        message: response.message || "تم تحديث صورة الحساب",
        success: true,
        status: response.status,
      });
    },
    onError: (error) => {
      showAlert({
        message: formatApiErrorMessage(error, "تعذر رفع صورة الحساب"),
        success: false,
        status: error instanceof ApiError ? error.status : 400,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProfilePic(),
    onSuccess: async (response) => {
      replaceAvatar(null);
      syncProfilePicCache(queryClient, null);
      await queryClient.invalidateQueries(USER_PROFILE_QUERY_FILTER);
      syncProfilePicCache(queryClient, null);
      setDeleteOpen(false);
      showAlert({
        message: response.message || "تم حذف صورة الحساب",
        success: true,
        status: response.status,
      });
    },
    onError: (error) => {
      showAlert({
        message: formatApiErrorMessage(error, "تعذر حذف صورة الحساب"),
        success: false,
        status: error instanceof ApiError ? error.status : 400,
      });
    },
  });

  const busy = uploadMutation.isPending || deleteMutation.isPending;

  function clearPendingUpload() {
    setPendingUpload((prev) => {
      if (prev?.previewUrl && prev.previewUrl !== avatarUrl) {
        revokeIfBlob(prev.previewUrl);
      }
      return null;
    });
  }

  useEffect(() => {
    const dialogOpen = deleteOpen || Boolean(pendingUpload);
    if (!dialogOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || busy) return;
      if (pendingUpload) clearPendingUpload();
      if (deleteOpen) setDeleteOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [deleteOpen, pendingUpload, busy, avatarUrl]);

  function validateFile(file: File): string | null {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return "اختار صورة بصيغة JPG أو PNG";
    }
    if (file.size > MAX_PROFILE_PIC_BYTES) {
      return "حجم الصورة يجب ألا يتجاوز 5 ميجابايت";
    }
    return null;
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || busy) return;

    const validationError = validateFile(file);
    if (validationError) {
      showAlert({ message: validationError, success: false, status: 400 });
      return;
    }

    clearPendingUpload();
    setPendingUpload({
      file,
      previewUrl: URL.createObjectURL(file),
    });
  }

  function confirmUpload() {
    if (!pendingUpload || busy) return;
    const { file, previewUrl } = pendingUpload;

    // Instant: show chosen image on the avatar right away.
    replaceAvatar(previewUrl);
    setPendingUpload(null);
    uploadMutation.mutate({ file, previewUrl });
  }

  return (
    <>
      <aside className="rounded-2xl border border-card-border bg-surface shadow-sm p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <UserAvatar
            key={avatarUrl || "empty"}
            name={name}
            imageUrl={avatarUrl}
            size="lg"
            className="h-28 w-28 text-3xl shadow-md"
          />
          <div className="space-y-1 min-w-0 w-full">
            <h2 className="text-lg font-extrabold text-text-main tracking-tight truncate">
              {name || "—"}
            </h2>
            <p className="text-sm font-medium text-text-muted truncate">
              {email || "—"}
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,.jpg,.jpeg,.png"
            className="sr-only"
            onChange={onFileChange}
          />

          <div className="flex flex-col w-full gap-2 pt-1">
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover text-text-inverse px-4 py-2.5 text-sm font-bold transition-colors disabled:opacity-60 cursor-pointer"
            >
              {uploadMutation.isPending
                ? "جاري الرفع..."
                : avatarUrl
                  ? "تغيير الصورة"
                  : "رفع صورة"}
            </button>

            {avatarUrl ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => setDeleteOpen(true)}
                className="inline-flex items-center justify-center rounded-xl border border-accent-danger/30 bg-accent-danger/5 text-accent-danger hover:bg-accent-danger/10 px-4 py-2.5 text-sm font-bold transition-colors disabled:opacity-60 cursor-pointer"
              >
                حذف الصورة
              </button>
            ) : null}
          </div>
        </div>
      </aside>

      {pendingUpload ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          role="presentation"
          onClick={() => {
            if (!uploadMutation.isPending) clearPendingUpload();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={confirmTitleId}
            aria-describedby={confirmDescId}
            className="w-full max-w-md rounded-2xl border border-card-border bg-surface p-5 sm:p-6 shadow-xl text-start"
            onClick={(event) => event.stopPropagation()}
          >
            <h3
              id={confirmTitleId}
              className="text-base font-extrabold text-text-main mb-2"
            >
              تأكيد صورة الحساب
            </h3>
            <p
              id={confirmDescId}
              className="text-sm font-medium text-text-muted leading-relaxed mb-4"
            >
              راجع الصورة قبل الرفع. لو مش مناسبة، ألغِ واختار صورة تانية.
            </p>

            <div className="mb-5 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pendingUpload.previewUrl}
                alt="معاينة صورة الحساب"
                className="h-40 w-40 rounded-full object-cover border border-card-border shadow-sm"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
              <button
                type="button"
                disabled={uploadMutation.isPending}
                onClick={clearPendingUpload}
                className="inline-flex items-center justify-center rounded-xl border border-card-border bg-surface px-4 py-2.5 text-sm font-bold text-text-main hover:bg-primary-tint/40 transition-colors disabled:opacity-60 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={uploadMutation.isPending}
                onClick={confirmUpload}
                className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover text-text-inverse px-4 py-2.5 text-sm font-bold transition-colors disabled:opacity-60 cursor-pointer"
              >
                {uploadMutation.isPending ? "جاري الرفع..." : "تأكيد الرفع"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deleteOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          role="presentation"
          onClick={() => {
            if (!deleteMutation.isPending) setDeleteOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={deleteTitleId}
            aria-describedby={deleteDescId}
            className="w-full max-w-md rounded-2xl border border-card-border bg-surface p-5 sm:p-6 shadow-xl text-start"
            onClick={(event) => event.stopPropagation()}
          >
            <h3
              id={deleteTitleId}
              className="text-base font-extrabold text-text-main mb-2"
            >
              حذف صورة الحساب؟
            </h3>
            <p
              id={deleteDescId}
              className="text-sm font-medium text-text-muted leading-relaxed mb-5"
            >
              هتتشال صورة البروفايل الحالية، وتقدر ترفع صورة جديدة في أي وقت.
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => setDeleteOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-card-border bg-surface px-4 py-2.5 text-sm font-bold text-text-main hover:bg-primary-tint/40 transition-colors disabled:opacity-60 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate()}
                className="inline-flex items-center justify-center rounded-xl bg-accent-danger hover:opacity-90 text-white px-4 py-2.5 text-sm font-bold transition-opacity disabled:opacity-60 cursor-pointer"
              >
                {deleteMutation.isPending ? "جاري الحذف..." : "حذف الصورة"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
