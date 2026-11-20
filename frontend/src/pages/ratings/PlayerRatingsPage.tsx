import { useState } from 'react';
import { Search } from 'iconoir-react';
import { PlatformLayout } from '@/shared/ui/PlatformLayout';
import { UserAvatar } from '@/shared/ui/UserAvatar';
import { usePreferencesStore } from '@/shared/store/usePreferencesStore';
import { TRANSLATIONS } from '@/shared/i18n/translations';

interface PlayerRow {
  rank: number;
  nickname: string;
  avatarUrl?: string | null;
  clanTag: string | null;
  elo: number;
  matches: number;
  winRate: number;
  kd: string;
}

const PLAYER_LADDER: PlayerRow[] = [
  { rank: 1, nickname: 'Vortex_SL', avatarUrl: null, clanTag: '7TB', elo: 2245, matches: 84, winRate: 76, kd: '1.84' },
  { rank: 2, nickname: 'TRACT_Actual', avatarUrl: null, clanTag: 'NVG', elo: 2180, matches: 79, winRate: 72, kd: '1.71' },
  { rank: 3, nickname: 'Korsar_7TB', avatarUrl: null, clanTag: '7TB', elo: 2095, matches: 68, winRate: 69, kd: '1.62' },
  { rank: 4, nickname: 'Sever_Actual', avatarUrl: null, clanTag: 'IWC', elo: 1990, matches: 61, winRate: 64, kd: '1.48' },
  { rank: 5, nickname: 'Mollen_CMD', avatarUrl: null, clanTag: 'SBG', elo: 1925, matches: 55, winRate: 62, kd: '1.39' },
  { rank: 6, nickname: 'Ghost_Recon', avatarUrl: null, clanTag: 'BHR', elo: 1860, matches: 52, winRate: 58, kd: '1.31' },
  { rank: 7, nickname: 'Kalmyk_SL', avatarUrl: null, clanTag: null, elo: 1795, matches: 47, winRate: 55, kd: '1.22' }
];

export function PlayerRatingsPage() {
  const { lang } = usePreferencesStore();
  const t = TRANSLATIONS[lang];
  const [query, setQuery] = useState('');

  const filtered = PLAYER_LADDER.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.nickname.toLowerCase().includes(q) ||
      (p.clanTag && p.clanTag.toLowerCase().includes(q))
    );
  });

  return (
    <PlatformLayout>
      <section className="px-5 sm:px-6 py-4 border-b border-[#E2E2E2] dark:border-[#1F1F1F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-[20px] sm:text-[22px] font-bold text-[#111111] dark:text-white tracking-tight leading-tight">
          {t.playerRatingsPage.title}
        </h1>

        <div className="relative w-full sm:w-[270px]">
          <Search className="w-3.5 h-3.5 text-[#888888] dark:text-[#666666] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.playerRatingsPage.searchPlaceholder}
            className="w-full h-8 pl-8 pr-3 bg-[#F5F5F5] dark:bg-[#161616] border border-[#DCDCDC] dark:border-[#282828] focus:border-[#111111] dark:focus:border-[#666666] focus:bg-[#FFFFFF] dark:focus:bg-[#1A1A1A] rounded-[4px] text-[12.5px] text-[#111111] dark:text-white placeholder:text-[#888888] dark:placeholder:text-[#555555] outline-none transition-colors"
          />
        </div>
      </section>

      <section className="overflow-x-auto flex-1">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-[13.5px] text-[#666666] dark:text-[#888888]">
            {t.playerRatingsPage.empty}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E2E2] dark:border-[#1F1F1F] bg-[#FAFAFA] dark:bg-[#121212] text-[11.5px] font-semibold text-[#666666] dark:text-[#888888]">
                <th className="py-3 px-5 w-14 font-mono">{t.playerRatingsPage.columns.rank}</th>
                <th className="py-3 px-5">{t.playerRatingsPage.columns.player}</th>
                <th className="py-3 px-5">{t.playerRatingsPage.columns.clan}</th>
                <th className="py-3 px-5 text-right font-mono">{t.playerRatingsPage.columns.elo}</th>
                <th className="py-3 px-5 text-right font-mono">{t.playerRatingsPage.columns.matches}</th>
                <th className="py-3 px-5 text-right font-mono">{t.playerRatingsPage.columns.winRate}</th>
                <th className="py-3 px-5 text-right font-mono">{t.playerRatingsPage.columns.kd}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECEC] dark:divide-[#1C1C1C] text-[13.5px]">
              {filtered.map((player) => (
                <tr
                  key={player.nickname}
                  className="hover:bg-[#FAFAFA] dark:hover:bg-[#151515] transition-colors"
                >
                  <td className="py-3.5 px-5 font-mono font-bold text-[#777777] dark:text-[#7A7A7A]">
                    {String(player.rank).padStart(2, '0')}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar
                        src={player.avatarUrl}
                        username={player.nickname}
                        size="sm"
                      />
                      <span className="font-semibold text-[#111111] dark:text-white">
                        {player.nickname}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    {player.clanTag ? (
                      <span className="font-mono px-2 py-0.5 bg-[#F4F4F4] dark:bg-[#1C1C1C] border border-[#DCDCDC] dark:border-[#2E2E2E] text-[#111111] dark:text-[#D4D4D4] text-[11.5px] font-bold rounded-[3px]">
                        [{player.clanTag}]
                      </span>
                    ) : (
                      <span className="text-[#999999] dark:text-[#444444]">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-bold text-[#111111] dark:text-white">
                    {player.elo}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono text-[#555555] dark:text-[#B8B8B8]">
                    {player.matches}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                    {player.winRate}%
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-semibold text-[#111111] dark:text-[#D4D4D4]">
                    {player.kd}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </PlatformLayout>
  );
}

export default PlayerRatingsPage;
