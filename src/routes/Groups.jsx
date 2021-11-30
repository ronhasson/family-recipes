import GroupAvatar from "../components/groupAvatar";
import "./groups.css";
import { db } from "../firebase";
import { collection, query, where } from "firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';
import { UserContext, GroupContext } from "../App.js";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import addImg from "../img/add.svg";

export default function Groups() {
    // const user = useContext(UserContext);
    const groups = useContext(GroupContext);
    // const q = query(collection(db, "groups"), where("members", "array-contains", user.uid));
    // const [snapshot, loading, error] = useCollection(q);
    // console.log(snapshot);
    // console.log(error);
    console.log(groups);
    return (
        <main style={{ padding: "1rem 0" }}>
            <h2>Groups</h2>
            <div className="groupContainer">
                {/* <GroupAvatar size="170%" name="משפחת חסון" /> */}
                {groups && groups.docs.map((doc, i) => {
                    return (
                        <GroupAvatar size="170%" name={doc.data().name} key={i} />
                    )
                })}
                {groups.docs.length < 9 && <button className="groupAdd"><img src={addImg} alt="" /><span>Create Group</span></button>}
            </div>
        </main>
    );
}