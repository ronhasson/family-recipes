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
export const InvitesContext = createContext();

function App() {
  const [user, loading, error] = useAuthState(auth);
  let [q, setQ] = useState();
  const [groupSnapshot, gLoading, gError] = useCollection(q);
  let [inviteQ, setInvQ] = useState();
  const [invitesSnapshot, iLoading, iError] = useCollection(inviteQ);

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
    if (user && user.displayName) {
      console.log(user.displayName);
      const readUserData = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // console.log("Document data:", docSnap.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document! - user");
          await setDoc(docRef, { name: user.displayName, email: user.email }, { merge: true });
        }
        const docPremRef2 = doc(db, "users", user.uid, "private", "groups");
        const docSnap2 = await getDoc(docPremRef2);
        if (docSnap2.exists()) {
          // console.log("Document data:", docSnap.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document! - group prem");
          await setDoc(docPremRef2, { groups: [] }, { merge: true });
        }
      }
      //its in setTimeout bc when user will be loaded, user.displayName will be loaded in a delay (but the user.email will be fine for some reason)
      setTimeout(readUserData, 10);
      //readUserData();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setQ(query(collection(db, "groups"), where("members", "array-contains", user.uid)));
      setInvQ(collection(db, "users", user.uid, "invites"));
    }
  }, [user])

  if (user && groupSnapshot) {
    return (
      <Suspense fallback={<Loading />}>
        <UserContext.Provider value={user}>
          <GroupContext.Provider value={groupSnapshot}>
            <InvitesContext.Provider value={invitesSnapshot}>
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
            </InvitesContext.Provider>
          </GroupContext.Provider>
        </UserContext.Provider>
      </Suspense>
    );
  } else {
    if (loading || gLoading || iLoading) {
      return (<div className="App"><Loading /></div>);
    }
    if (error) {
      console.log(error);
    }
    if (gError) {
      console.log(gError);
    }
    if (iError) {
      console.log(iError);
    }
    return (<LoginScreen />);
  }

}

export default App;
