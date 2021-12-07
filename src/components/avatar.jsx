import defAvatar from "../img/man.png"
import "./avatar.css";
import { UserContext } from "../App.js";
import { useContext } from "react";

export default function Avatar(props) {
    const user = useContext(UserContext);
    let avatar_url = getAvatars(props, user);

    let style = {}
    if (props.clickable) {
        style.cursor = "pointer";
    }
    if (props.size) {
        style.fontSize = props.size;
    }

    return (
        <img onClick={props.onClick} className="avatar" src={avatar_url} style={style} alt="" />
    );
}

function getAvatars(props, user) {
    if (props.mine && user.photoURL) {
        return user.photoURL;
    }
    if (props.rand) {
        let seed
        if (typeof props.rand === 'string') {
            seed = props.rand;
        } else {
            seed = Math.floor(Math.random() * 10000000);
        }
        return `https://avatars.dicebear.com/api/big-smile/${seed}.svg?backgroundColor=white`;
    }

    return defAvatar;
}