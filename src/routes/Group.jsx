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

function Group() {
    let urlParams = useParams();
    const user = useContext(UserContext);
    const groups = useContext(GroupContext);
    const [group, setGroup] = useState(groups.docs.filter(doc => doc.id === urlParams.id)[0]);
    const [groupName, setGName] = useState(group.data().name);
    const [members, setMembers] = useState({});
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
    return (
        <div className={styles.groupContainer}>
            <h2 className={styles.title}><Avatar size="120%" rand={groupName + "1234567890"} /><div className={styles.titleContainer}><input ref={titleInputRef} disabled type="text" onChange={(e) => { setGName(e.target.value) }} value={groupName} /><span>{groupName}</span></div></h2>
            <span className={styles.owner}>👑 {Object.keys(members).length > 0 && members[group.data().owner].name}</span>
            <div style={{ margin: "1em" }}><input style={{ padding: "0.3em" }} type="email" placeholder="invite@email.com" /><button style={{ display: "inline-flex", margin: "0 0.5em" }} className={cStyles.button}>Send invite</button></div>
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