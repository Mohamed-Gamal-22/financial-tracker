import React from "react";

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#333] p-4 my-4 bg-gradient-to-r bg-clip-text text-transparent from-[#fd7f9b] to-[#fd3c60] tracking-tight">
          حل مالي متكامل مصمم ليناسب احتياجاتك اليومية
        </h2>
        <p className="text-[#333] max-w-xl mx-auto text-sm sm:text-base font-medium">
          نقدم لك كل الأدوات التي تحتاجها للسيطرة على أموالك وتجنب النفقات الزائدة لتحقيق طموحاتك المالية بكل سهولة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* ميزة 1 */}
        <div className="bg-[#1c1f29] p-14 border-4 border-transparent hover:border-4 hover:border-[#fd7f9b]    rounded-2xl hover:shadow-2xl hover:shadow-[#1c1f29]/30 transition-all duration-300 group text-center flex flex-col items-center justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 outline-4 outline-offset-3 outline-[#fd7f9b] border-offset-2 rounded-full bg-white flex items-center justify-center text-[#fd7f9b] shadow-md group-hover:scale-110 transition-transform duration-300 mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">تتبع ذكي وتصنيف تلقائي</h3>
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              سجل مصروفاتك اليومية في ثوانٍ، وسيقوم التطبيق بتصنيفها تلقائياً (سكن، تسوق، رفاهية، مواصلات) لتعرف أين تذهب أموالك بدقة.
            </p>
          </div>
        </div>

        {/* ميزة 2 */}
        <div className="bg-[#1c1f29] p-14 border-4 border-transparent hover:border-4 hover:border-[#fd7f9b]    rounded-2xl hover:shadow-2xl hover:shadow-[#1c1f29]/30 transition-all duration-300 group text-center flex flex-col items-center justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 outline-4 outline-offset-3 outline-[#fd7f9b] border-offset-2 rounded-full bg-white flex items-center justify-center text-[#fd7f9b] shadow-md group-hover:scale-110 transition-transform duration-300 mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">تخطيط الميزانية الشهرية</h3>
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              ضع ميزانيات مرنة ومخصصة لكل تصنيف. ينبهك التطبيق فور اقترابك من تجاوز الحد المحدد لتبقى ملتزماً بخطتك المالية.
            </p>
          </div>
        </div>

        {/* ميزة 3 */}
        <div className="bg-[#1c1f29] p-14 border-4 border-transparent hover:border-4 hover:border-[#fd7f9b]    rounded-2xl hover:shadow-2xl hover:shadow-[#1c1f29]/30 transition-all duration-300 group text-center flex flex-col items-center justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 outline-4 outline-offset-3 outline-[#fd7f9b] border-offset-2 rounded-full bg-white flex items-center justify-center text-[#fd7f9b] shadow-md group-hover:scale-110 transition-transform duration-300 mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">متابعة أهداف الادخار</h3>
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              سواء كنت ترغب في شراء منزل، سيارة، أو تأمين صندوق طوارئ، سيساعدك التطبيق على تقسيم الأهداف ومتابعة تقدمك خطوة بخطوة.
            </p>
          </div>
        </div>

        {/* ميزة 4 */}
        <div className="bg-[#1c1f29] p-14 border-4 border-transparent hover:border-4 hover:border-[#fd7f9b]    rounded-2xl hover:shadow-2xl hover:shadow-[#1c1f29]/30 transition-all duration-300 group text-center flex flex-col items-center justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 outline-4 outline-offset-3 outline-[#fd7f9b] border-offset-2 rounded-full bg-white flex items-center justify-center text-[#fd7f9b] shadow-md group-hover:scale-110 transition-transform duration-300 mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">تقارير وإحصائيات تفصيلية</h3>
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              احصل على تحليلات بصرية تفاعلية ورسوم بيانية أسبوعية وشهرية تكشف لك مواضع الإسراف لتقوم بتحسين عاداتك فوراً.
            </p>
          </div>
        </div>

        {/* ميزة 5 */}
        <div className="bg-[#1c1f29] p-14 border-4 border-transparent hover:border-4 hover:border-[#fd7f9b]    rounded-2xl hover:shadow-2xl hover:shadow-[#1c1f29]/30 transition-all duration-300 group text-center flex flex-col items-center justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 outline-4 outline-offset-3 outline-[#fd7f9b] border-offset-2 rounded-full bg-white flex items-center justify-center text-[#fd7f9b] shadow-md group-hover:scale-110 transition-transform duration-300 mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">أمان وحماية قصوى</h3>
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              بياناتك المالية سرية ومشفرة تماماً. لا يتم ربط حساباتك بالبنوك أو البطاقات الائتمانية بشكل مباشر لضمان أعلى مستويات الأمان.
            </p>
          </div>
        </div>

        {/* ميزة 6 */}
        <div className="bg-[#1c1f29] p-14 border-4 border-transparent hover:border-4 hover:border-[#fd7f9b]    rounded-2xl hover:shadow-2xl hover:shadow-[#1c1f29]/30 transition-all duration-300 group text-center flex flex-col items-center justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 outline-4 outline-offset-3 outline-[#fd7f9b] border-offset-2 rounded-full bg-white flex items-center justify-center text-[#fd7f9b] shadow-md group-hover:scale-110 transition-transform duration-300 mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">مزامنة سحابية فورية</h3>
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              سجل معاملاتك من أي جهاز وفي أي وقت. يتم مزامنة حسابك فورياً لتتمكن من إدارة أموالك من هاتفك أو جهاز الكمبيوتر الخاص بك بسلاسة.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
