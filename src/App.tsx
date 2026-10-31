import { useEffect, useState } from 'react';
import { LogIn } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Statement from './components/Statement';
import Reveal from './components/Reveal';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Admin from './pages/Admin';

function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');

  useEffect(() => {
    document.title = "Alief Lutfa'ul Ridho — Visual Artist";
  }, []);

  useEffect(() => {
    const onHashChange = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (isAdmin) {
    return <Admin />;
  }

  return (
    <div className="app">
      <a href="#admin" className="admin-entry-btn" aria-label="Admin login">
        <LogIn size={16} />
      </a>

      <Navbar />

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

        <section id="portfolio">
          <Reveal>
            <Portfolio />
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;