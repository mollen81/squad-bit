import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TournamentsPage } from '@/pages/tournaments/TournamentsPage';
import { LeaguesPage } from '@/pages/leagues/LeaguesPage';
import { RatingsPage } from '@/pages/ratings/RatingsPage';
import { PlayerRatingsPage } from '@/pages/ratings/PlayerRatingsPage';
import { EventLobbyPage } from '@/pages/events/EventLobbyPage';
import { AuthPage } from '@/pages/auth/AuthPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TournamentsPage />} />
        <Route path="/events" element={<TournamentsPage />} />
        <Route path="/events/:id" element={<EventLobbyPage />} />
        <Route path="/leagues" element={<LeaguesPage />} />
        <Route path="/ratings" element={<RatingsPage />} />
        <Route path="/ratings/players" element={<PlayerRatingsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/events" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
