import gif from "../img/loadingPan.gif";
import style from "./loading.module.css";
function Loading() {
    return (
        <div className={style.loadingContainer}>
            <img className={style.loadingGif} src={gif} alt="loading" />
            <h1 className={style.MainText}>Loading...</h1>
        </div>
    );
}

export default Loading;