import { useRef, useEffect, useContext, Suspense, useState } from "react";
import placeholder from "../img/foodPlaceholder.webp";
import styles from "./recipeForm.module.css";
import rstyles from "./recipe.module.css";
import { db } from "../firebase";
import { doc } from "firebase/firestore";
import { UserContext } from "../App.js";
import { useParams } from "react-router-dom";
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import Loading from "../components/loading";
import timerImg from "../img/timer.svg";
import getProfile from "../profileGetter";

function RecipeForm() {
    const user = useContext(UserContext);
    let urlParams = useParams();
    // console.log(urlParams);
    const [value, loading, error] = useDocumentOnce(doc(db, "recipes", urlParams.id));
    const [ownerName, setOwnerName] = useState("");
    const [rtl, setRtl] = useState(false);
    let v = useRef();

    useEffect(() => {
        if (value) {
            v.current = value.data();
            console.log(v);
            setRtl(/[\u0590-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(value.data().name));
        }
    }, [value]);

    useEffect(() => {
        if (value) {
            getAsync()
        }
        async function getAsync() {
            let n = await getProfile(value.data().owner);
            setOwnerName(n.name)
        }
    }, [value]);

    let [lang, setLang] = useState();
    useEffect(() => {
        setLang((rtl) ? he : en);
    }, [rtl]);
    const he = {
        prep: "הכנה",
        cook: "בישול",
        day: "ימים",
        hour: "שעות",
        min: "דקות",
        ing: "רכיבים",
        direc: "הוראות",
        publish: "פורסם על ידי"
    }
    const en = {
        prep: "Prep",
        cook: "Cooking",
        day: "days",
        hour: "hours",
        min: "min",
        ing: "Ingredients",
        direc: "Directions",
        publish: "Published by"
    }


    const mainRef = useRef();
    const imageRef = useRef();

    useEffect(() => {
        let mainR = mainRef.current;
        if (value) {
            imageRef.current.style.height = "22em";
            mainR.addEventListener('scroll', resize);
        }
        return () => {
            if (mainR) {
                mainR.removeEventListener("scroll", resize);
            }
        }
    }, [value]);
    function resize() {
        if (mainRef.current.scrollTop > 15) {
            imageRef.current.style.height = "12em";
        }
        if (mainRef.current.scrollTop < 1) {
            imageRef.current.style.height = "22em";
        }
    }

    return (
        <>
            {error && <h2>{error.code}</h2>}
            {value &&
                <Suspense fallback={<Loading />}>
                    <div dir={(rtl) ? "rtl" : ""} ref={mainRef} className={styles.formContainer} >
                        <img ref={imageRef} src={placeholder} alt="" />
                        <div className={rstyles.content}>
                            <div className={rstyles.tags}>
                                {value.data().tags.map((tag, i) => {
                                    return (<span key={i + tag}>#{tag}</span>)
                                })}
                            </div>
                            <h1>{value.data().name}</h1>
                            <div className={rstyles.recipeCont}>
                                <div style={(rtl) ? { textAlign: "right" } : { textAlign: "left" }}>
                                    <span className={rstyles.publishedBy}>{lang.publish}</span>
                                    <span className={rstyles.publishedName}>{ownerName}</span>
                                </div>
                                <p dangerouslySetInnerHTML={{ __html: value.data().desc }}></p>
                                <div className={rstyles.time}>
                                    <img src={timerImg} alt="time" />
                                    <p>
                                        {lang.prep}:
                                        {value.data().prep[0] > 0 && <span>{value.data().prep[0]} {lang.day}, </span>}
                                        {value.data().prep[1] > 0 && <span>{value.data().prep[1]} {lang.hour}, </span>}
                                        <span>{value.data().prep[2]} {lang.min} </span>
                                    </p>
                                    <p>
                                        {lang.cook}:
                                        {value.data().cook[0] > 0 && <span>{value.data().cook[0]} {lang.day},</span>}
                                        {value.data().cook[1] > 0 && <span>{value.data().cook[1]} {lang.hour},</span>}
                                        <span>{value.data().cook[2]} {lang.min} </span>
                                    </p>
                                </div>
                                <h3>{lang.ing}</h3>
                                <div className={rstyles.ingreds}>
                                    {value.data().ingredients.map((ing, i) => {
                                        return (
                                            <label key={"ing" + ing + i}>
                                                <input type="checkbox" /><span>{ing}</span>
                                            </label>
                                        )
                                    })}
                                </div>
                                <h3>{lang.direc}</h3>
                                <div>{value.data().instructions.map((ins, i) => {
                                    return (
                                        <div key={"ing" + ins + i} className={rstyles.step}>
                                            {value.data().instructions.length > 1 && <span>{i + 1}</span>}
                                            <p dangerouslySetInnerHTML={{ __html: ins }}></p>
                                        </div>
                                    )
                                })}
                                </div>
                            </div>
                        </div>
                        <span className={styles.padding}></span>
                    </div>
                </Suspense>
            }
        </>
    );
}

export default RecipeForm;