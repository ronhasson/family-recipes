import { useNavigate, useParams } from "react-router-dom";
import Avatar from "../components/avatar";
import { GroupContext } from "../App.js";
import { useContext, useEffect, useState } from "react";
import profileGet from "../profileGetter";
import styles from "./group.module.css";
import { useCallback, useRef } from "react/cjs/react.development";
import cStyles from "../commonStyles.module.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { UserContext } from "../App.js";
import { arrayRemove, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "@firebase/firestore";
import { db } from "../firebase";
import editImg from "../img/edit.svg";
import checkImg from "../img/check.svg";
import { div } from "prelude-ls";
import { arrayUnion } from "firebase/firestore";

function Group() {
    let urlParams = useParams();
    const user = useContext(UserContext);
    const groups = useContext(GroupContext);
    const [group, setGroup] = useState(groups.docs.filter(doc => doc.id === urlParams.id)[0]);
    const [groupName, setGName] = useState((group) ? group.data().name : "");
    const [members, setMembers] = useState({});
    const [inputEmail, setInputEmail] = useState("");
    const [titleDisabled, setTDisabled] = useState(true);
    const titleInputRef = useRef();
    let navigate = useNavigate();
    const MySwal = withReactContent(Swal);

    useEffect(() => {
        if (group) {
            setGName(group.data().name);
        }
    }, [group]);
    useEffect(() => {
        setGroup(groups.docs.filter(doc => doc.id === urlParams.id)[0]);
    }, [groups, urlParams.id]);
    async function getmembers() {
        let m = { ...members };
        group.data().members.map(async (member, i) => {
            let d = await profileGet(member);
            m[member] = d;
        })
        setMembers(m)
    }
    useEffect(() => {
        if (group) {
            getmembers();
        }
        // console.log(members);
    }, [group]);
    useEffect(() => {
        setTimeout(() => {
            if (group) {
                getmembers();
            }
        }, 20)
        // console.log(members);
    }, []);
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    useEffect(() => {
        console.log(JSON.stringify(members));
        console.log(Object.keys(members).length);
        //setMembers({ ...members });
        forceUpdate();
    }, [members]);

    const sendInvite = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", inputEmail));

        const docsSnap = await getDocs(q);
        const docSnap = docsSnap.docs[0];
        if (docSnap && docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            const docRef = doc(db, "users", docSnap.id, "invites", urlParams.id);
            console.log(docSnap.id);
            try {
                setDoc(docRef, { gName: groupName, uuid: urlParams.id, by: user.displayName });
                MySwal.fire("Invitation sent!", `${docSnap.data().name}(${inputEmail}) recived your invitation.`, "success");
                setInputEmail("");
            } catch (error) {
                MySwal.fire("Error", error, "error");
            }
        } else {
            MySwal.fire("Cannot find user", "Couldnt find the user with that email", "error");
            // doc.data() will be undefined in this case
            // console.log("No such document! - user");
        }
    }
    async function updateTitle() {
        try {
            await updateDoc(doc(db, "groups", urlParams.id), { name: groupName });
            setTDisabled(true);
        } catch (error) {
            MySwal.fire("Error", error, "error");
        }
    }
    async function leave() {
        const groupRef = doc(db, "groups", urlParams.id);

        MySwal.fire({
            title: 'Leave this group?',
            text: `Are you sure you want to leave ${groupName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Leave'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await updateDoc(groupRef, {
                        members: arrayRemove(user.uid)
                    });

                    // -- IMPORTANT -- 
                    // get all of the user's recipes shared with the group
                    // and remove the group from them
                    await deleteSharedWith(urlParams.id);

                    const premissionsRef = doc(db, "users", user.uid, "private", "groups");
                    await updateDoc(premissionsRef, {
                        groups: arrayRemove(urlParams.id)
                    });

                    navigate("/groups")
                } catch (error) {
                    MySwal.fire("Error", error, "error");
                }
            }
        })
    }
    async function deleteGroup() {
        const groupRef = doc(db, "groups", urlParams.id);

        MySwal.fire({
            title: 'Delete this group?',
            text: `Are you sure you want to DELETE ${groupName}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'DELETE FOREVER',
            focusCancel: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // -- IMPORTANT -- 
                    // get all of the user's recipes shared with the group
                    // and remove the group from them
                    await deleteSharedWith(urlParams.id);

                    // delete the premissions to read recipes from the group
                    const premissionsRef = doc(db, "users", user.uid, "private", "groups");
                    await updateDoc(premissionsRef, {
                        groups: arrayRemove(urlParams.id)
                    });

                    await deleteDoc(groupRef);

                    navigate("/groups")
                } catch (error) {
                    MySwal.fire("Error", error.message, "error");
                }
            }
        })
    }
    async function deleteSharedWith(groupId, fromAllUsers = false) {
        const q = query(collection(db, "recipes"), where("sharedWith", "array-contains", groupId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            if (!fromAllUsers && doc.data().owner === user.uid) {
                await updateDoc(doc.ref, {
                    sharedWith: arrayRemove(groupId)
                });
            }
            if (fromAllUsers) {
                await updateDoc(doc.ref, {
                    sharedWith: arrayRemove(groupId)
                });
            }
        });
    }

    if (group) {
        return (
            <div className={styles.groupContainer}>
                <h2 className={styles.title}><Avatar size="120%" rand={groupName + "1234567890"} /><div className={styles.titleContainer}><input ref={titleInputRef} disabled={titleDisabled} type="text" onChange={(e) => { setGName(e.target.value) }} value={groupName} /><span>{groupName}</span></div>
                    {group && group.data().owner === user.uid && titleDisabled && <img onClick={() => setTDisabled(false)} className={styles.editBtn} src={editImg} alt="edit title" />}
                    {group && group.data().owner === user.uid && !titleDisabled && <img onClick={updateTitle} className={styles.doneEditBtn} src={checkImg} alt="update title" />}

                </h2>
                <span className={styles.owner}>👑 {Object.keys(members).length > 0 && members[group.data().owner].name}</span>
                {group && group.data().owner === user.uid && <div style={{ margin: "1em" }}><input value={inputEmail} onChange={(e) => { setInputEmail(e.target.value) }} style={{ padding: "0.3em" }} type="email" placeholder="invite@email.com" /><button onClick={sendInvite} style={{ display: "inline-flex", margin: "0 0.5em" }} className={cStyles.button}>Send invite</button></div>}
                <h4 className={styles.membersListTitle}>Members</h4>
                <div>
                    {Object.keys(members).length > 0 && Object.keys(members).map((key, i) => {
                        let member = members[key];
                        // console.log(member);
                        // console.log(members);
                        console.log("hi", member);
                        return (
                            <span className={styles.member} key={"m" + i}>{member.name}</span>
                        )
                    })}
                </div>
                <div style={{ marginTop: "2.5em" }}>
                    {group && group.data().owner !== user.uid && < button onClick={leave} className={[cStyles.button, cStyles.white, cStyles.inlineFlex, cStyles.bRed].join(" ")}>Leave</button>}
                    {group && group.data().owner === user.uid && <button onClick={deleteGroup} className={[cStyles.button, cStyles.white, cStyles.inlineFlex, cStyles.bRed].join(" ")}>Delete Group</button>}
                </div>
            </div>
        );
    }
    if (!group) {
        return (<div></div>)
    }
}

export default Group;