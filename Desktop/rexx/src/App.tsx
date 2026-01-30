import { useState, lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings, BarChart3 } from 'lucide-react';
import { Timer } from './features/timer/Timer';
import { TodoList } from './features/todos/TodoList';
import { CinematicIntro } from './components/layout/CinematicIntro';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { SettingsModal } from './components/layout/SettingsModal';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { useSettingsStore } from './store/useSettingsStore';

// Lazy load StatsModal (includes Recharts - ~300kB)
const StatsModal = lazy(() => import('./components/layout/StatsModal').then(module => ({
  default: module.StatsModal
})));

function App() {
  const { currentTheme } = useSettingsStore();

  const [showIntro, setShowIntro] = useState(() => {
    const hasVisited = localStorage.getItem('rexx-visited');
    return !hasVisited;
  });

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const handleEnterZone = () => {
    localStorage.setItem('rexx-visited', 'true');
    setShowIntro(false);
  };

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        {showIntro && (
          <CinematicIntro key="intro" onEnter={handleEnterZone} />
        )}
      </AnimatePresence>

      <SettingsModal
        key={showSettings ? 'open' : 'closed'}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <Suspense fallback={<LoadingSpinner message="İstatistikler yükleniyor..." />}>
        <StatsModal
          key={showStats ? 'open-stats' : 'closed-stats'}
          isOpen={showStats}
          onClose={() => setShowStats(false)}
        />
      </Suspense>

      <div className="flex flex-col items-center w-full min-h-screen pt-20 px-4 bg-[#0A0A0A] text-[#E0E0E0]">
        <main className="w-full max-w-4xl flex flex-col gap-20">
          <motion.header
            className="flex flex-col items-center text-center relative"
            animate={{
              opacity: isFocusMode ? 0.3 : 1,
              filter: isFocusMode ? 'blur(2px)' : 'blur(0px)',
            }}
            transition={{ duration: 0.4 }}
          >
            {/* Action Buttons */}
            <div className="absolute right-0 top-0 flex gap-2">
              <motion.button
                onClick={() => setShowStats(true)}
                className="p-3 text-text-dim hover:text-accent transition-colors rounded-lg hover:bg-white/5"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="İstatistikleri aç"
              >
                <BarChart3 size={24} />
              </motion.button>

              <motion.button
                onClick={() => setShowSettings(true)}
                className="p-3 text-text-dim hover:text-accent transition-colors rounded-lg hover:bg-white/5"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Ayarları aç"
              >
                <Settings size={24} />
              </motion.button>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
              Rexx <span className="text-accent">Focus</span>
            </h1>
            <p className="text-text-dim max-w-md">
              Odağını koru, hedeflerine ulaş. Sade ve etkili bir çalışma deneyimi.
            </p>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <section className="flex justify-center">
              <Timer onFocusChange={setIsFocusMode} />
            </section>

            <section className="h-full">
              <TodoList isFocusMode={isFocusMode} />
            </section>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
