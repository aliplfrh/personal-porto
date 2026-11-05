import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { LogIn } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AmbientBackground from './components/AmbientBackground';
import Hero from './components/Hero';
import Statement from './components/Statement';
import Reveal from './components/Reveal';
import About from './pages/About';
import WorksIndex from './pages/WorksIndex';
import WorkDetail from './pages/WorkDetail';
import Admin from './pages/Admin';
import { useSiteContent } from './content/SiteContentContext';
import useScrollProgress from './hooks/useScrollProgress';

const FALLBACK_TITLE = "Alief Lutfa'ul Ridho — Visual Artist";

const titles: Record<string, string> = {
  '/': FALLBACK_TITLE,
  '/portofolio': 'Works — Alief Lutfa\'ul Ridho',
};

function HomePage() {
  return (
    <>
      <section id="home" tabIndex={-1}>
        <Hero />
      </section>

      <Statement />

      <section id="about" tabIndex={-1}>
        <Reveal>
          <About />
        </Reveal>
      </section>
    </>
  );
}

function App() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const { content } = useSiteContent();
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  // Feeds --scroll-y / --scroll-progress to CSS for the parallax and rail.
  useScrollProgress();

  useEffect(() => {
    const slug = location.pathname.startsWith('/portofolio/')
      ? decodeURIComponent(location.pathname.replace('/portofolio/', ''))
      : null;
    const project = slug ? content.projects.find((p) => p.id === slug) : undefined;
    document.title = (project ? `${project.title} — Alief Lutfa'ul Ridho` : undefined)
      || titles[location.pathname]
      || FALLBACK_TITLE;
  }, [location.pathname, content.projects]);

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const id = location.hash.slice(1);
      // Give the homepage a tick to mount before measuring its layout.
      const timer = setTimeout(() => {
        const target = document.getElementById(id);
        target?.scrollIntoView({ behavior: 'smooth' });
        // Anchor jumps must also move focus, or keyboard/AT users stay at the top.
        target?.focus({ preventScroll: true });
      }, 50);
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  // Route changes swap the whole page under the user: move focus to the new
  // content so the next Tab press starts there instead of at the document root.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (location.hash) return;
    mainRef.current?.focus();
  }, [location.pathname, location.hash]);

  if (isAdmin) {
    return <Admin />;
  }

  return (
    <div className="app">
      <Link to="/admin" className="admin-entry-btn" aria-label="Admin login">
        <LogIn size={16} />
      </Link>

      <div className="scroll-progress" aria-hidden="true">
        <span className="scroll-progress-bar" />
      </div>

      <AmbientBackground />
      <Navbar />

      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait">
          <main id="main" ref={mainRef} tabIndex={-1}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/portofolio" element={<WorksIndex />} />
              <Route path="/portofolio/:slug" element={<WorkDetail />} />
            </Routes>
          </main>
        </AnimatePresence>
      </MotionConfig>

      <Footer />
    </div>
  );
}

export default App;
