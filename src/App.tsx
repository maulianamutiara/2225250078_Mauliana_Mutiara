import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { TopicScreen } from './screens/TopicScreen';

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true };

// HashRouter dipakai agar navigasi tetap jalan di Android (Capacitor) dan hosting statis.
export default function App() {
  return (
    <HashRouter future={routerFuture}>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/beranda" element={<HomeScreen />} />
        <Route path="/topik/:id" element={<TopicScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
