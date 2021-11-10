import defAvatar from "../img/man.png"
import "./avatar.css";
export default function Avatar(props) {
    let avatar_url;
    if (props.rand) {
        let seed = Math.floor(Math.random() * 10000000);
        avatar_url = `https://avatars.dicebear.com/api/big-smile/${seed}.svg?backgroundColor=white`;
    } else {
        avatar_url = defAvatar;
    }
    let style = {}
    if (props.clickable) {
        style.cursor = "pointer";
    }
    if (props.size) {
        style.fontSize = props.size;
    }

    return (
        <img className="avatar" src={avatar_url} style={style} alt="" />
    );
}