import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Group,
  Terminal,
  Copy,
  Check,
  NavArrowLeft
} from 'iconoir-react';
import { Loading } from 'loading-dev';
import { PlatformLayout } from '@/shared/ui/PlatformLayout';
import { UserAvatar } from '@/shared/ui/UserAvatar';
import { INITIAL_EVENTS } from '@/pages/tournaments/TournamentsPage';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { usePreferencesStore } from '@/shared/store/usePreferencesStore';
import { TRANSLATIONS } from '@/shared/i18n/translations';

export function EventLobbyPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser, isAuthenticated } = useAuthStore();
  const { lang } = usePreferencesStore();
  const t = TRANSLATIONS[lang];

  const eventItem = INITIAL_EVENTS.find((e) => e.id === id) || INITIAL_EVENTS[0];

  const [copiedIp, setCopiedIp] = useState(false);
  const [joiningSide, setJoiningSide] = useState<number | null>(null);
  const [joinedSide, setJoinedSide] = useState<number | null>(null);

  const serverConnect = 'connect 185.189.255.14:7787';

  const handleCopyConnect = () => {
    navigator.clipboard?.writeText(serverConnect);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 1800);
  };

  const handleJoinSide = (sideIdx: number) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setJoiningSide(sideIdx);
    setTimeout(() => {
      setJoiningSide(null);
      setJoinedSide(sideIdx);
    }, 500);
  };

  const renderStatusPill = () => {
    if (eventItem.status === 'LIVE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/70 text-red-700 dark:text-red-300 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400 animate-pulse" />
          {t.statuses.liveMap(eventItem.currentMapNumber ?? 1)}
        </span>
      );
    }
    if (eventItem.status === 'REGISTRATION') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
          {t.statuses.registration}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-[3px] bg-[#F4F4F4] dark:bg-[#1B1B1B] border border-[#DCDCDC] dark:border-[#2C2C2C] text-[#666666] dark:text-[#999999] text-[11px] font-medium">
        {t.statuses.upcoming}
      </span>
    );
  };

  return (
    <PlatformLayout>
      {/* Шапка лобби */}
      <section className="px-5 sm:px-6 py-4 border-b border-[#E2E2E2] dark:border-[#1F1F1F] space-y-3">
        <button
          type="button"
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#666666] dark:text-[#888888] hover:text-[#111111] dark:hover:text-white transition-colors cursor-pointer"
        >
          <NavArrowLeft className="w-4 h-4" />
          <span>{t.lobbyPage.backToEvents}</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {renderStatusPill()}
              <span className="px-2 py-0.5 rounded-[3px] bg-[#F5F5F5] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#282828] text-[#111111] dark:text-[#D4D4D4] text-[11px] font-medium">
                {t.gameModes[eventItem.gameMode]}
              </span>
              <span className="font-mono px-2 py-0.5 rounded-[3px] bg-[#EFEFEF] dark:bg-[#1E1E1E] border border-[#DCDCDC] dark:border-[#303030] text-[#111111] dark:text-white text-[10.5px] font-bold">
                {eventItem.format}
              </span>
            </div>

            <h1 className="text-[20px] sm:text-[22px] font-bold text-[#111111] dark:text-white tracking-tight leading-tight">
              {eventItem.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-[13px] text-[#666666] dark:text-[#888888]">
            <span>{t.lobbyPage.creator}:</span>
            <UserAvatar
              src={eventItem.creatorAvatarUrl}
              username={eventItem.creatorNickname}
              size="sm"
            />
            <span className="text-[#111111] dark:text-white font-semibold">
              {eventItem.creatorNickname}
            </span>
          </div>
        </div>
      </section>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Блок игрового сервера */}
        <section className="bg-[#FAFAFA] dark:bg-[#121212] border border-[#E2E2E2] dark:border-[#222222] rounded-[4px] p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#666666] dark:text-[#888888]">
              <Terminal className="w-4 h-4 text-[#111111] dark:text-white" />
              <span>{t.lobbyPage.gameServer}</span>
              <span className="px-1.5 py-px rounded-[3px] bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300 text-[10.5px] font-semibold">
                {t.lobbyPage.serverOnline}
              </span>
            </div>
            <div className="text-[14px] font-bold text-[#111111] dark:text-white">
              RU-MSK #02 // {eventItem.currentMap.name} {t.gameModes[eventItem.gameMode]} // 45 TPS
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <code className="font-mono px-3 py-2 bg-white dark:bg-[#0E0E0E] border border-[#DCDCDC] dark:border-[#282828] rounded-[4px] text-[12.5px] text-[#333333] dark:text-[#CCCCCC]">
              {serverConnect}
            </code>
            <button
              type="button"
              onClick={handleCopyConnect}
              className="h-9 px-3.5 bg-white dark:bg-[#1B1B1B] hover:bg-[#EFEFEF] dark:hover:bg-[#252525] border border-[#DCDCDC] dark:border-[#303030] rounded-[4px] text-[12.5px] font-semibold text-[#111111] dark:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copiedIp ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{t.lobbyPage.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.lobbyPage.copy}</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Две стороны 50v50 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { idx: 1, tag: '7TB', faction: 'RGF', commander: 'Vortex_SL', count: 42 },
            { idx: 2, tag: 'NVG', faction: 'USMC', commander: 'TRACT_Actual', count: 36 }
          ].map((side) => {
            const isJoined = joinedSide === side.idx;
            const isBusy = joiningSide === side.idx;

            return (
              <div
                key={side.idx}
                className="bg-[#FFFFFF] dark:bg-[#111111] border border-[#E2E2E2] dark:border-[#222222] rounded-[4px] p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#ECECEC] dark:border-[#1E1E1E] pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono px-2 py-0.5 bg-[#F4F4F4] dark:bg-[#1C1C1C] border border-[#DCDCDC] dark:border-[#2E2E2E] text-[#111111] dark:text-white text-[11.5px] font-bold rounded-[3px]">
                      [{side.tag}]
                    </span>
                    <span className="text-[15px] font-bold text-[#111111] dark:text-white">
                      {t.lobbyPage.sideLabel(side.idx)} · {side.faction}
                    </span>
                  </div>

                  <div className="font-mono flex items-center gap-1.5 text-[12.5px] font-semibold text-[#111111] dark:text-white">
                    <Group className="w-3.5 h-3.5 text-[#666666] dark:text-[#888888]" />
                    <span>{side.count + (isJoined ? 1 : 0)}/50</span>
                  </div>
                </div>

                <div className="text-[13px] text-[#666666] dark:text-[#888888] space-y-2">
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F0F0F0] dark:border-[#1B1B1B]">
                    <span>{t.lobbyPage.commander}</span>
                    <span className="flex items-center gap-2 text-[#111111] dark:text-white font-semibold">
                      <UserAvatar username={side.commander} size="xs" />
                      <span>{side.commander}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#F0F0F0] dark:border-[#1B1B1B]">
                    <span>{t.lobbyPage.squadsFormed}</span>
                    <span className="font-mono text-[#111111] dark:text-white font-semibold">
                      5 / 6
                    </span>
                  </div>

                  {isJoined && currentUser && (
                    <div className="flex items-center justify-between py-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                      <span>{t.lobbyPage.yourSlot}</span>
                      <span>{currentUser.username}</span>
                    </div>
                  )}
                </div>

                {isBusy ? (
                  <div className="h-10 flex items-center justify-center">
                    <Loading />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleJoinSide(side.idx)}
                    disabled={isJoined}
                    className={`w-full h-10 rounded-[4px] text-[13px] font-semibold transition-colors cursor-pointer ${
                      isJoined
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 cursor-default'
                        : 'bg-[#111111] dark:bg-white hover:bg-[#2A2A2A] dark:hover:bg-[#E5E5E5] text-white dark:text-[#0A0A0A]'
                    }`}
                  >
                    {isJoined ? t.lobbyPage.joinedSide : t.lobbyPage.joinSide}
                  </button>
                )}
              </div>
            );
          })}
        </section>
      </div>
    </PlatformLayout>
  );
}

export default EventLobbyPage;
