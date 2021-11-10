import Avatar from "./avatar";
import "./groupAvatar.css";

function GroupAvatar(props) {
    let style = {}
    style.color = (props.tColor) ? props.tColor : '';
    style.fontSize = (props.size) ? props.size : '';
    return (
        <div className="groupAvatar">
            <Avatar size={props.size} rand />
            <span style={style}>{props.name}</span>
        </div>
    );
}

export default GroupAvatar;