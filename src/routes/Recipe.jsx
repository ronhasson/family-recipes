import { useRef, useEffect, useContext, Suspense } from "react";
import placeholder from "../img/foodPlaceholder.jpg";
import styles from "./recipeForm.module.css";
import rstyles from "./recipe.module.css";
import { db } from "../firebase";
import { doc } from "firebase/firestore";
import { UserContext } from "../App.js";
import { useParams } from "react-router-dom";
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import Loading from "../components/loading";
import timerImg from "../img/timer.svg";

function RecipeForm() {
    const user = useContext(UserContext);
    let urlParams = useParams();
    // console.log(urlParams);
    const [value, loading, error] = useDocumentOnce(doc(db, "recipes", urlParams.id));
    let v = useRef();

    useEffect(() => {
        if (value) {
            v.current = value.data();
            console.log(v);
        }
    }, [value]);

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
                    <div ref={mainRef} className={styles.formContainer} >
                        <img ref={imageRef} src={placeholder} alt="" />
                        <div className={rstyles.content}>
                            <div className={rstyles.tags}>
                                {value.data().tags.map((tag, i) => {
                                    return (<span key={i + tag}>#{tag}</span>)
                                })}
                            </div>
                            <h1>{value.data().name}</h1>
                            <div className={rstyles.recipeCont}>
                                <p>{value.data().desc}</p>
                                <div className={rstyles.time}>
                                    <img src={timerImg} alt="time" />
                                    <p>
                                        Prep:
                                        {value.data().prep[0] > 0 && <span>{value.data().prep[0]} days, </span>}
                                        {value.data().prep[1] > 0 && <span>{value.data().prep[1]} hours, </span>}
                                        <span>{value.data().prep[2]} min </span>
                                    </p>
                                    <p>
                                        Cooking:
                                        {value.data().cook[0] > 0 && <span>{value.data().cook[0]} days,</span>}
                                        {value.data().cook[1] > 0 && <span>{value.data().cook[1]} hours,</span>}
                                        <span> {value.data().cook[2]} min </span>
                                    </p>
                                </div>
                                <h3>Ingredients</h3>
                                <div className={rstyles.ingreds}>
                                    {value.data().ingredients.map((ing, i) => {
                                        return (
                                            <label key={"ing" + ing + i}>
                                                <input type="checkbox" /><span>{ing}</span>
                                            </label>
                                        )
                                    })}
                                </div>
                                <h3>Directions</h3>
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