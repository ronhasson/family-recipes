import deleteImg from "../img/deleteRecipe.png";
import style from "./deleteRecipe.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase.js";
import { doc, deleteDoc } from "firebase/firestore";
import { button, white } from "../commonStyles.module.css";

const buttonStyle = {
    display: "inline-flex",
    margin: "0.3em 2em",
    fontSize: "0.9em"
}

function DeleteRecipe() {
    let navigate = useNavigate();
    const urlParams = useParams();
    function cancel() {
        navigate("/recipe/" + urlParams.id);
    }
    async function deleteRecipe() {
        await deleteDoc(doc(db, "recipes", urlParams.id));
        navigate("/");
    }
    return (
        <div className={style.main}>
            <h2>Are you sure that you want to delete that recipe?</h2>
            <img src={deleteImg} alt="" />
            <button style={{ ...buttonStyle, backgroundColor: "hsl(0deg 100% 75%)" }} className={button} onClick={deleteRecipe}>Yes, Delete</button>
            <button style={buttonStyle} className={button} onClick={cancel}>No! Cancel!</button>
        </div>
    );
}

export default DeleteRecipe;