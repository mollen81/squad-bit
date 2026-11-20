import { useState } from 'react';
import { Search } from 'iconoir-react';
import { PlatformLayout } from '@/shared/ui/PlatformLayout';
import { usePreferencesStore } from '@/shared/store/usePreferencesStore';
import { TRANSLATIONS } from '@/shared/i18n/translations';

interface ClanRow {
  rank: number;
  tag: string;
  name: string;
  mmr: number;
  matches: number;
  winRate: number;
  ticketDelta: string;
}

const CLAN_LADDER: ClanRow[] = [
  { rank: 1, tag: '7TB', name: '7th Tactical Battalion', mmr: 2140, matches: 48, winRate: 79, ticketDelta: '+214' },
  { rank: 2, tag: 'NVG', name: 'Northern Vanguard', mmr: 2065, matches: 44, winRate: 73, ticketDelta: '+178' },
  { rank: 3, tag: 'IWC', name: 'Iron Wolves Clan', mmr: 1940, matches: 39, winRate: 67, ticketDelta: '+132' },
  { rank: 4, tag: 'BHR', name: 'Black Hawk Recon', mmr: 1875, matches: 41, winRate: 61, ticketDelta: '+94' },
  { rank: 5, tag: 'SBG', name: 'Siberian Guard', mmr: 1810, matches: 35, winRate: 57, ticketDelta: '+68' },
  { rank: 6, tag: 'DRS', name: 'Desert Rats', mmr: 1740, matches: 32, winRate: 53, ticketDelta: '+22' },
  { rank: 7, tag: 'VTX', name: 'Vortex Division', mmr: 1690, matches: 27, winRate: 48, ticketDelta: '-18' }
];

export function RatingsPage() {
  const { lang } = usePreferencesStore();
  const t = TRANSLATIONS[lang];
  const [query, setQuery] = useState('');

  const filtered = CLAN_LADDER.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q);
  });

  return (
    <PlatformLayout>
      <section className="px-5 sm:px-6 py-4 border-b border-[#E2E2E2] dark:border-[#1F1F1F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-[20px] sm:text-[22px] font-bold text-[#111111] dark:text-white tracking-tight leading-tight">
          {t.clanRatingsPage.title}
        </h1>

        <div className="relative w-full sm:w-[270px]">
          <Search className="w-3.5 h-3.5 text-[#888888] dark:text-[#666666] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.clanRatingsPage.searchPlaceholder}
            className="w-full h-8 pl-8 pr-3 bg-[#F5F5F5] dark:bg-[#161616] border border-[#DCDCDC] dark:border-[#282828] focus:border-[#111111] dark:focus:border-[#666666] focus:bg-[#FFFFFF] dark:focus:bg-[#1A1A1A] rounded-[4px] text-[12.5px] text-[#111111] dark:text-white placeholder:text-[#888888] dark:placeholder:text-[#555555] outline-none transition-colors"
          />
        </div>
      </section>

      <section className="overflow-x-auto flex-1">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-[13.5px] text-[#666666] dark:text-[#888888]">
            {t.clanRatingsPage.empty}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E2E2] dark:border-[#1F1F1F] bg-[#FAFAFA] dark:bg-[#121212] text-[11.5px] font-semibold text-[#666666] dark:text-[#888888]">
                <th className="py-3 px-5 w-14 font-mono">{t.clanRatingsPage.columns.rank}</th>
                <th className="py-3 px-5">{t.clanRatingsPage.columns.clan}</th>
                <th className="py-3 px-5 text-right font-mono">{t.clanRatingsPage.columns.mmr}</th>
                <th className="py-3 px-5 text-right font-mono">{t.clanRatingsPage.columns.matches}</th>
                <th className="py-3 px-5 text-right font-mono">{t.clanRatingsPage.columns.winRate}</th>
                <th className="py-3 px-5 text-right font-mono">{t.clanRatingsPage.columns.ticketDelta}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECEC] dark:divide-[#1C1C1C] text-[13.5px]">
              {filtered.map((clan) => (
                <tr
                  key={clan.tag}
                  className="hover:bg-[#FAFAFA] dark:hover:bg-[#151515] transition-colors"
                >
                  <td className="py-3.5 px-5 font-mono font-bold text-[#777777] dark:text-[#7A7A7A]">
                    {String(clan.rank).padStart(2, '0')}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono px-2 py-0.5 bg-[#F4F4F4] dark:bg-[#1C1C1C] border border-[#DCDCDC] dark:border-[#2E2E2E] text-[#111111] dark:text-white text-[11.5px] font-bold rounded-[3px]">
                        [{clan.tag}]
                      </span>
                      <span className="font-semibold text-[#111111] dark:text-white">
                        {clan.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-bold text-[#111111] dark:text-white">
                    {clan.mmr}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono text-[#555555] dark:text-[#B8B8B8]">
                    {clan.matches}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                    {clan.winRate}%
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono text-[#555555] dark:text-[#B8B8B8]">
                    {clan.ticketDelta}
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

export default RatingsPage;
