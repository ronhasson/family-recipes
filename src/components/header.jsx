import { NavLink } from "react-router-dom";
import logo from "../logo.svg";
import Avatar from "./avatar.jsx";
import UserDropdown from "./userDropdown.jsx";
import "./header.css"

export default function Header() {
    return (
        <div className="header">
            <img src={logo} alt="logo" />
            <h2>ProjName</h2>
            <nav>
                <NavLink className={({ isActive }) => isActive ? "active" : "notActive"} to="/">Recipes</NavLink>
                <NavLink className={({ isActive }) => isActive ? "active" : "notActive"} to="/groups">Groups</NavLink>
                {/* <NavLink className={({ isActive }) => isActive ? "active" : "notActive"} to="/groups">Help me choose</NavLink> */}
            </nav>
            <div style={{ flexGrow: 1 }}></div> {/*spacer*/}

            <UserDropdown render={<Avatar mine clickable />} />
        </div >
    );
}