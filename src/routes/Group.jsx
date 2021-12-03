import { useParams } from "react-router-dom";
import Avatar from "../components/avatar";
import { GroupContext } from "../App.js";
import { useContext, useEffect, useState } from "react";
import profileGet from "../profileGetter";
import styles from "./group.module.css";
import { useRef } from "react/cjs/react.development";

function Group() {
    let urlParams = useParams();
    const groups = useContext(GroupContext);
    const [group, setGroup] = useState(groups.docs.filter(doc => doc.id === urlParams.id)[0]);
    const [groupName, setGName] = useState(group.data().name);
    const [members, setMembers] = useState([]);
    const titleInputRef = useRef();
    useEffect(() => {
        setGName(group.data().name);
    }, [group]);
    useEffect(() => {
        setGroup(groups.docs.filter(doc => doc.id === urlParams.id)[0]);
    }, [groups, urlParams.id]);
    useEffect(()=>{
        group.data().members.map(async(member, i)=>{
            let d = await profileGet(member);
            let m = [...members];
            m[member] = d;
            // console.log(members)
            setMembers(m)
        })
    },[group]);
    useEffect(()=>{
        // titleInputRef.current.style.width = groupName.length+0.5 + "ch";
    },[groupName])
    return (
        <div>
            <h2 className={styles.title}><Avatar size="120%" rand={groupName + "1234567890"} /><div className={styles.titleContainer}><input ref={titleInputRef} disabled type="text" onChange={(e) => { setGName(e.target.value) }} value={groupName} /><span>{groupName}</span></div></h2>
            <span className={styles.owner}>👑 {Object.keys(members).length > 0 && members[group.data().owner].name}</span>
            <div><input type="email" /><button>send invite</button></div>
            <h4 className={styles.membersListTitle}>Members</h4>
            <div>
                {members && Object.keys(members).map((key, i) => {
                    let member = members[key];
                    // console.log(member);
                    // console.log(members);
                    return (
                        <span className={styles.member} key={"m" + i}>{member.name}</span>
                    )
                })}
            </div>
        </div>
    );
}

export default Group;