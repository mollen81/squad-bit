import { useSyncExternalStore } from 'react';

export type ThemeMode = 'light' | 'dark';
export type AppLang = 'ru' | 'en';

interface PreferencesState {
  theme: ThemeMode;
  lang: AppLang;
}

const THEME_KEY = 'squadbit_theme';
const LANG_KEY = 'squadbit_lang';

function readInitialState(): PreferencesState {
  if (typeof window === 'undefined') {
    return { theme: 'light', lang: 'ru' };
  }
  const savedTheme = localStorage.getItem(THEME_KEY);
  const savedLang = localStorage.getItem(LANG_KEY);

  const theme: ThemeMode = savedTheme === 'dark' ? 'dark' : 'light';
  const lang: AppLang = savedLang === 'en' ? 'en' : 'ru';

  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.lang = lang;

  return { theme, lang };
}

let state: PreferencesState = readInitialState();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function setTheme(nextTheme: ThemeMode) {
  if (state.theme === nextTheme) return;
  state = { ...state, theme: nextTheme };
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_KEY, nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  }
  emit();
}

export function toggleTheme() {
  setTheme(state.theme === 'light' ? 'dark' : 'light');
}

export function setLang(nextLang: AppLang) {
  if (state.lang === nextLang) return;
  state = { ...state, lang: nextLang };
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANG_KEY, nextLang);
    document.documentElement.lang = nextLang;
  }
  emit();
}

export function toggleLang() {
  setLang(state.lang === 'ru' ? 'en' : 'ru');
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function usePreferencesStore() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    theme: snapshot.theme,
    lang: snapshot.lang,
    setTheme,
    toggleTheme,
    setLang,
    toggleLang
  };
}
