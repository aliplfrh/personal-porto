import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
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
    <BrowserRouter>
      <div className="relative bg-dark-bg min-h-screen">
        {/* Global background with red and blue gradient */}
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-900 via-black to-red-900 opacity-80"
            style={{
              backgroundImage: `
                radial-gradient(circle at top right, rgba(29, 78, 216, 0.15), transparent 60%),
                radial-gradient(circle at bottom left, rgba(220, 38, 38, 0.15), transparent 60%)
              `
            }}
          />
          <div className="absolute inset-0 backdrop-blur-[100px]" />
        </div>

        <div className="relative z-10">
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
      </div>
    </BrowserRouter>
  );
}

export default App;