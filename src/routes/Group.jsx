import { useParams } from "react-router-dom";
import Avatar from "../components/avatar";
import { GroupContext } from "../App.js";
import { useContext, useEffect, useState } from "react";

function Group() {
    let urlParams = useParams();
    const groups = useContext(GroupContext);
    const [group, setGroup] = useState(groups.docs.filter(doc => doc.id === urlParams.id)[0]);
    const [groupName, setGName] = useState(group.data().name);
    useEffect(() => {
        setGName(group.data().name);
    }, [group]);
    useEffect(() => {
        setGroup(groups.docs.filter(doc => doc.id === urlParams.id)[0]);
    }, [groups, urlParams.id]);
    return (
        <div>
            <h2><Avatar size="120%" rand={groupName + "1234567890"} /><input type="text" onChange={(e) => { setGName(e.target.value) }} value={groupName} /></h2>
            <span>👑{group.data().owner}</span>
            <div><input type="email" /><button>send invite</button></div>
            <h4>Members:</h4>
            <div>
                {group.data().members.map((member, i) => {
                    return (
                        <span key={"m" + i}>{member}</span>
                    )
                })}
            </div>
        </div>
    );
}

export default Group;