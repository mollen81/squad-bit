import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Group,
  Xmark,
  ArrowUpRight,
  MapPin
} from 'iconoir-react';
import { Loading } from 'loading-dev';
import { KeycapLogo } from '@/graphics/logo/KeycapLogo';
import { PlatformLayout } from '@/shared/ui/PlatformLayout';
import { UserAvatar } from '@/shared/ui/UserAvatar';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { usePreferencesStore } from '@/shared/store/usePreferencesStore';
import { TRANSLATIONS } from '@/shared/i18n/translations';
import type {
  TournamentItem,
  GameMode,
  MatchFormat,
  EventCategory,
  SquadMapInfo
} from '@/shared/types/tournament';

export const SQUAD_MAPS: Record<string, SquadMapInfo> = {
  gorodok: {
    mapId: 'gorodok',
    name: 'Gorodok',
    previewUrl: '/maps/gorodok_preview.jpg'
  },
  black_coast: {
    mapId: 'black_coast',
    name: 'Black Coast',
    previewUrl: '/maps/black_coast_preview.jpeg'
  },
  belaya: {
    mapId: 'belaya',
    name: 'Belaya Pass',
    previewUrl: '/maps/belaya_preview.jpg'
  },
  fools_road: {
    mapId: 'fools_road',
    name: "Fool's Road",
    previewUrl: '/maps/fools_road_preview.jpeg'
  },
  mestia: {
    mapId: 'mestia',
    name: 'Mestia',
    previewUrl: '/maps/mestia_preview.jpeg'
  }
};

const MAP_LIST = Object.values(SQUAD_MAPS);

export const INITIAL_EVENTS: TournamentItem[] = [
  {
    id: 'evt-01',
    title: 'PRIME CLANWAR: NORTHERN FRONT',
    category: 'SCRIM',
    format: 'BO3',
    status: 'LIVE',
    gameMode: 'RAAS',
    creatorNickname: 'Vortex_SL',
    creatorAvatarUrl: null,
    joinedPlayers: 98,
    maxPlayers: 100,
    currentMap: SQUAD_MAPS.gorodok,
    currentMapNumber: 2
  },
  {
    id: 'evt-02',
    title: 'OPERATION BLACK COAST',
    category: 'SCRIM',
    format: 'BO1',
    status: 'REGISTRATION',
    gameMode: 'INVASION',
    creatorNickname: 'TRACT_Actual',
    creatorAvatarUrl: null,
    joinedPlayers: 78,
    maxPlayers: 100,
    currentMap: SQUAD_MAPS.belaya,
    mapPool: [
      { ...SQUAD_MAPS.belaya, votes: 14 },
      { ...SQUAD_MAPS.black_coast, votes: 29 },
      { ...SQUAD_MAPS.mestia, votes: 9 }
    ]
  },
  {
    id: 'evt-03',
    title: 'EASTERN STEPPE MIX #42',
    category: 'PICKUP',
    format: 'BO1',
    status: 'REGISTRATION',
    gameMode: 'RAAS',
    creatorNickname: 'Korsar_7TB',
    creatorAvatarUrl: null,
    joinedPlayers: 85,
    maxPlayers: 100,
    currentMap: SQUAD_MAPS.gorodok,
    mapPool: [
      { ...SQUAD_MAPS.belaya, votes: 18 },
      { ...SQUAD_MAPS.gorodok, votes: 18 },
      { ...SQUAD_MAPS.fools_road, votes: 6 }
    ]
  },
  {
    id: 'evt-04',
    title: "FOOL'S ROAD ARMORED DIVISION",
    category: 'SCRIM',
    format: 'BO3',
    status: 'REGISTRATION',
    gameMode: 'AAS',
    creatorNickname: 'Sever_Actual',
    creatorAvatarUrl: null,
    joinedPlayers: 64,
    maxPlayers: 100,
    currentMap: SQUAD_MAPS.fools_road,
    mapPool: [
      { ...SQUAD_MAPS.fools_road, votes: 0 },
      { ...SQUAD_MAPS.mestia, votes: 0 },
      { ...SQUAD_MAPS.black_coast, votes: 0 }
    ]
  },
  {
    id: 'evt-05',
    title: 'MESTIA MOUNTAIN SIEGE',
    category: 'PICKUP',
    format: 'BO1',
    status: 'UPCOMING',
    gameMode: 'INVASION',
    creatorNickname: 'Ghost_Recon',
    creatorAvatarUrl: null,
    joinedPlayers: 42,
    maxPlayers: 100,
    currentMap: SQUAD_MAPS.mestia
  },
  {
    id: 'evt-06',
    title: 'FINALS QUALIFIER SCRIM',
    category: 'SCRIM',
    format: 'BO5',
    status: 'UPCOMING',
    gameMode: 'RAAS',
    creatorNickname: 'Mollen_CMD',
    creatorAvatarUrl: null,
    joinedPlayers: 50,
    maxPlayers: 100,
    currentMap: SQUAD_MAPS.belaya
  }
];

function resolveEventPreviewMap(ev: TournamentItem): {
  name: string;
  previewUrl: string;
  votes?: number;
} {
  if (ev.status === 'REGISTRATION' && ev.mapPool && ev.mapPool.length > 0) {
    let leader = ev.mapPool[0];
    for (let i = 1; i < ev.mapPool.length; i++) {
      if (ev.mapPool[i].votes > leader.votes) {
        leader = ev.mapPool[i];
      }
    }
    return {
      name: leader.name,
      previewUrl: leader.previewUrl,
      votes: leader.votes
    };
  }

  return {
    name: ev.currentMap.name,
    previewUrl: ev.currentMap.previewUrl
  };
}

function EventMapThumbnail({
  name,
  previewUrl,
  votes,
  votesText,
  defaultText
}: {
  name: string;
  previewUrl: string;
  votes?: number;
  votesText?: string;
  defaultText: string;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full aspect-[16/8.5] bg-[#EFEFEF] dark:bg-[#161616] border border-[#E0E0E0] dark:border-[#262626] rounded-[4px] overflow-hidden">
      {!hasError ? (
        <img
          src={previewUrl}
          alt={name}
          loading="lazy"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover block group-hover:scale-[1.02] transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-[#666666] dark:text-[#888888] px-3 text-center">
          <MapPin className="w-4 h-4 text-[#888888] dark:text-[#666666]" />
          <span className="text-[12px] font-semibold">{name}</span>
          <span className="font-mono text-[10px] text-[#888888] dark:text-[#666666] truncate max-w-full">
            public{previewUrl}
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

      <div className="pointer-events-none absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between gap-2 text-white">
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold drop-shadow-xs truncate">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{name}</span>
        </span>

        {typeof votes === 'number' && (
          <span className="font-mono px-1.5 py-0.5 rounded-[3px] bg-black/70 border border-white/20 text-[10px] font-medium shrink-0">
            {votes > 0 ? votesText : defaultText}
          </span>
        )}
      </div>
    </div>
  );
}

export function TournamentsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { lang } = usePreferencesStore();
  const t = TRANSLATIONS[lang];

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [events, setEvents] = useState<TournamentItem[]>(INITIAL_EVENTS);
  const [activeCategory, setActiveCategory] = useState<'ALL' | EventCategory>('ALL');
  const [selectedMode, setSelectedMode] = useState<'ALL' | GameMode>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newFormat, setNewFormat] = useState<MatchFormat>('BO1');
  const [newMode, setNewMode] = useState<GameMode>('RAAS');
  const [newCategory, setNewCategory] = useState<EventCategory>('SCRIM');
  const [newMapId, setNewMapId] = useState<string>('gorodok');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const filteredEvents = events.filter((ev) => {
    const matchCategory = activeCategory === 'ALL' || ev.category === activeCategory;
    const matchMode = selectedMode === 'ALL' || ev.gameMode === selectedMode;
    const matchStatus = selectedStatus === 'ALL' || ev.status === selectedStatus;
    const resolvedMap = resolveEventPreviewMap(ev);
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      ev.title.toLowerCase().includes(q) ||
      ev.creatorNickname.toLowerCase().includes(q) ||
      resolvedMap.name.toLowerCase().includes(q);
    return matchCategory && matchMode && matchStatus && matchSearch;
  });

  const handleCreateEvent = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const selectedMap = SQUAD_MAPS[newMapId] || SQUAD_MAPS.gorodok;
    const otherMaps = MAP_LIST.filter((m) => m.mapId !== selectedMap.mapId).slice(0, 2);

    setIsLoadingAction(true);
    setTimeout(() => {
      const created: TournamentItem = {
        id: crypto.randomUUID(),
        title: newTitle.trim().toUpperCase(),
        category: newCategory,
        format: newFormat,
        status: 'REGISTRATION',
        gameMode: newMode,
        creatorNickname: currentUser?.username || 'operator_bit',
        creatorAvatarUrl: null,
        joinedPlayers: 1,
        maxPlayers: 100,
        currentMap: selectedMap,
        currentMapNumber: 1,
        mapPool: [selectedMap, ...otherMaps].map((m) => ({ ...m, votes: 0 }))
      };

      setEvents([created, ...events]);
      setIsLoadingAction(false);
      setIsCreateModalOpen(false);
      setNewTitle('');
    }, 500);
  };

  const renderStatusPill = (ev: TournamentItem) => {
    if (ev.status === 'LIVE') {
      const mapNum = ev.currentMapNumber ?? 1;
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/70 text-red-700 dark:text-red-300 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400 animate-pulse shrink-0" />
          <span>{t.statuses.liveMap(mapNum)}</span>
        </span>
      );
    }
    if (ev.status === 'REGISTRATION') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
          <span>{t.statuses.registration}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-[3px] bg-[#F4F4F4] dark:bg-[#1B1B1B] border border-[#DCDCDC] dark:border-[#2C2C2C] text-[#666666] dark:text-[#999999] text-[11px] font-medium">
        {t.statuses.upcoming}
      </span>
    );
  };

  const modeDotColor: Record<GameMode, string> = {
    RAAS: 'bg-blue-600 dark:bg-blue-400',
    INVASION: 'bg-emerald-600 dark:bg-emerald-400',
    AAS: 'bg-purple-600 dark:bg-purple-400',
    SKIRMISH: 'bg-amber-600 dark:bg-amber-400'
  };

  return (
    <PlatformLayout>
      {/* ИНФОРМАЦИОННЫЙ БЛОК: ЗАГОЛОВОК + КНОПКА «СОЗДАТЬ ИВЕНТ» ПЕРЕД ФИЛЬТРОМ СТАТУСА */}
      <section className="px-5 sm:px-6 py-4 border-b border-[#E2E2E2] dark:border-[#1F1F1F] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <h1 className="text-[20px] sm:text-[22px] font-bold text-[#111111] dark:text-white tracking-tight leading-tight">
          {t.eventsPage.titleActive}
        </h1>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="h-8 px-3.5 rounded-[4px] bg-[#111111] dark:bg-white hover:bg-[#2A2A2A] dark:hover:bg-[#E5E5E5] text-white dark:text-[#0A0A0A] text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.nav.createEvent}</span>
          </button>

          <div className="flex items-center h-8 bg-[#F4F4F4] dark:bg-[#141414] border border-[#DCDCDC] dark:border-[#262626] rounded-[4px] p-0.5">
            {[
              { id: 'ALL', label: t.eventsPage.statusFilters.all },
              { id: 'LIVE', label: t.eventsPage.statusFilters.live },
              { id: 'REGISTRATION', label: t.eventsPage.statusFilters.registration },
              { id: 'UPCOMING', label: t.eventsPage.statusFilters.upcoming }
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStatus(st.id)}
                className={`h-full px-2.5 rounded-[3px] text-[12px] font-semibold transition-colors cursor-pointer ${
                  selectedStatus === st.id
                    ? 'bg-white dark:bg-[#282828] text-[#111111] dark:text-white shadow-2xs'
                    : 'text-[#666666] dark:text-[#7A7A7A] hover:text-[#111111] dark:hover:text-[#DCDCDC]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ПАНЕЛЬ КАТЕГОРИЙ (БЕЗ ЛИГ), РЕЖИМОВ И ПОИСКА */}
      <section className="px-5 sm:px-6 py-3 border-b border-[#E2E2E2] dark:border-[#1F1F1F] bg-[#FAFAFA] dark:bg-[#121212] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: t.eventsPage.tabs.all, count: events.length },
            {
              id: 'SCRIM',
              label: t.eventsPage.tabs.scrim,
              count: events.filter((e) => e.category === 'SCRIM').length
            },
            {
              id: 'PICKUP',
              label: t.eventsPage.tabs.pickup,
              count: events.filter((e) => e.category === 'PICKUP').length
            }
          ].map((tab) => {
            const active = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id as 'ALL' | EventCategory)}
                className={`h-7 px-2.5 rounded-[4px] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-[#0A0A0A]'
                    : 'bg-white dark:bg-[#181818] hover:bg-[#EFEFEF] dark:hover:bg-[#222222] text-[#555555] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white border border-[#DCDCDC] dark:border-[#282828]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`font-mono text-[10.5px] ${
                    active
                      ? 'text-[#AAAAAA] dark:text-[#555555]'
                      : 'text-[#888888] dark:text-[#666666]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}

          <span className="hidden sm:inline-block mx-1 text-[#DCDCDC] dark:text-[#2A2A2A]">
            |
          </span>

          {(['ALL', 'RAAS', 'INVASION', 'AAS', 'SKIRMISH'] as const).map((mode) => {
            const active = selectedMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setSelectedMode(mode)}
                className={`h-7 px-2 rounded-[4px] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  active
                    ? 'bg-white dark:bg-[#242424] text-[#111111] dark:text-white border border-[#A0A0A0] dark:border-[#444444]'
                    : 'text-[#666666] dark:text-[#888888] hover:text-[#111111] dark:hover:text-white hover:bg-[#EFEFEF] dark:hover:bg-[#1B1B1B] border border-transparent'
                }`}
              >
                {mode !== 'ALL' && (
                  <span className={`w-1.5 h-1.5 rounded-full ${modeDotColor[mode]}`} />
                )}
                <span>{mode === 'ALL' ? t.eventsPage.allModes : t.gameModes[mode]}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-[210px] shrink-0">
          <Search className="w-3.5 h-3.5 text-[#888888] dark:text-[#666666] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.eventsPage.searchPlaceholder}
            className="w-full h-7 pl-8 pr-7 bg-white dark:bg-[#161616] border border-[#DCDCDC] dark:border-[#282828] focus:border-[#111111] dark:focus:border-[#666666] rounded-[4px] text-[12.5px] text-[#111111] dark:text-white placeholder:text-[#888888] dark:placeholder:text-[#555555] outline-none transition-colors"
          />
          <kbd className="font-mono pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 px-1 bg-[#F4F4F4] dark:bg-[#1F1F1F] border border-[#DCDCDC] dark:border-[#303030] rounded-[3px] text-[10px] font-bold text-[#666666] dark:text-[#888888]">
            /
          </kbd>
        </div>
      </section>

      {/* СЕТКА ИВЕНТОВ: 3 В РЯД */}
      {filteredEvents.length === 0 ? (
        <section className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-2 bg-[#FFFFFF] dark:bg-[#0E0E0E]">
          <p className="text-[15px] font-bold text-[#111111] dark:text-white">
            {t.eventsPage.emptyTitle}
          </p>
          <p className="text-[13px] text-[#666666] dark:text-[#888888]">
            {t.eventsPage.emptySubtitle}
          </p>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-[#FFFFFF] dark:bg-[#0E0E0E]">
          {filteredEvents.map((ev) => {
            const previewMap = resolveEventPreviewMap(ev);

            return (
              <article
                key={ev.id}
                onClick={() => navigate(`/events/${ev.id}`)}
                className="group relative bg-[#FFFFFF] dark:bg-[#111111] hover:bg-[#FAFAFA] dark:hover:bg-[#161616] border-b border-r border-[#E2E2E2] dark:border-[#1F1F1F] lg:[&:nth-child(3n)]:border-r-0 md:max-lg:[&:nth-child(2n)]:border-r-0 p-4 sm:p-5 transition-colors cursor-pointer flex flex-col justify-between gap-3.5"
              >
                <span className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-[#111111] dark:bg-white opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {renderStatusPill(ev)}

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-[#F5F5F5] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#282828] text-[#111111] dark:text-[#D4D4D4] text-[11px] font-medium">
                        <span className={`w-1.5 h-1.5 rounded-full ${modeDotColor[ev.gameMode]}`} />
                        {t.gameModes[ev.gameMode]}
                      </span>

                      <span className="font-mono px-2 py-0.5 rounded-[3px] bg-[#EFEFEF] dark:bg-[#1E1E1E] border border-[#DCDCDC] dark:border-[#303030] text-[#111111] dark:text-white text-[10.5px] font-bold">
                        {ev.format}
                      </span>
                    </div>
                  </div>

                  <EventMapThumbnail
                    name={previewMap.name}
                    previewUrl={previewMap.previewUrl}
                    votes={previewMap.votes}
                    votesText={
                      typeof previewMap.votes === 'number'
                        ? t.eventsPage.votesLabel(previewMap.votes)
                        : undefined
                    }
                    defaultText={t.eventsPage.defaultMap}
                  />

                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-[15px] font-bold text-[#111111] dark:text-white leading-snug">
                      {ev.title}
                    </h2>
                    <ArrowUpRight className="w-4 h-4 text-[#999999] dark:text-[#555555] group-hover:text-[#111111] dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
                  </div>
                </div>

                {/* НИЖНЯЯ ЧАСТЬ: АВАТАРКА ОРГАНИЗАТОРА + НИК | СЧЕТЧИК ИГРОКОВ */}
                <div className="pt-3 border-t border-[#ECECEC] dark:border-[#1E1E1E] flex items-center justify-between text-[12.5px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <UserAvatar
                      src={ev.creatorAvatarUrl}
                      username={ev.creatorNickname}
                      size="sm"
                    />
                    <span className="text-[#111111] dark:text-[#DCDCDC] font-medium truncate">
                      {ev.creatorNickname}
                    </span>
                  </div>

                  <div className="font-mono flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-[3px] bg-[#F5F5F5] dark:bg-[#161616] border border-[#E0E0E0] dark:border-[#282828] text-[#111111] dark:text-white text-[11.5px] font-semibold">
                    <Group className="w-3.5 h-3.5 text-[#555555] dark:text-[#999999]" />
                    <span>
                      {ev.joinedPlayers}/{ev.maxPlayers}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* МОДАЛЬНОЕ ОКНО СОЗДАНИЯ ИВЕНТА */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 dark:bg-black/80 backdrop-blur-[2px]">
          <div className="w-full max-w-[430px] bg-[#FFFFFF] dark:bg-[#121212] border border-[#DCDCDC] dark:border-[#2A2A2A] p-5 rounded-[4px] relative shadow-2xl">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute right-4 top-4 text-[#777777] hover:text-[#111111] dark:hover:text-white transition-colors cursor-pointer"
            >
              <Xmark className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <KeycapLogo width={32} height={26} label="+" />
              <h2 className="text-[15.5px] font-bold text-[#111111] dark:text-white">
                {t.createModal.title}
              </h2>
            </div>

            {isLoadingAction ? (
              <div className="py-10 flex flex-col items-center justify-center gap-3">
                <Loading />
                <span className="text-[12.5px] font-semibold text-[#666666] dark:text-[#888888]">
                  {t.createModal.creating}
                </span>
              </div>
            ) : (
              <form onSubmit={handleCreateEvent} className="space-y-3.5">
                <div>
                  <label className="block text-[12.5px] font-semibold text-[#111111] dark:text-[#DBDBDB] mb-1.5">
                    {t.createModal.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={t.createModal.namePlaceholder}
                    className="w-full h-10 bg-[#F5F5F5] dark:bg-[#161616] border border-[#DCDCDC] dark:border-[#282828] focus:border-[#111111] dark:focus:border-[#666666] focus:bg-[#FFFFFF] dark:focus:bg-[#1A1A1A] rounded-[4px] px-3 text-[13px] text-[#111111] dark:text-white placeholder:text-[#888888] dark:placeholder:text-[#555555] outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-[#111111] dark:text-[#DBDBDB] mb-1.5">
                    {t.createModal.startMapLabel}
                  </label>
                  <select
                    value={newMapId}
                    onChange={(e) => setNewMapId(e.target.value)}
                    className="w-full h-10 bg-[#F5F5F5] dark:bg-[#161616] border border-[#DCDCDC] dark:border-[#282828] focus:border-[#111111] dark:focus:border-[#666666] rounded-[4px] px-2.5 text-[13px] text-[#111111] dark:text-white outline-none"
                  >
                    {MAP_LIST.map((m) => (
                      <option key={m.mapId} value={m.mapId}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12.5px] font-semibold text-[#111111] dark:text-[#DBDBDB] mb-1.5">
                      {t.createModal.formatLabel}
                    </label>
                    <select
                      value={newFormat}
                      onChange={(e) => setNewFormat(e.target.value as MatchFormat)}
                      className="font-mono w-full h-10 bg-[#F5F5F5] dark:bg-[#161616] border border-[#DCDCDC] dark:border-[#282828] focus:border-[#111111] dark:focus:border-[#666666] rounded-[4px] px-2.5 text-[12.5px] text-[#111111] dark:text-white outline-none"
                    >
                      <option value="BO1">BO1</option>
                      <option value="BO3">BO3</option>
                      <option value="BO5">BO5</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-semibold text-[#111111] dark:text-[#DBDBDB] mb-1.5">
                      {t.createModal.modeLabel}
                    </label>
                    <select
                      value={newMode}
                      onChange={(e) => setNewMode(e.target.value as GameMode)}
                      className="w-full h-10 bg-[#F5F5F5] dark:bg-[#161616] border border-[#DCDCDC] dark:border-[#282828] focus:border-[#111111] dark:focus:border-[#666666] rounded-[4px] px-2.5 text-[13px] text-[#111111] dark:text-white outline-none"
                    >
                      <option value="RAAS">{t.gameModes.RAAS}</option>
                      <option value="INVASION">{t.gameModes.INVASION}</option>
                      <option value="AAS">{t.gameModes.AAS}</option>
                      <option value="SKIRMISH">{t.gameModes.SKIRMISH}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-[#111111] dark:text-[#DBDBDB] mb-1.5">
                    {t.createModal.categoryLabel}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EventCategory)}
                    className="w-full h-10 bg-[#F5F5F5] dark:bg-[#161616] border border-[#DCDCDC] dark:border-[#282828] focus:border-[#111111] dark:focus:border-[#666666] rounded-[4px] px-2.5 text-[13px] text-[#111111] dark:text-white outline-none"
                  >
                    <option value="SCRIM">{t.createModal.categoryScrim}</option>
                    <option value="PICKUP">{t.createModal.categoryPickup}</option>
                  </select>
                </div>

                <div className="pt-1.5">
                  <button
                    type="submit"
                    className="w-full h-10 bg-[#111111] dark:bg-white hover:bg-[#2A2A2A] dark:hover:bg-[#E5E5E5] text-white dark:text-[#0A0A0A] font-semibold text-[13px] rounded-[4px] transition-colors cursor-pointer"
                  >
                    {t.createModal.submit}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </PlatformLayout>
  );
}

export default TournamentsPage;
