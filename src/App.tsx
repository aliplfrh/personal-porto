import { useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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

const titles: Record<string, string> = {
  '/': "Alief Lutfa'ul Ridho — Visual Artist",
  '/portofolio': 'Works — Alief Lutfa\'ul Ridho',
};

function HomePage() {
  return (
    <main id="main">
      <section id="home">
        <Hero />
      </section>

      <Statement />

      <section id="about">
        <Reveal>
          <About />
        </Reveal>
      </section>
    </main>
  );
}

function App() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  useEffect(() => {
    document.title = titles[location.pathname] || "Alief Lutfa'ul Ridho — Visual Artist";
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const id = location.hash.slice(1);
      // Give the homepage a tick to mount before measuring its layout.
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  if (isAdmin) {
    return <Admin />;
  }

  return (
    <div className="app">
      <Link to="/admin" className="admin-entry-btn" aria-label="Admin login">
        <LogIn size={16} />
      </Link>

      <AmbientBackground />
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/portofolio" element={<WorksIndex />} />
          <Route path="/portofolio/:slug" element={<WorkDetail />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default App;
