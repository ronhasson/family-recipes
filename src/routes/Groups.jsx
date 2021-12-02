import GroupAvatar from "../components/groupAvatar";
import "./groups.css";
import { db } from "../firebase";
import { collection, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';
import { UserContext, GroupContext } from "../App.js";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import addImg from "../img/add.svg";

export default function Groups() {
    const user = useContext(UserContext);
    const groups = useContext(GroupContext);
    let navigate = useNavigate();
    // const q = query(collection(db, "groups"), where("members", "array-contains", user.uid));
    // const [snapshot, loading, error] = useCollection(q);
    // console.log(snapshot);
    // console.log(error);
    console.log(groups);

    async function createGroup() {
        let docRef;
        try {
            docRef = await addDoc(collection(db, "groups"), {
                name: "My👨‍🍳Family",
                owner: user.uid,
                members: [user.uid],
                createDate: serverTimestamp(),
            });
            console.log("Document written with ID: ", docRef);
        } catch (error) {
            console.error(error);
        } finally {
        }
    }

    return (
        <main style={{ padding: "1rem 0" }}>
            <h2>Groups</h2>
            <div className="groupContainer">
                {/* <GroupAvatar size="170%" name="משפחת חסון" /> */}
                {groups && groups.docs.map((doc, i) => {
                    return (
                        <GroupAvatar clickable onClick={() => { navigate("/group/" + doc.id); }} size="170%" name={doc.data().name} key={i} />
                    )
                })}
                {groups.docs.length < 9 && <button className="groupAdd" onClick={createGroup}><img src={addImg} alt="" /><span>Create Group</span></button>}
            </div>
        </main>
    );
}