import GroupAvatar from "../components/groupAvatar";
import "./groups.css";
import { db } from "../firebase";
import { collection, query, where, addDoc, serverTimestamp, doc, arrayUnion, updateDoc, deleteDoc } from "firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';
import { UserContext, GroupContext, InvitesContext } from "../App.js";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import addImg from "../img/add.svg";
import cStyles from "../commonStyles.module.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function Groups() {
    const user = useContext(UserContext);
    const groups = useContext(GroupContext);
    const invites = useContext(InvitesContext);
    let navigate = useNavigate();
    const MySwal = withReactContent(Swal);
    // const q = query(collection(db, "groups"), where("members", "array-contains", user.uid));
    // const [snapshot, loading, error] = useCollection(q);
    // console.log(snapshot);
    // console.log(error);
    console.log(groups);
    console.log(invites)

    async function createGroup() {
        // -- IMPORTANT --
        // limit the user to 9 groups
        if (groups && groups.docs.length >= 9) {
            MySwal.fire("Cant join more groups", "You cant be in more than 9 groups at a time, please leave or delete a group before joining a new one.", "error");
            return;
        }
        let docRef;
        try {
            docRef = await addDoc(collection(db, "groups"), {
                name: "My👨‍🍳Family",
                owner: user.uid,
                members: [user.uid],
                createDate: serverTimestamp(),
            });
            console.log("Document written with ID: ", docRef);
            const premissionsRef = doc(db, "users", user.uid, "private", "groups");
            await updateDoc(premissionsRef, {
                groups: arrayUnion(docRef.id)
            });
        } catch (error) {
            console.error(error);
        } finally {
        }
    }
    async function joinGroup(id) {
        // -- IMPORTANT --
        // limit the user to 9 groups
        if (groups && groups.docs.length >= 9) {
            MySwal.fire("Cant join more groups", "You cant be in more than 9 groups at a time, please leave or delete a group before joining a new one.", "error");
            return;
        }
        const groupRef = doc(db, "groups", id);
        const premissionsRef = doc(db, "users", user.uid, "private", "groups");
        try {
            await updateDoc(groupRef, {
                members: arrayUnion(user.uid)
            });
            await updateDoc(premissionsRef, {
                groups: arrayUnion(id)
            });
            await deleteDoc(doc(db, "users", user.uid, "invites", id));
        } catch (error) {
            MySwal.fire("Error", error, "error");
        }
    }
    async function deleteInvite(id) {
        try {
            await deleteDoc(doc(db, "users", user.uid, "invites", id));
        } catch (error) {
            MySwal.fire("Error", error, "error");
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
            {invites && invites.docs.length > 0 && <div className="invitesContainer">
                <h3>Invites</h3>
                <div style={{ marginBottom: "1em" }}>
                    {invites.docs.map((inv, i) => {
                        return (
                            <div key={"inv" + i}>
                                <div>{inv.data().gName}<span style={{ margin: "0 1em", fontStyle: "italic", color: "lightslategrey" }}>by</span>{inv.data().by}</div>
                                <div><button onClick={() => { joinGroup(inv.id) }} className={[cStyles.button, cStyles.white, cStyles.inlineFlex, cStyles.bGreen].join(" ")}>Join</button>/<button onClick={() => { deleteInvite(inv.id) }} className={[cStyles.button, cStyles.white, cStyles.inlineFlex, cStyles.bRed].join(" ")}>Delete</button></div>
                            </div>
                        )
                    })}
                </div>
            </div>}
        </main>
    );
}