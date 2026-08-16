"use client";

import {
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import UserAvatar from "@/components/UserAvatar";
import NotificationsBell from "@/components/NotificationsBell";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getCategories } from "@/services/api/category";
import { listTransactions } from "@/services/api/transaction";
import {
  amountToneClass,
  categoryTypeOf,
  formatMoney,
  resolveCategory,
} from "@/lib/format";
import { CATEGORY_TYPE_LABELS } from "@/schemas/category.schema";

type DashboardTopBarProps = {
  onOpenSidebar?: () => void;
};

const PAGE_SHORTCUTS = [
  { label: "الرئيسية", href: "/dashboard", keywords: ["رئيسية", "لوحة", "home", "dashboard"] },
  { label: "المعاملات", href: "/transactions", keywords: ["معاملات", "مصروفات", "transactions"] },
  { label: "التصنيفات", href: "/categories", keywords: ["تصنيفات", "فئات", "categories"] },
  { label: "التقارير", href: "/reports", keywords: ["تقارير", "reports"] },
  { label: "الميزانية", href: "/budget", keywords: ["ميزانية", "budget"] },
  { label: "التنبيهات", href: "/notifications", keywords: ["تنبيهات", "إشعارات", "notifications"] },
  { label: "الملف الشخصي", href: "/profile", keywords: ["ملف", "حساب", "profile"] },
] as const;

function normalizeSearch(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export default function DashboardTopBar({ onOpenSidebar }: DashboardTopBarProps) {
  const { displayName, profilePic } = useUserProfile();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeSearch(deferredQuery);

  const { data: transactions = [], isFetching: txsFetching } = useQuery({
    queryKey: ["navbar-search-transactions"],
    queryFn: async () => {
      const response = await listTransactions({ page: 1, limit: 80 });
      return response.data?.transactions ?? [];
    },
    staleTime: 30_000,
    enabled: open || normalizedQuery.length > 0,
  });

  const { data: categories = [], isFetching: catsFetching } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return response.data ?? [];
    },
    staleTime: 60_000,
    enabled: open || normalizedQuery.length > 0,
  });

  const matchedTransactions = useMemo(() => {
    if (!normalizedQuery) return [];
    return transactions
      .filter((tx) => {
        const category = resolveCategory(tx.category);
        const haystack = [
          tx.title,
          category?.name ?? "",
          String(tx.amount),
          category?.type ? CATEGORY_TYPE_LABELS[category.type] : "",
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .slice(0, 6);
  }, [transactions, normalizedQuery]);

  const matchedCategories = useMemo(() => {
    if (!normalizedQuery) return [];
    return categories
      .filter((category) => {
        const haystack = [
          category.name,
          CATEGORY_TYPE_LABELS[category.type],
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .slice(0, 5);
  }, [categories, normalizedQuery]);

  const matchedPages = useMemo(() => {
    if (!normalizedQuery) return [];
    return PAGE_SHORTCUTS.filter((page) => {
      const haystack = [page.label, ...page.keywords].join(" ").toLowerCase();
      return haystack.includes(normalizedQuery);
    }).slice(0, 4);
  }, [normalizedQuery]);

  const hasQuery = normalizedQuery.length > 0;
  const isLoading = hasQuery && (txsFetching || catsFetching);
  const hasResults =
    matchedTransactions.length > 0 ||
    matchedCategories.length > 0 ||
    matchedPages.length > 0;
  const showPanel = open && hasQuery;

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <header className="flex flex-wrap items-center gap-3 sm:gap-4 rounded-2xl border border-card-border bg-surface/90 backdrop-blur-sm px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        {onOpenSidebar && (
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="فتح القائمة"
            className="lg:hidden p-2 rounded-xl border border-card-border/60 bg-surface hover:bg-primary-tint/40 text-text-main transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <Link href="/dashboard" className="text-lg font-extrabold text-primary tracking-tight">
          مصروفي
        </Link>
      </div>

      <div className="order-last w-full sm:order-none sm:flex-1 sm:max-w-md sm:mx-auto" ref={rootRef}>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-text-muted">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
            </svg>
          </div>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="بحث عن معاملة، تصنيف، أو صفحة..."
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded={showPanel}
            className="w-full bg-input-bg border border-input-border rounded-xl ps-10 pe-4 py-2.5 text-sm text-text-main placeholder-text-muted outline-none focus:border-input-focus focus:ring-2 focus:ring-primary/20 transition-all"
          />

          {showPanel && (
            <div
              id={listId}
              role="listbox"
              className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-card-border bg-surface shadow-xl"
            >
              {isLoading && !hasResults ? (
                <p className="px-4 py-3 text-sm font-bold text-text-muted">جاري البحث...</p>
              ) : !hasResults ? (
                <p className="px-4 py-3 text-sm font-bold text-text-muted">
                  لا توجد نتائج لـ &ldquo;{deferredQuery.trim()}&rdquo;
                </p>
              ) : (
                <div className="max-h-[70vh] overflow-y-auto py-2">
                  {matchedTransactions.length > 0 && (
                    <section className="px-2 pb-1">
                      <p className="px-2 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-text-muted">
                        معاملات
                      </p>
                      <ul className="space-y-0.5">
                        {matchedTransactions.map((tx) => {
                          const category = resolveCategory(tx.category);
                          const type = categoryTypeOf(tx.category);
                          return (
                            <li key={tx._id}>
                              <Link
                                href={`/transactions?q=${encodeURIComponent(category?.name || tx.title)}`}
                                role="option"
                                onClick={() => {
                                  setOpen(false);
                                  setQuery("");
                                }}
                                className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 hover:bg-primary-tint/40 transition-colors"
                              >
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">
                                  {tx.title.trim().charAt(0) || "؟"}
                                </span>
                                <span className="min-w-0 flex-1 text-start">
                                  <span className="block truncate text-sm font-bold text-text-main">
                                    {tx.title}
                                  </span>
                                  <span className="mt-0.5 block truncate text-xs font-medium text-text-muted">
                                    {category?.name ?? "—"}
                                  </span>
                                </span>
                                <span
                                  className={`shrink-0 text-sm font-extrabold ${amountToneClass(type)}`}
                                >
                                  {formatMoney(tx.amount, { type, withSign: true })}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  )}

                  {matchedCategories.length > 0 && (
                    <section className="px-2 pb-1">
                      <p className="px-2 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-text-muted">
                        تصنيفات
                      </p>
                      <ul className="space-y-0.5">
                        {matchedCategories.map((category) => (
                          <li key={category._id}>
                            <Link
                              href={`/transactions?q=${encodeURIComponent(category.name)}`}
                              role="option"
                              onClick={() => {
                                setOpen(false);
                                setQuery("");
                              }}
                              className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 hover:bg-primary-tint/40 transition-colors"
                            >
                              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple/10 text-sm font-extrabold text-purple">
                                {category.name.trim().charAt(0) || "؟"}
                              </span>
                              <span className="min-w-0 flex-1 text-start">
                                <span className="block truncate text-sm font-bold text-text-main">
                                  {category.name}
                                </span>
                                <span className="mt-0.5 block text-xs font-medium text-text-muted">
                                  {CATEGORY_TYPE_LABELS[category.type]}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {matchedPages.length > 0 && (
                    <section className="px-2 pb-1">
                      <p className="px-2 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-text-muted">
                        صفحات
                      </p>
                      <ul className="space-y-0.5">
                        {matchedPages.map((page) => (
                          <li key={page.href}>
                            <Link
                              href={page.href}
                              role="option"
                              onClick={() => {
                                setOpen(false);
                                setQuery("");
                              }}
                              className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 hover:bg-primary-tint/40 transition-colors"
                            >
                              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky/10 text-sm font-extrabold text-sky">
                                ←
                              </span>
                              <span className="text-sm font-bold text-text-main">{page.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  <div className="border-t border-card-border/70 px-2 pt-2">
                    <Link
                      href={`/transactions?q=${encodeURIComponent(deferredQuery.trim())}`}
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center justify-center rounded-xl px-3 py-2.5 text-sm font-bold text-primary hover:bg-primary-tint/50 transition-colors"
                    >
                      عرض النتائج في المعاملات
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="ms-auto flex items-center gap-1 sm:gap-2">
        <NotificationsBell />
        <Link href="/profile" className="ms-1" aria-label="الملف الشخصي">
          <UserAvatar
            name={displayName}
            imageUrl={profilePic}
            size="sm"
            className="shadow-none ring-2 ring-card-border ring-offset-2 ring-offset-surface"
          />
        </Link>
      </div>
    </header>
  );
}
