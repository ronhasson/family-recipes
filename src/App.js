import './App.css';
import { Routes, Route, useLocation } from "react-router-dom";
import Recipes from './routes/Recipes.jsx';
import Groups from './routes/Groups';
import Header from './components/header';
import Profile from './routes/Profile';
import { createContext, Suspense, useEffect, useState } from 'react';
import { auth, db } from "./firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from 'react-firebase-hooks/firestore';
import { doc, getDoc, setDoc, query, collection, where } from "firebase/firestore";
import Loading from './components/loading';
import LoginScreen from './LoginScreen';
import RecipeForm from './routes/RecipeForm';
import Recipe from './routes/Recipe';
import DeleteRecipe from './components/DeleteRecipe';
import Group from './routes/Group';


export const UserContext = createContext();
export const GroupContext = createContext();

function App() {
  const [user, loading, error] = useAuthState(auth);
  let [q, setQ] = useState();
  const [groupSnapshot, gLoading, gError] = useCollection(q);

  let location = useLocation();

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
    resize();
  }, [location, user, groupSnapshot]);

  useEffect(() => {
    if (user) {
      const readUserData = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // console.log("Document data:", docSnap.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document! - user");
          setDoc(docRef, { name: user.displayName, email: user.email }, { merge: true });
        }
      }
      readUserData();

    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setQ(query(collection(db, "groups"), where("members", "array-contains", user.uid)));
    }
  }, [user])

  if (user && groupSnapshot) {
    return (
      <Suspense fallback={<Loading />}>
        <UserContext.Provider value={user}>
          <GroupContext.Provider value={groupSnapshot}>
            <div className="App">
              <Header />
              <Routes>
                <Route path="/" element={<Recipes />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/group/:id" element={<Group />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/editrecipe" element={<RecipeForm />} />
                <Route path="/editrecipe/:id" element={<RecipeForm />} />
                <Route path="/deleterecipe/:id" element={<DeleteRecipe />} />
                <Route path="/recipe/:id" element={<Recipe />} />
              </Routes>
            </div>
          </GroupContext.Provider>
        </UserContext.Provider>
      </Suspense>
    );
  } else {
    if (loading || gLoading) {
      return (<div className="App"><Loading /></div>);
    }
    if (error) {
      console.log(error);
    }
    if (gError) {
      console.log(gError);
    }
    return (<LoginScreen />);
  }

}

export default App;
