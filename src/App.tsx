import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Portfolio from './pages/Portfolio';
import About from './pages/About';

function App() {
  useEffect(() => {
    document.title = 'aliplfrh';
  }, []);

  return (
    <div className="app">
      <Navbar />
      
      <main>
        <section id="home">
          <Hero />
        </section>
        
        <section id="about">
          <About />
        </section>
        
        <section id="portfolio">
          <Portfolio />
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;