import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Developer,
  Trophy,
  Star,
  SunLight,
  HalfMoon
} from 'iconoir-react';
import { KeycapLogo } from '@/graphics/logo/KeycapLogo';
import {
  LeftBoatAsciiScene,
  RightAtgmAsciiScene
} from '@/graphics/scenes/FlankAsciiScenes';
import { UserAvatar } from '@/shared/ui/UserAvatar';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { usePreferencesStore } from '@/shared/store/usePreferencesStore';
import { TRANSLATIONS } from '@/shared/i18n/translations';

interface PlatformLayoutProps {
  children: ReactNode;
}

export function PlatformLayout({ children }: PlatformLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated } = useAuthStore();
  const { theme, lang, toggleTheme, setLang } = usePreferencesStore();
  const t = TRANSLATIONS[lang];

  const isEvents = location.pathname === '/' || location.pathname.startsWith('/events');
  const isLeagues = location.pathname.startsWith('/leagues');
  const isPlayerRatings = location.pathname.startsWith('/ratings/players');
  const isClanRatings = location.pathname === '/ratings';

  const navBtnClass = (active: boolean) =>
    `px-3 py-1.5 rounded-[4px] text-[13px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
      active
        ? 'bg-[#EFEFEF] dark:bg-[#1E1E1E] text-[#111111] dark:text-white border border-[#DCDCDC] dark:border-[#2E2E2E]'
        : 'text-[#666666] dark:text-[#888888] hover:text-[#111111] dark:hover:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#161616] border border-transparent'
    }`;

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] dark:bg-[#0E0E0E] text-[#111111] dark:text-[#EDEDED] flex flex-col select-none transition-colors duration-150">
      {/* ЕДИНАЯ ВЕРХНЯЯ ПАНЕЛЬ */}
      <header className="sticky top-0 z-30 w-full bg-[#FFFFFF]/95 dark:bg-[#0E0E0E]/95 backdrop-blur-md border-b border-[#E2E2E2] dark:border-[#1F1F1F]">
        <div className="w-full px-5 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 min-w-0">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="flex items-center gap-2.5 group cursor-pointer text-left shrink-0"
            >
              <KeycapLogo width={38} height={31} label="SB" />
              <span className="text-[16px] font-bold tracking-tight text-[#111111] dark:text-white transition-colors">
                squad bit
              </span>
            </button>

            <span className="hidden lg:inline-block h-4 w-px bg-[#E2E2E2] dark:bg-[#242424]" />

            <nav className="hidden lg:flex items-center gap-1">
              <button
                type="button"
                onClick={() => navigate('/events')}
                className={navBtnClass(isEvents)}
              >
                <span>{t.nav.events}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/leagues')}
                className={navBtnClass(isLeagues)}
              >
                <Developer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{t.nav.leagues}</span>
                <span className="font-mono px-1 py-px text-[9.5px] font-bold uppercase rounded-[3px] bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 text-amber-700 dark:text-amber-300">
                  dev
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/ratings')}
                className={navBtnClass(isClanRatings)}
              >
                <Trophy className="w-3.5 h-3.5 text-[#888888] dark:text-[#666666]" />
                <span>{t.nav.clanRatings}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/ratings/players')}
                className={navBtnClass(isPlayerRatings)}
              >
                <Star className="w-3.5 h-3.5 text-[#888888] dark:text-[#666666]" />
                <span>{t.nav.playerRatings}</span>
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Переключатель языка RU / EN */}
            <div className="flex items-center h-8 bg-[#F4F4F4] dark:bg-[#141414] border border-[#DCDCDC] dark:border-[#282828] rounded-[4px] p-0.5 font-mono text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setLang('ru')}
                className={`h-full px-2 rounded-[3px] transition-colors cursor-pointer ${
                  lang === 'ru'
                    ? 'bg-white dark:bg-[#282828] text-[#111111] dark:text-white shadow-2xs'
                    : 'text-[#777777] dark:text-[#666666] hover:text-[#111111] dark:hover:text-[#CCCCCC]'
                }`}
              >
                RU
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`h-full px-2 rounded-[3px] transition-colors cursor-pointer ${
                  lang === 'en'
                    ? 'bg-white dark:bg-[#282828] text-[#111111] dark:text-white shadow-2xs'
                    : 'text-[#777777] dark:text-[#666666] hover:text-[#111111] dark:hover:text-[#CCCCCC]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Переключатель светлой / темной темы */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'light' ? t.theme.toDark : t.theme.toLight}
              aria-label={theme === 'light' ? t.theme.toDark : t.theme.toLight}
              className="h-8 w-8 rounded-[4px] bg-white dark:bg-[#141414] hover:bg-[#F2F2F2] dark:hover:bg-[#1E1E1E] border border-[#DCDCDC] dark:border-[#282828] text-[#555555] dark:text-[#CCCCCC] flex items-center justify-center transition-colors cursor-pointer"
            >
              {theme === 'light' ? (
                <HalfMoon className="w-4 h-4" />
              ) : (
                <SunLight className="w-4 h-4" />
              )}
            </button>

            {isAuthenticated && currentUser ? (
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="h-8 pl-1.5 pr-3 rounded-[4px] bg-[#F4F4F4] dark:bg-[#161616] hover:bg-[#EAEAEA] dark:hover:bg-[#1F1F1F] border border-[#DCDCDC] dark:border-[#2A2A2A] text-[13px] font-semibold text-[#111111] dark:text-white flex items-center gap-2 transition-colors cursor-pointer"
              >
                <UserAvatar username={currentUser.username} size="xs" />
                <span>{currentUser.username}</span>
                <span className="font-mono text-[11.5px] text-[#666666] dark:text-[#888888] pl-1.5 border-l border-[#DCDCDC] dark:border-[#2A2A2A]">
                  {currentUser.rating}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="h-8 px-3.5 rounded-[4px] bg-[#111111] dark:bg-white hover:bg-[#2A2A2A] dark:hover:bg-[#E5E5E5] text-white dark:text-[#0A0A0A] text-[13px] font-semibold transition-colors cursor-pointer"
              >
                {t.nav.login}
              </button>
            )}
          </div>
        </div>

        {/* Компактная навигация для экранов < lg */}
        <nav className="flex lg:hidden items-center gap-1 px-4 py-2 border-t border-[#EAEAEA] dark:border-[#1B1B1B] overflow-x-auto">
          <button
            type="button"
            onClick={() => navigate('/events')}
            className={navBtnClass(isEvents)}
          >
            {t.nav.events}
          </button>
          <button
            type="button"
            onClick={() => navigate('/leagues')}
            className={navBtnClass(isLeagues)}
          >
            {t.nav.leagues}
          </button>
          <button
            type="button"
            onClick={() => navigate('/ratings')}
            className={navBtnClass(isClanRatings)}
          >
            {t.nav.clanRatings}
          </button>
          <button
            type="button"
            onClick={() => navigate('/ratings/players')}
            className={navBtnClass(isPlayerRatings)}
          >
            {t.nav.playerRatings}
          </button>
        </nav>
      </header>

      {/* ТРЕХКОЛОНОЧНЫЙ МАКЕТ СО СТАТИЧЕСКИМИ ASCII-ФЛАНГАМИ */}
      <div className="flex-1 w-full grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_260px] 2xl:grid-cols-[340px_minmax(0,1fr)_340px]">
        <aside className="hidden xl:block sticky top-14 h-[calc(100vh-3.5rem)] border-r border-[#E2E2E2] dark:border-[#1F1F1F] overflow-hidden">
          <LeftBoatAsciiScene theme={theme} />
        </aside>

        <main className="min-w-0 bg-[#FFFFFF] dark:bg-[#0E0E0E] flex flex-col">
          <div className="flex-1 flex flex-col">{children}</div>

          <footer className="mt-auto w-full border-t border-[#E2E2E2] dark:border-[#1F1F1F] bg-[#FFFFFF] dark:bg-[#0E0E0E]">
            <div className="w-full px-5 sm:px-6 h-11 flex items-center justify-between text-[12px] text-[#666666] dark:text-[#777777]">
              <span className="font-semibold text-[#111111] dark:text-white">squad bit</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/leagues')}
                  className="hover:text-[#111111] dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.leagues.toLowerCase()}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/ratings')}
                  className="hover:text-[#111111] dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.clanRatings.toLowerCase()}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/ratings/players')}
                  className="hover:text-[#111111] dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.playerRatings.toLowerCase()}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/auth')}
                  className="hover:text-[#111111] dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.profile}
                </button>
              </div>
            </div>
          </footer>
        </main>

        <aside className="hidden xl:block sticky top-14 h-[calc(100vh-3.5rem)] border-l border-[#E2E2E2] dark:border-[#1F1F1F] overflow-hidden">
          <RightAtgmAsciiScene theme={theme} />
        </aside>
      </div>
    </div>
  );
}

export default PlatformLayout;
