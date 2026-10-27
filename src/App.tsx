import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Statement from './components/Statement';
import Reveal from './components/Reveal';
import Portfolio from './pages/Portfolio';
import About from './pages/About';

function App() {
  useEffect(() => {
    document.title = "Alief Lutfa'ul Ridho — Visual Artist";
  }, []);

  return (
    <div className="app">
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