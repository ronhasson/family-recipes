import Avatar from "../components/avatar";
import GroupAvatar from "../components/groupAvatar";
import RecipeCard from "../components/recipeCard";
import "./recipes.css";
import { db } from "../firebase";
import { collection, query, where } from "firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';
import { UserContext, GroupContext } from "../App.js";
import { useContext } from "react";

export default function Recipes() {
    const user = useContext(UserContext);
    const groups = useContext(GroupContext);

    const q = query(collection(db, "recipes"), where("owner", "==", user.uid));
    const [snapshot, loading, error] = useCollection(q);
    // console.log(snapshot);
    // let groups = [];
    // for (var i = 0; i < 4; i++) {
    //     groups.push(<GroupAvatar name="בדיקה בדוק" tColor="white" key={i} />);
    // }
    // let cards = [];
    // for (var j = 0; j < 10; j++) {
    //     cards.push(<RecipeCard key={j} />);
    // }
    return (
        <main className="recipesPage">
            <div className="groupBar">
                <span className="allFilter">All</span>
                <Avatar mine />
                {/* <GroupAvatar name="משפחת חסון" tColor="white" />
                <GroupAvatar name="הג'ינג'ית וארבעת המופלאים" tColor="white" /> */}
                {groups && groups.docs.map((doc, i) => {
                    return (
                        <GroupAvatar name={doc.data().name} tColor="white" key={i} />
                    )
                })}
            </div>
            <div className="recipesWindow">
                <div className="recipesHeader">
                    <h1>Group Name</h1>
                </div>
                <div className="recipesDisplay">
                    {snapshot && snapshot.docs.map((doc, i) => {
                        return (<RecipeCard id={doc.id} title={doc.data().name} desc={doc.data().desc} key={"d" + i} />)
                    })}
                </div>
            </div>
        </main>
    );
}