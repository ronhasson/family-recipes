import Avatar from "../components/avatar";
import GroupAvatar from "../components/groupAvatar";
import RecipeCard from "../components/recipeCard";
import "./recipes.css";
import { db } from "../firebase";
import { collection, query, where } from "firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';
import { UserContext, GroupContext } from "../App.js";
import { useContext } from "react";
import { useEffect, useState } from "react";

export default function Recipes() {
    const user = useContext(UserContext);
    const groups = useContext(GroupContext);
    let groupsid = groups.docs.map(doc => doc.id);
    //console.log(groupsid);

    const q = query(collection(db, "recipes"), where("owner", "==", user.uid));
    const [snapshot, loading, error] = useCollection(q);
    const q2 = (groupsid.length > 0) ? query(collection(db, "recipes"), where("sharedWith", "array-contains-any", groupsid)) : undefined;
    const [snapshot2, loading2, error2] = useCollection(q2);
    const [comboSnapshot, setComboSnaphot] = useState([]);

    const [filterState, setFilterState] = useState("");
    const [filterTitle, setFilterTitle] = useState("Group Name");

    console.log(snapshot);
    console.log(snapshot2);
    useEffect(() => {
        if (error) {
            console.log(error)
        }
        if (error2) {
            console.log(error2)
        }
        if (snapshot || snapshot2) {
            let nsnapshot = (!!snapshot) ? snapshot.docs : [];
            let nsnapshot2 = (!!snapshot2) ? snapshot2.docs : [];
            let temp = nsnapshot.concat(nsnapshot2);
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
    }, [snapshot, snapshot2]);

    function filterRecipes(docs) {
        return docs.filter((doc) => {
            switch (filterState[0]) {
                case undefined:
                    return true;

                case "o":
                    return doc.data().owner === user.uid;

                case "g":
                    let group = filterState.split(":")[1]
                    return doc.data().sharedWith.indexOf(group) >= 0;

                default:
                    return true;
            }
        })

    }

    return (
        <main className="recipesPage">
            <div className="groupBar">
                <span onClick={() => { setFilterState("") }} className="allFilter">All</span>
                <Avatar onClick={() => { setFilterState("o"); setFilterTitle(user.displayName) }} clickable mine />
                {groups && groups.docs.map((doc, i) => {
                    return (
                        <GroupAvatar onClick={() => { setFilterState("g:" + doc.id); setFilterTitle(doc.data().name) }} name={doc.data().name} clickable tColor="white" key={i} />
                    )
                })}
            </div>
            <div className="recipesWindow">
                <div className="recipesHeader">
                    {filterState && <h1>{filterTitle}</h1>}
                </div>
                <div className="recipesDisplay">
                    {comboSnapshot && filterRecipes(comboSnapshot).map((doc, i) => {
                        return (<RecipeCard id={doc.id} title={doc.data().name} desc={doc.data().desc} key={"d" + i} />)
                    })}
                </div>
            </div>
        </main>
    );
}