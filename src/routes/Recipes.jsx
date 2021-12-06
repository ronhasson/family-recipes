import Avatar from "../components/avatar";
import GroupAvatar from "../components/groupAvatar";
import RecipeCard from "../components/recipeCard";
import "./recipes.css";
import { db } from "../firebase";
import { collection, query, where } from "firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';
import { UserContext, GroupContext } from "../App.js";
import { useContext } from "react";
import { useEffect, useState } from "react/cjs/react.development";

export default function Recipes() {
    const user = useContext(UserContext);
    const groups = useContext(GroupContext);
    let groupsid = groups.docs.map(doc => doc.id);
    //console.log(groupsid);

    const q = query(collection(db, "recipes"), where("owner", "==", user.uid));
    const [snapshot, loading, error] = useCollection(q);
    const q2 = query(collection(db, "recipes"), where("sharedWith", "array-contains-any", groupsid));
    const [snapshot2, loading2, error2] = useCollection(q2);
    const [comboSnapshot, setComboSnaphot] = useState([]);
    console.log(snapshot);
    console.log(snapshot2);
    useEffect(() => {
        if (error) {
            console.log(error)
        }
        if (error2) {
            console.log(error2)
        }
        if (snapshot && snapshot2) {
            let temp = snapshot.docs.concat(snapshot2.docs);
            console.log(temp);
            console.log(temp.map(doc => doc.id));
            var flags = {};
            var newTemp = temp.filter(function (entry) {
                if (flags[entry.id]) {
                    return false;
                }
                flags[entry.id] = true;
                return true;
            });
            console.log(newTemp);
            console.log(newTemp.map(doc => doc.id));

            setComboSnaphot(newTemp);
        }
    }, [snapshot, snapshot2])

    return (
        <main className="recipesPage">
            <div className="groupBar">
                <span className="allFilter">All</span>
                <Avatar clickable mine />
                {groups && groups.docs.map((doc, i) => {
                    return (
                        <GroupAvatar name={doc.data().name} clickable tColor="white" key={i} />
                    )
                })}
            </div>
            <div className="recipesWindow">
                <div className="recipesHeader">
                    <h1>Group Name</h1>
                </div>
                <div className="recipesDisplay">
                    {comboSnapshot && comboSnapshot.map((doc, i) => {
                        return (<RecipeCard id={doc.id} title={doc.data().name} desc={doc.data().desc} key={"d" + i} />)
                    })}
                </div>
            </div>
        </main>
    );
}