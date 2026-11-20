import { useNavigate } from 'react-router-dom';
import { Developer } from 'iconoir-react';
import { PlatformLayout } from '@/shared/ui/PlatformLayout';
import { usePreferencesStore } from '@/shared/store/usePreferencesStore';
import { TRANSLATIONS } from '@/shared/i18n/translations';

export function LeaguesPage() {
  const navigate = useNavigate();
  const { lang } = usePreferencesStore();
  const t = TRANSLATIONS[lang];

  return (
    <PlatformLayout>
      <section className="px-5 sm:px-6 py-4 border-b border-[#E2E2E2] dark:border-[#1F1F1F]">
        <h1 className="text-[20px] sm:text-[22px] font-bold text-[#111111] dark:text-white tracking-tight leading-tight">
          {t.leaguesPage.title}
        </h1>
      </section>

      <section className="flex-1 flex items-center justify-center p-8">
        <div className="bg-[#FAFAFA] dark:bg-[#141414] border border-[#E2E2E2] dark:border-[#242424] rounded-[4px] p-7 max-w-md w-full text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[3px] bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/60 text-amber-700 dark:text-amber-300 text-[11.5px] font-semibold">
            <Developer className="w-3.5 h-3.5" />
            <span>{t.leaguesPage.devBadge}</span>
          </div>

          <p className="text-[13.5px] text-[#555555] dark:text-[#999999] leading-relaxed">
            {t.leaguesPage.devText}
          </p>

          <button
            type="button"
            onClick={() => navigate('/events')}
            className="h-8 px-4 rounded-[4px] bg-[#111111] dark:bg-white hover:bg-[#2A2A2A] dark:hover:bg-[#E5E5E5] text-white dark:text-[#0A0A0A] text-[12.5px] font-semibold transition-colors cursor-pointer"
          >
            {t.leaguesPage.backToEvents}
          </button>
        </div>
      </section>
    </PlatformLayout>
  );
}

export default LeaguesPage;
