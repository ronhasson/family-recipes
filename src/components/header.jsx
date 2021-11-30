import { NavLink, useLocation, useParams } from "react-router-dom";
import logo from "../logo_tiny.webp";
import Avatar from "./avatar.jsx";
import UserDropdown from "./userDropdown.jsx";
import "./header.css";
import addImg from "../img/add.svg";
import editImg from "../img/edit.svg";
import deleteImg from "../img/delete.svg";
import { useContext, useEffect, useState } from "react";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../firebase";
import { UserContext } from "../App";

export default function Header(props) {
    let location = useLocation();
    let fLoc = location.pathname.split("/")[1];
    let lLoc = location.pathname.split("/")[2];
    // console.log(lLoc);
    const user = useContext(UserContext);
    const [docRef, setDocRef] = useState(undefined);
    const [value, loading, error] = useDocumentOnce(docRef);
    const [editPremission, setPremission] = useState(false);
    // useEffect(() => {
    //     setFLoc(location.pathname.slice(0, location.pathname.lastIndexOf('/')))
    // }, [location])
    useEffect(() => {
        if (fLoc === "recipe" && lLoc) {
            setDocRef(doc(db, "recipes", lLoc));
        }
    }, [fLoc, lLoc]);
    useEffect(() => {
        if (value && fLoc === "recipe" && lLoc && value.data().owner === user.uid) {
            setPremission(true);
        } else {
            setPremission(false);
        }
    }, [value, fLoc, lLoc, user.uid]);
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
            {fLoc === "recipe" && editPremission && <nav className="actionBar"><NavLink to={"/editrecipe/" + lLoc}><img src={editImg} alt="Edit recipe" /></NavLink></nav>}
            {(fLoc === "editrecipe" && lLoc) && <nav className="actionBar"><NavLink to={"/deleterecipe/" + lLoc}><img src={deleteImg} alt="Delete recipe" /></NavLink></nav>}
            <UserDropdown render={<Avatar mine clickable />} />
        </div >
    );
}