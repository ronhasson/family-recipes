import './App.css';
import { Routes, Route } from "react-router-dom";
import Recipes from './routes/Recipes.jsx';
import Groups from './routes/Groups';
import Header from './components/header';
import Profile from './routes/Profile';
import { createContext, Suspense, useEffect } from 'react';
import { auth } from "./firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from './components/loading';
import LoginScreen from './LoginScreen';

export const UserContext = createContext();

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
  }, []);

  const [user, loading, error] = useAuthState(auth);
  if (user) {
    return (
      <Suspense fallback={<Loading />}>
        <UserContext.Provider value={user}>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Recipes />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </UserContext.Provider>
      </Suspense>
    );
  } else {
    if (loading) {
      return (<Loading />);
    }
    if (error) {
      console.log(error);
    }
    return (<LoginScreen />);
  }

}

export default App;
