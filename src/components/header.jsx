import { NavLink, useLocation, useParams } from "react-router-dom";
import logo from "../logo_tiny.webp";
import Avatar from "./avatar.jsx";
import UserDropdown from "./userDropdown.jsx";
import "./header.css";
import addImg from "../img/add.svg";
import editImg from "../img/edit.svg";
import { useEffect, useState } from "react";

export default function Header(props) {
    let location = useLocation();
    let fLoc = location.pathname.split("/")[1];
    let lLoc = location.pathname.split("/")[2];
    console.log(lLoc)
    // useEffect(() => {
    //     setFLoc(location.pathname.slice(0, location.pathname.lastIndexOf('/')))
    // }, [location])
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
            {location.pathname === "/" && <nav className="actionBar"><NavLink to="/editrecipe"><img src={addImg} alt="Add recipe" /></NavLink></nav>}
            {fLoc === "recipe" && <nav className="actionBar"><NavLink to={"/editrecipe/" + lLoc}><img src={editImg} alt="Edit recipe" /></NavLink></nav>}
            <UserDropdown render={<Avatar mine clickable />} />
        </div >
    );
}