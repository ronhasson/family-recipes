import { useParams } from "react-router-dom";
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
import { collection, doc, getDocs, query, setDoc, where } from "@firebase/firestore";
import { db } from "../firebase";

function Group() {
    let urlParams = useParams();
    const user = useContext(UserContext);
    const groups = useContext(GroupContext);
    const [group, setGroup] = useState(groups.docs.filter(doc => doc.id === urlParams.id)[0]);
    const [groupName, setGName] = useState(group.data().name);
    const [members, setMembers] = useState({});
    const [inputEmail, setInputEmail] = useState("");
    const titleInputRef = useRef();
    const MySwal = withReactContent(Swal);

    useEffect(() => {
        setGName(group.data().name);
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
        getmembers();
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
    return (
        <div className={styles.groupContainer}>
            <h2 className={styles.title}><Avatar size="120%" rand={groupName + "1234567890"} /><div className={styles.titleContainer}><input ref={titleInputRef} disabled type="text" onChange={(e) => { setGName(e.target.value) }} value={groupName} /><span>{groupName}</span></div></h2>
            <span className={styles.owner}>👑 {Object.keys(members).length > 0 && members[group.data().owner].name}</span>
            <div style={{ margin: "1em" }}><input value={inputEmail} onChange={(e) => { setInputEmail(e.target.value) }} style={{ padding: "0.3em" }} type="email" placeholder="invite@email.com" /><button onClick={sendInvite} style={{ display: "inline-flex", margin: "0 0.5em" }} className={cStyles.button}>Send invite</button></div>
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
        </div>
    );
}

export default Group;