import type { AppLang } from '@/shared/store/usePreferencesStore';
import type { GameMode } from '@/shared/types/tournament';

export interface TranslationDict {
  nav: {
    events: string;
    leagues: string;
    clanRatings: string;
    playerRatings: string;
    createEvent: string;
    login: string;
    profile: string;
  };
  eventsPage: {
    titleActive: string;
    tabs: {
      all: string;
      scrim: string;
      pickup: string;
    };
    allModes: string;
    statusFilters: {
      all: string;
      live: string;
      registration: string;
      upcoming: string;
    };
    searchPlaceholder: string;
    votesLabel: (count: number) => string;
    defaultMap: string;
    emptyTitle: string;
    emptySubtitle: string;
  };
  statuses: {
    liveMap: (mapNumber: number) => string;
    registration: string;
    upcoming: string;
  };
  gameModes: Record<GameMode, string>;
  leaguesPage: {
    title: string;
    devBadge: string;
    devText: string;
    backToEvents: string;
  };
  createModal: {
    title: string;
    creating: string;
    nameLabel: string;
    namePlaceholder: string;
    startMapLabel: string;
    formatLabel: string;
    modeLabel: string;
    categoryLabel: string;
    categoryScrim: string;
    categoryPickup: string;
    submit: string;
  };
  clanRatingsPage: {
    title: string;
    searchPlaceholder: string;
    empty: string;
    columns: {
      rank: string;
      clan: string;
      mmr: string;
      matches: string;
      winRate: string;
      ticketDelta: string;
    };
  };
  playerRatingsPage: {
    title: string;
    searchPlaceholder: string;
    empty: string;
    columns: {
      rank: string;
      player: string;
      clan: string;
      elo: string;
      matches: string;
      winRate: string;
      kd: string;
    };
  };
  lobbyPage: {
    backToEvents: string;
    creator: string;
    gameServer: string;
    serverOnline: string;
    copy: string;
    copied: string;
    commander: string;
    squadsFormed: string;
    yourSlot: string;
    joinSide: string;
    joinedSide: string;
    sideLabel: (idx: number) => string;
  };
  authPage: {
    backToEvents: string;
    registerTab: string;
    loginTab: string;
    syncing: string;
    emailLabel: string;
    emailPlaceholder: string;
    usernameLabel: string;
    usernamePlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    passwordMatch: string;
    submitRegister: string;
    submitLogin: string;
    haveAccount: string;
    noAccount: string;
    orDivider: string;
    steamRegister: string;
    steamLogin: string;
    steamHint: string;
    errors: {
      shortPassword: string;
      passwordMismatch: string;
    };
    session: {
      title: string;
      initialRating: string;
      squadHours: (hours: number) => string;
      copy: string;
      copied: string;
      toEvents: string;
      logout: string;
    };
    footer: {
      onlineOperators: string;
      totalProfiles: string;
    };
  };
  theme: {
    toDark: string;
    toLight: string;
  };
}

export const TRANSLATIONS: Record<AppLang, TranslationDict> = {
  ru: {
    nav: {
      events: 'Ивенты',
      leagues: 'Лиги',
      clanRatings: 'Рейтинг кланов',
      playerRatings: 'Рейтинг игроков',
      createEvent: 'Создать ивент',
      login: 'Войти',
      profile: 'профиль'
    },
    eventsPage: {
      titleActive: 'Активные ивенты',
      tabs: {
        all: 'Все',
        scrim: 'Кланвары',
        pickup: 'Миксы'
      },
      allModes: 'Все режимы',
      statusFilters: {
        all: 'Все',
        live: 'В игре',
        registration: 'Регистрация',
        upcoming: 'Скоро'
      },
      searchPlaceholder: 'Поиск...',
      votesLabel: (count) => `голосов: ${count}`,
      defaultMap: 'по умолчанию',
      emptyTitle: 'Ивенты не найдены',
      emptySubtitle: 'Сбросьте фильтры или создайте новый матч.'
    },
    statuses: {
      liveMap: (mapNumber) => `Играют карту №${mapNumber}`,
      registration: 'Регистрация',
      upcoming: 'Скоро'
    },
    gameModes: {
      RAAS: 'RAAS',
      INVASION: 'Invasion',
      AAS: 'AAS',
      SKIRMISH: 'Skirmish'
    },
    leaguesPage: {
      title: 'Турнирные лиги',
      devBadge: 'В разработке',
      devText: 'Раздел турнирных лиг находится в разработке.',
      backToEvents: 'Перейти к ивентам'
    },
    createModal: {
      title: 'Создать ивент',
      creating: 'Создание ивента...',
      nameLabel: 'Название ивента',
      namePlaceholder: 'Operation Gorodok',
      startMapLabel: 'Стартовая карта (1-я в пуле)',
      formatLabel: 'Формат',
      modeLabel: 'Режим игры',
      categoryLabel: 'Категория',
      categoryScrim: 'Кланвар (Scrim)',
      categoryPickup: 'Микс-битва (Pickup)',
      submit: 'Опубликовать'
    },
    clanRatingsPage: {
      title: 'Рейтинг кланов',
      searchPlaceholder: 'Поиск по тегу или названию...',
      empty: 'Кланы не найдены',
      columns: {
        rank: '#',
        clan: 'Клан',
        mmr: 'MMR',
        matches: 'Матчи',
        winRate: 'Победы',
        ticketDelta: 'Тикеты (ср.)'
      }
    },
    playerRatingsPage: {
      title: 'Рейтинг игроков',
      searchPlaceholder: 'Поиск по никнейму или клан-тегу...',
      empty: 'Игроки не найдены',
      columns: {
        rank: '#',
        player: 'Игрок',
        clan: 'Клан',
        elo: 'ELO',
        matches: 'Матчи',
        winRate: 'Победы',
        kd: 'K/D'
      }
    },
    lobbyPage: {
      backToEvents: 'Назад к ивентам',
      creator: 'Организатор',
      gameServer: 'Игровой сервер',
      serverOnline: 'Онлайн',
      copy: 'Копировать',
      copied: 'Скопировано',
      commander: 'Командир стороны',
      squadsFormed: 'Отделений сформировано',
      yourSlot: 'Ваш слот',
      joinSide: 'Присоединиться к стороне',
      joinedSide: 'Вы в составе стороны',
      sideLabel: (idx) => `Сторона ${idx}`
    },
    authPage: {
      backToEvents: 'К ивентам',
      registerTab: 'Регистрация',
      loginTab: 'Вход',
      syncing: 'Синхронизация профиля...',
      emailLabel: 'Email',
      emailPlaceholder: 'hello@squadbit.gg',
      usernameLabel: 'Имя профиля',
      usernamePlaceholder: 'Ваш игровой никнейм',
      passwordLabel: 'Пароль',
      passwordPlaceholder: 'Установите пароль профиля',
      confirmPasswordLabel: 'Подтверждение пароля',
      confirmPasswordPlaceholder: 'Повторите пароль',
      passwordMatch: 'Совпадает',
      submitRegister: 'Зарегистрироваться',
      submitLogin: 'Войти',
      haveAccount: 'Уже есть аккаунт?',
      noAccount: 'Нет аккаунта?',
      orDivider: 'или',
      steamRegister: 'Регистрация через Steam',
      steamLogin: 'Войти через Steam',
      steamHint:
        'При регистрации через Steam будет выдан начальный рейтинг в зависимости от опыта в игре',
      errors: {
        shortPassword: 'Пароль должен содержать не менее 6 символов',
        passwordMismatch: 'Пароли не совпадают'
      },
      session: {
        title: 'Профиль авторизован',
        initialRating: 'Начальный рейтинг',
        squadHours: (hours) => `${hours} ч в Squad`,
        copy: 'Копировать',
        copied: 'Скопировано',
        toEvents: 'К ивентам',
        logout: 'Выйти'
      },
      footer: {
        onlineOperators: 'В сети',
        totalProfiles: 'Профилей'
      }
    },
    theme: {
      toDark: 'Тёмная тема',
      toLight: 'Светлая тема'
    }
  },
  en: {
    nav: {
      events: 'Events',
      leagues: 'Leagues',
      clanRatings: 'Clan Ratings',
      playerRatings: 'Player Ratings',
      createEvent: 'Create event',
      login: 'Sign in',
      profile: 'profile'
    },
    eventsPage: {
      titleActive: 'Active Events',
      tabs: {
        all: 'All',
        scrim: 'Scrims',
        pickup: 'Pickups'
      },
      allModes: 'All modes',
      statusFilters: {
        all: 'All',
        live: 'In game',
        registration: 'Registration',
        upcoming: 'Upcoming'
      },
      searchPlaceholder: 'Search...',
      votesLabel: (count) => `votes: ${count}`,
      defaultMap: 'default',
      emptyTitle: 'No events found',
      emptySubtitle: 'Reset filters or create a new match.'
    },
    statuses: {
      liveMap: (mapNumber) => `Playing map #${mapNumber}`,
      registration: 'Registration',
      upcoming: 'Upcoming'
    },
    gameModes: {
      RAAS: 'RAAS',
      INVASION: 'Invasion',
      AAS: 'AAS',
      SKIRMISH: 'Skirmish'
    },
    leaguesPage: {
      title: 'Tournament Leagues',
      devBadge: 'In development',
      devText: 'Tournament leagues section is currently in development.',
      backToEvents: 'Back to events'
    },
    createModal: {
      title: 'Create event',
      creating: 'Creating event...',
      nameLabel: 'Event title',
      namePlaceholder: 'Operation Gorodok',
      startMapLabel: 'Starting map (1st in pool)',
      formatLabel: 'Format',
      modeLabel: 'Game mode',
      categoryLabel: 'Category',
      categoryScrim: 'Clanwar (Scrim)',
      categoryPickup: 'Pickup 50v50',
      submit: 'Publish'
    },
    clanRatingsPage: {
      title: 'Clan Ratings',
      searchPlaceholder: 'Search by tag or clan name...',
      empty: 'No clans found',
      columns: {
        rank: '#',
        clan: 'Clan',
        mmr: 'MMR',
        matches: 'Matches',
        winRate: 'Winrate',
        ticketDelta: 'Avg. tickets'
      }
    },
    playerRatingsPage: {
      title: 'Player Ratings',
      searchPlaceholder: 'Search by nickname or clan tag...',
      empty: 'No players found',
      columns: {
        rank: '#',
        player: 'Player',
        clan: 'Clan',
        elo: 'ELO',
        matches: 'Matches',
        winRate: 'Winrate',
        kd: 'K/D'
      }
    },
    lobbyPage: {
      backToEvents: 'Back to events',
      creator: 'Organizer',
      gameServer: 'Game server',
      serverOnline: 'Online',
      copy: 'Copy',
      copied: 'Copied',
      commander: 'Side commander',
      squadsFormed: 'Squads formed',
      yourSlot: 'Your slot',
      joinSide: 'Join side',
      joinedSide: 'Joined side',
      sideLabel: (idx) => `Side ${idx}`
    },
    authPage: {
      backToEvents: 'Events',
      registerTab: 'Sign up',
      loginTab: 'Sign in',
      syncing: 'Syncing profile...',
      emailLabel: 'Email',
      emailPlaceholder: 'hello@squadbit.gg',
      usernameLabel: 'Profile name',
      usernamePlaceholder: 'Your in-game nickname',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Create a password',
      confirmPasswordLabel: 'Confirm password',
      confirmPasswordPlaceholder: 'Repeat password',
      passwordMatch: 'Matches',
      submitRegister: 'Create account',
      submitLogin: 'Sign in',
      haveAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      orDivider: 'or',
      steamRegister: 'Sign up with Steam',
      steamLogin: 'Sign in with Steam',
      steamHint:
        'Signing up via Steam assigns an initial rating based on your Squad playtime',
      errors: {
        shortPassword: 'Password must be at least 6 characters long',
        passwordMismatch: 'Passwords do not match'
      },
      session: {
        title: 'Profile authenticated',
        initialRating: 'Initial rating',
        squadHours: (hours) => `${hours}h in Squad`,
        copy: 'Copy',
        copied: 'Copied',
        toEvents: 'Go to events',
        logout: 'Sign out'
      },
      footer: {
        onlineOperators: 'Online',
        totalProfiles: 'Profiles'
      }
    },
    theme: {
      toDark: 'Dark theme',
      toLight: 'Light theme'
    }
  }
};
