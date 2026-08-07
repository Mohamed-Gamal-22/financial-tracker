"use client";

import { useAuth } from "@/hooks/useAuth";
import UserAvatar from "@/components/UserAvatar";
import Navbar from "@/app/_components/Navbar";

const DUMMY_PROFILE = {
  phone: "+20 100 000 0000",
  city: "القاهرة، مصر",
  joinedAt: "مارس 2026",
  plan: "الخطة المجانية",
  monthlyBudget: "12,500 ج.م",
  savedThisMonth: "2,340 ج.م",
  categories: 8,
};

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    void logout("/login");
  };

  return (
    <div className="min-h-screen relative text-text-main overflow-x-hidden flex flex-col font-sans bg-gradient-to-br from-bg-start to-bg-end">
      <div className="absolute top-[-10%] end-[-15%] w-[600px] h-[600px] -z-50 bg-sky/20 rounded-full blur-[100px] pointer-events-none select-none" />
      <div className="absolute top-[40%] start-[-20%] w-[500px] h-[500px] -z-50 bg-purple/20 rounded-full blur-[100px] pointer-events-none select-none" />

      <Navbar />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <section className="rounded-3xl border border-card-border bg-card-bg/90 backdrop-blur-xl shadow-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 border-b border-card-border/60 pb-6">
            <UserAvatar name={user.fullname} size="lg" />
            <div className="text-start space-y-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate">
                {user.fullname}
              </h1>
              <p className="text-sm font-medium text-text-muted truncate">
                {user.email}
              </p>
              <p className="text-xs font-bold text-primary pt-1">
                {DUMMY_PROFILE.plan} · عضو منذ {DUMMY_PROFILE.joinedAt}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <InfoCard label="رقم الهاتف" value={DUMMY_PROFILE.phone} />
            <InfoCard label="المدينة" value={DUMMY_PROFILE.city} />
            <InfoCard label="الميزانية الشهرية" value={DUMMY_PROFILE.monthlyBudget} />
            <InfoCard label="التوفير هذا الشهر" value={DUMMY_PROFILE.savedThisMonth} />
            <InfoCard
              label="عدد التصنيفات"
              value={`${DUMMY_PROFILE.categories} تصنيفات`}
            />
            <InfoCard label="البريد الإلكتروني" value={user.email} />
          </div>

          <p className="mt-6 text-xs text-text-muted font-medium text-start">
            بعض البيانات أعلاه تجريبية للعرض فقط إلى أن يتوفر API للملف الشخصي.
          </p>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-accent-danger/90 hover:bg-accent-danger text-white text-sm font-bold transition-colors cursor-pointer"
            >
              تسجيل الخروج
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-card-border/70 bg-surface/60 px-4 py-3 text-start">
      <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-text-main break-all">{value}</p>
    </div>
  );
}
