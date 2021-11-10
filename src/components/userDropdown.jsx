import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "./avatar";
import "./userDropdown.css"

function UserDropdown(props) {
    const [open, setOpen] = useState(false);

    // props.render.onClick = () => {
    //     setOpen(!open);
    // }
    let selfRef = useRef(null);
    function handleClose(e) {
        if (!selfRef.current.contains(e.target)) {
            setOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClose);
        return () => {
            document.removeEventListener("click", handleClose);
        }
    }, [])

    return (
        <>
            <div className="userDropdown" ref={selfRef} onClick={() => setOpen(!open)}>
                {props.render}
                {open && <div className="list">
                    <div className="dropHeader">
                        <span>Name</span>
                        <Avatar />
                    </div>
                    <div className="buttonList">
                        <Link to="/profile">Profile & Settings</Link>
                        <Link to="/">Create a book</Link>
                        <Link to="/">Help</Link>
                        <span style={{ color: "red" }}>Log out</span>
                    </div>
                </div>}
            </div>
        </>
    );
}

export default UserDropdown;