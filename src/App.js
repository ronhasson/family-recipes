import './App.css';
import { Routes, Route } from "react-router-dom";
import Recipes from './routes/Recipes.jsx';
import Groups from './routes/Groups';
import Header from './components/header';
import Profile from './routes/Profile';
import { useEffect } from 'react';

function App() {
  function resize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener("resize", resize);
    }
  }, [])

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Recipes />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
