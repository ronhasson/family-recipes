import Avatar from "./avatar";
import "./groupAvatar.css";

function GroupAvatar(props) {
    let style = {}
    let divStyle = {}
    style.color = (props.tColor) ? props.tColor : '';
    style.fontSize = (props.size) ? props.size : '';
    if (props.clickable) {
        divStyle.cursor = "pointer";
    }
    return (
        <div onClick={props.onClick} style={divStyle} className="groupAvatar">
            <Avatar size={props.size} rand={props.name + "1234567890"} />
            <span style={style}>{props.name}</span>
        </div>
    );
}

export default GroupAvatar;