import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "./avatar";
import "./userDropdown.css";
import { auth } from "../firebase.js";
import { signOut } from "firebase/auth";
import { UserContext } from "../App.js";

function UserDropdown(props) {
    const [open, setOpen] = useState(false);

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
    }, []);

    const user = useContext(UserContext);

    function logout() {
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }

    return (
        <>
            <div className="userDropdown" ref={selfRef} onClick={() => setOpen(!open)}>
                {props.render}
                {open && <div className="list">
                    <div className="dropHeader">
                        <span>{user.displayName}</span>
                        <Avatar mine />
                    </div>
                    <div className="buttonList">
                        <Link to="/profile">Profile & Settings</Link>
                        <Link to="/">Create a book</Link>
                        <Link to="/">Help</Link>
                        <span onClick={logout} style={{ color: "red" }}>Log out</span>
                    </div>
                </div>}
            </div>
        </>
    );
}

export default UserDropdown;