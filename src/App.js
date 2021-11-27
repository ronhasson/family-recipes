import './App.css';
import { Routes, Route } from "react-router-dom";
import Recipes from './routes/Recipes.jsx';
import Groups from './routes/Groups';
import Header from './components/header';
import Profile from './routes/Profile';
import { createContext, Suspense, useEffect } from 'react';
import { auth, db } from "./firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Loading from './components/loading';
import LoginScreen from './LoginScreen';
import RecipeForm from './routes/RecipeForm';
import Recipe from './routes/Recipe';

export const UserContext = createContext();

function App() {
  const [user, loading, error] = useAuthState(auth);

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

  useEffect(() => {
    if (user) {
      const readUserData = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          setDoc(docRef, { name: user.displayName, email: user.email }, { merge: true });
        }
      }
      readUserData();

    }
  }, [user]);


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
              <Route path="/editrecipe" element={<RecipeForm />} />
              <Route path="/editrecipe/:id" element={<RecipeForm />} />
              <Route path="/recipe/:id" element={<Recipe />} />
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
