import { useState, useMemo, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  User,
  Lock,
  Eye,
  EyeClosed,
  CheckCircle,
  ShieldCheck,
  Terminal,
  Copy,
  Check,
  Refresh,
  Star,
  Group,
  SunLight,
  HalfMoon,
  NavArrowLeft
} from 'iconoir-react';
import { Loading } from 'loading-dev';
import { KeycapLogo } from '@/graphics/logo/KeycapLogo';
import { SoldierCanvas } from '@/graphics/scenes/SoldierCanvas';
import { SteamIcon } from '@/shared/ui/SteamIcon';
import { UserAvatar } from '@/shared/ui/UserAvatar';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { usePreferencesStore } from '@/shared/store/usePreferencesStore';
import { TRANSLATIONS } from '@/shared/i18n/translations';

type AuthErrorKey = 'shortPassword' | 'passwordMismatch' | null;

export function AuthPage() {
  const navigate = useNavigate();
  const { theme, lang, toggleTheme, setLang } = usePreferencesStore();
  const t = TRANSLATIONS[lang];

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorKey, setErrorKey] = useState<AuthErrorKey>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token, currentUser, isAuthenticated, setSession, clearSession } = useAuthStore();

  const securityBits = useMemo(() => {
    if (!password) return 0;
    let bits = 0;
    if (password.length >= 8) bits++;
    if (/[A-ZА-Я]/.test(password) && /[a-zа-я]/.test(password)) bits++;
    if (/\d/.test(password)) bits++;
    if (/[^A-Za-zА-Яа-я0-9]/.test(password) || password.length >= 12) bits++;
    return bits;
  }, [password]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorKey(null);

    if (mode === 'register') {
      if (password.length < 6) {
        setErrorKey('shortPassword');
        return;
      }
      if (password !== confirmPassword) {
        setErrorKey('passwordMismatch');
        return;
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const cleanName =
        mode === 'register'
          ? username.trim() || email.split('@')[0] || 'operator_bit'
          : email.split('@')[0] || 'operator_bit';

      const generatedUuid = 'c4f92e10-80d5-49e5-9c84-18c668615b31';
      const jwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI${generatedUuid.slice(0, 8)}iLCJ1c2VybmFtZSI6Ii${cleanName}iLCJyb2xlIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzYyNDIwMDAwfQ.squad_bit_sig_9f8a7b`;

      setSession(jwt, {
        id: generatedUuid,
        username: cleanName,
        email: email || 'hello@squadbit.gg',
        steamId: null,
        role: 'ROLE_USER',
        rating: 1000
      });
      setIsSubmitting(false);
    }, 650);
  };

  const handleSteamAuth = () => {
    setErrorKey(null);
    setIsSubmitting(true);
    setTimeout(() => {
      const steamUuid = '7b8b4a20-12ab-4de0-8e11-aa9812bc4433';
      const jwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI${steamUuid.slice(0, 8)}iLCJzdGVhbUlkIjoiNzY1NjExOTgwODQyMTk1MDEiLCJyb2xlIjoiUk9MRV9VU0VSIiwicmF0aW5nIjoxNzg1fQ.steam_edge_jwt_44c1`;

      setSession(jwt, {
        id: steamUuid,
        username: username.trim() || 'TRACT_Actual',
        email: email || 'steam_verified@squadbit.gg',
        steamId: '76561198084219501',
        role: 'ROLE_USER',
        squadHours: 1420,
        rating: 1785
      });
      setIsSubmitting(false);
    }, 650);
  };

  const handleCopyJwt = () => {
    if (!token) return;
    navigator.clipboard?.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 1800);
  };

  const hasActiveSession = isAuthenticated && currentUser && token;

  return (
    <div className="min-h-screen lg:h-screen w-screen bg-[#FFFFFF] dark:bg-[#0E0E0E] text-[#111111] dark:text-[#EDEDED] lg:overflow-hidden selection:bg-[#111111] selection:text-white dark:selection:bg-white dark:selection:text-black select-none transition-colors duration-150">
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12">
        {/* ЛЕВАЯ КОЛОНКА: ФОРМА АВТОРИЗАЦИИ */}
        <div className="lg:col-span-5 flex flex-col justify-between px-6 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-9 bg-[#FFFFFF] dark:bg-[#0E0E0E] z-10 border-b lg:border-b-0 lg:border-r border-[#E2E2E2] dark:border-[#1F1F1F] overflow-y-auto">
          {/* Верхняя панель: логотип SB + назад к ивентам + RU/EN + тема */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <KeycapLogo width={42} height={34} label="SB" />
              <span className="text-[18px] font-bold tracking-tight text-[#111111] dark:text-white leading-none">
                squad bit
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="h-8 px-2.5 rounded-[4px] bg-[#F4F4F4] dark:bg-[#141414] hover:bg-[#EAEAEA] dark:hover:bg-[#1E1E1E] border border-[#DCDCDC] dark:border-[#282828] text-[12px] font-semibold text-[#555555] dark:text-[#CCCCCC] hover:text-[#111111] dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <NavArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.authPage.backToEvents}</span>
              </button>

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

              {/* Переключатель темы */}
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
            </div>
          </div>

          {/* Центральный блок формы */}
          <div className="my-auto py-8 w-full max-w-[490px] mx-auto">
            {isSubmitting ? (
              <div className="py-16 flex flex-col items-center justify-center gap-4 bg-[#FAFAFA] dark:bg-[#121212] border border-[#E2E2E2] dark:border-[#262626] rounded-[4px]">
                <Loading />
                <span className="text-[14px] font-semibold text-[#555555] dark:text-[#A8A8A8]">
                  {t.authPage.syncing}
                </span>
              </div>
            ) : !hasActiveSession ? (
              <>
                {/* Переключатель Регистрация / Вход */}
                <div className="grid grid-cols-2 bg-[#F4F4F4] dark:bg-[#141414] border border-[#DCDCDC] dark:border-[#262626] p-1 rounded-[4px] mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorKey(null);
                    }}
                    className={`h-10 text-[14px] font-semibold transition-colors rounded-[3px] cursor-pointer ${
                      mode === 'register'
                        ? 'bg-white dark:bg-[#282828] text-[#111111] dark:text-white shadow-2xs'
                        : 'text-[#666666] dark:text-[#7A7A7A] hover:text-[#111111] dark:hover:text-[#DCDCDC]'
                    }`}
                  >
                    {t.authPage.registerTab}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorKey(null);
                    }}
                    className={`h-10 text-[14px] font-semibold transition-colors rounded-[3px] cursor-pointer ${
                      mode === 'login'
                        ? 'bg-white dark:bg-[#282828] text-[#111111] dark:text-white shadow-2xs'
                        : 'text-[#666666] dark:text-[#7A7A7A] hover:text-[#111111] dark:hover:text-[#DCDCDC]'
                    }`}
                  >
                    {t.authPage.loginTab}
                  </button>
                </div>

                {errorKey && (
                  <div className="mb-5 px-4 py-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/70 text-red-700 dark:text-red-300 text-[13.5px] font-medium rounded-[4px]">
                    {t.authPage.errors[errorKey]}
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[14px] font-semibold text-[#111111] dark:text-[#E5E5E5] mb-2">
                      {t.authPage.emailLabel}
                    </label>
                    <div className="relative">
                      <Mail className="w-[18px] h-[18px] text-[#888888] dark:text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.authPage.emailPlaceholder}
                        className="w-full h-12 pl-11 pr-4 bg-[#F5F5F5] dark:bg-[#161616] border border-[#DCDCDC] dark:border-[#282828] focus:border-[#111111] dark:focus:border-[#666666] focus:bg-[#FFFFFF] dark:focus:bg-[#1A1A1A] focus:outline-none text-[15px] text-[#111111] dark:text-white placeholder:text-[#8C8C8C] dark:placeholder:text-[#555555] rounded-[4px] transition-colors"
                      />
                    </div>
                  </div>

                  {mode === 'register' && (
                    <div>
                      <label className="block text-[14px] font-semibold text-[#111111] dark:text-[#E5E5E5] mb-2">
                        {t.authPage.usernameLabel}
                      </label>
                      <div className="relative">
                        <User className="w-[18px] h-[18px] text-[#888888] dark:text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder={t.authPage.usernamePlaceholder}
                          className="w-full h-12 pl-11 pr-4 bg-[#F5F5F5] dark:bg-[#161616] border border-[#DCDCDC] dark:border-[#282828] focus:border-[#111111] dark:focus:border-[#666666] focus:bg-[#FFFFFF] dark:focus:bg-[#1A1A1A] focus:outline-none text-[15px] text-[#111111] dark:text-white placeholder:text-[#8C8C8C] dark:placeholder:text-[#555555] rounded-[4px] transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[14px] font-semibold text-[#111111] dark:text-[#E5E5E5] mb-2">
                      {t.authPage.passwordLabel}
                    </label>
                    <div className="relative">
                      <Lock className="w-[18px] h-[18px] text-[#888888] dark:text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t.authPage.passwordPlaceholder}
                        className="w-full h-12 pl-11 pr-11 bg-[#F5F5F5] dark:bg-[#161616] border border-[#DCDCDC] dark:border-[#282828] focus:border-[#111111] dark:focus:border-[#666666] focus:bg-[#FFFFFF] dark:focus:bg-[#1A1A1A] focus:outline-none text-[15px] text-[#111111] dark:text-white placeholder:text-[#8C8C8C] dark:placeholder:text-[#555555] rounded-[4px] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#111111] dark:hover:text-[#DEDEDE] transition-colors cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeClosed className="w-[18px] h-[18px]" />
                        ) : (
                          <Eye className="w-[18px] h-[18px]" />
                        )}
                      </button>
                    </div>

                    {mode === 'register' && password.length > 0 && (
                      <div className="mt-2.5 grid grid-cols-4 gap-1.5 h-[4px]">
                        {[1, 2, 3, 4].map((segment) => (
                          <div
                            key={segment}
                            className={`h-full rounded-[2px] transition-colors ${
                              segment <= securityBits
                                ? 'bg-[#111111] dark:bg-white'
                                : 'bg-[#E2E2E2] dark:bg-[#262626]'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {mode === 'register' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[14px] font-semibold text-[#111111] dark:text-[#E5E5E5]">
                          {t.authPage.confirmPasswordLabel}
                        </label>
                        {confirmPassword.length > 0 && password === confirmPassword && (
                          <span className="text-[12.5px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> {t.authPage.passwordMatch}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="w-[18px] h-[18px] text-[#888888] dark:text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder={t.authPage.confirmPasswordPlaceholder}
                          className="w-full h-12 pl-11 pr-4 bg-[#F5F5F5] dark:bg-[#161616] border border-[#DCDCDC] dark:border-[#282828] focus:border-[#111111] dark:focus:border-[#666666] focus:bg-[#FFFFFF] dark:focus:bg-[#1A1A1A] focus:outline-none text-[15px] text-[#111111] dark:text-white placeholder:text-[#8C8C8C] dark:placeholder:text-[#555555] rounded-[4px] transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full h-12 bg-[#111111] dark:bg-white hover:bg-[#2A2A2A] dark:hover:bg-[#E5E5E5] text-white dark:text-[#0A0A0A] text-[15px] font-semibold rounded-[4px] transition-colors cursor-pointer"
                    >
                      {mode === 'register' ? t.authPage.submitRegister : t.authPage.submitLogin}
                    </button>
                  </div>
                </form>

                <div className="mt-4 text-center">
                  {mode === 'register' ? (
                    <p className="text-[13.5px] text-[#666666] dark:text-[#808080]">
                      {t.authPage.haveAccount}{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setErrorKey(null);
                        }}
                        className="text-[#111111] dark:text-[#CCCCCC] font-semibold hover:underline underline-offset-4 transition-colors cursor-pointer"
                      >
                        {t.authPage.loginTab}
                      </button>
                    </p>
                  ) : (
                    <p className="text-[13.5px] text-[#666666] dark:text-[#808080]">
                      {t.authPage.noAccount}{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('register');
                          setErrorKey(null);
                        }}
                        className="text-[#111111] dark:text-[#CCCCCC] font-semibold hover:underline underline-offset-4 transition-colors cursor-pointer"
                      >
                        {t.authPage.registerTab}
                      </button>
                    </p>
                  )}
                </div>

                <div className="relative my-6 flex items-center justify-center">
                  <div className="w-full border-t border-[#E5E5E5] dark:border-[#222222]" />
                  <span className="px-3.5 bg-[#FFFFFF] dark:bg-[#0E0E0E] text-[13px] font-medium text-[#777777] dark:text-[#666666]">
                    {t.authPage.orDivider}
                  </span>
                  <div className="w-full border-t border-[#E5E5E5] dark:border-[#222222]" />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleSteamAuth}
                    className="w-full h-12 bg-[#FAFAFA] dark:bg-[#141414] hover:bg-[#EFEFEF] dark:hover:bg-[#1C1C1C] border border-[#DCDCDC] dark:border-[#2C2C2C] hover:border-[#A8A8A8] dark:hover:border-[#444444] text-[#111111] dark:text-white text-[14.5px] font-semibold rounded-[4px] flex items-center justify-center gap-3 transition-colors cursor-pointer"
                  >
                    <SteamIcon className="w-5 h-5" />
                    <span>
                      {mode === 'register' ? t.authPage.steamRegister : t.authPage.steamLogin}
                    </span>
                  </button>

                  <p className="mt-3 text-[12.5px] text-[#777777] dark:text-[#7A7A7A] text-center leading-relaxed">
                    {t.authPage.steamHint}
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-[#FAFAFA] dark:bg-[#121212] border border-[#E2E2E2] dark:border-[#282828] p-6 rounded-[4px] space-y-5">
                <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#222222] pb-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar username={currentUser.username} size="md" />
                    <div>
                      <div className="text-[15px] font-bold text-[#111111] dark:text-white">
                        {currentUser.username}
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-emerald-700 dark:text-emerald-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{t.authPage.session.title}</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[11.5px] font-bold px-2 py-0.5 bg-[#EFEFEF] dark:bg-[#1D1D1D] border border-[#DCDCDC] dark:border-[#303030] text-[#444444] dark:text-[#CCCCCC] rounded-[3px]">
                    200 OK
                  </span>
                </div>

                <div className="space-y-2.5 text-[13.5px]">
                  <div className="flex justify-between gap-2">
                    <span className="text-[#666666] dark:text-[#777777]">ID</span>
                    <span className="font-mono text-[#111111] dark:text-[#DEDEDE]">
                      {currentUser.id.slice(0, 18)}...
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#666666] dark:text-[#777777]">Role</span>
                    <span className="font-mono text-[#111111] dark:text-[#CCCCCC] font-semibold">
                      {currentUser.role}
                    </span>
                  </div>
                  {currentUser.steamId && (
                    <div className="flex justify-between gap-2">
                      <span className="text-[#666666] dark:text-[#777777]">SteamID</span>
                      <span className="font-mono text-[#111111] dark:text-[#DEDEDE]">
                        {currentUser.steamId}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between gap-2 pt-2.5 border-t border-[#EAEAEA] dark:border-[#1F1F1F]">
                    <span className="text-[#666666] dark:text-[#777777]">
                      {t.authPage.session.initialRating}
                    </span>
                    <span className="font-mono text-[#111111] dark:text-white font-bold flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-[#666666] dark:text-[#CCCCCC]" />
                      {currentUser.rating} ELO
                      {currentUser.squadHours
                        ? ` (${t.authPage.session.squadHours(currentUser.squadHours)})`
                        : ''}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[12px] text-[#666666] dark:text-[#777777] mb-1.5">
                    <span className="font-mono flex items-center gap-1.5 font-semibold">
                      <Terminal className="w-3.5 h-3.5" /> Bearer token
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyJwt}
                      className="text-[#555555] dark:text-[#AAAAAA] hover:text-[#111111] dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer font-semibold"
                    >
                      {copiedToken ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          {t.authPage.session.copied}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> {t.authPage.session.copy}
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono p-3 bg-white dark:bg-[#0B0B0B] border border-[#E2E2E2] dark:border-[#222222] text-[11.5px] text-[#555555] dark:text-[#999999] break-all leading-relaxed rounded-[3px]">
                    {token}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => navigate('/events')}
                    className="w-full h-11 bg-[#111111] dark:bg-white hover:bg-[#2A2A2A] dark:hover:bg-[#E5E5E5] text-white dark:text-[#0A0A0A] text-[14px] font-semibold rounded-[4px] transition-colors cursor-pointer"
                  >
                    {t.authPage.session.toEvents}
                  </button>
                  <button
                    type="button"
                    onClick={clearSession}
                    className="w-full h-11 bg-white dark:bg-[#1A1A1A] hover:bg-[#EFEFEF] dark:hover:bg-[#242424] border border-[#DCDCDC] dark:border-[#2E2E2E] text-[14px] text-[#111111] dark:text-white font-semibold flex items-center justify-center gap-2 rounded-[4px] transition-colors cursor-pointer"
                  >
                    <Refresh className="w-4 h-4" />
                    <span>{t.authPage.session.logout}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Нижняя строка статистики */}
          <div className="pt-4 border-t border-[#ECECEC] dark:border-[#1A1A1A] flex items-center justify-between text-[12.5px] text-[#666666] dark:text-[#737373]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <Group className="w-4 h-4 text-[#888888]" />
              <span>
                {t.authPage.footer.onlineOperators}:{' '}
                <strong className="font-mono text-[#111111] dark:text-[#DEDEDE] font-bold">
                  1,420
                </strong>
              </span>
            </div>
            <span>
              {t.authPage.footer.totalProfiles}:{' '}
              <strong className="font-mono text-[#111111] dark:text-[#CCCCCC] font-bold">
                18,940
              </strong>
            </span>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: DOT-MATRIX БОЕЦ (АДАПТИРУЕТСЯ ПОД СВЕТЛУЮ И ТЁМНУЮ ТЕМЫ) */}
        <div className="lg:col-span-7 relative min-h-[420px] lg:min-h-full bg-[#F7F7F7] dark:bg-[#0E0E0E] overflow-hidden">
          <div className="w-full h-full invert contrast-[1.12] mix-blend-multiply dark:invert-0 dark:contrast-100 dark:mix-blend-normal">
            <SoldierCanvas />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
