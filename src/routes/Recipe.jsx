import { useRef, useEffect, useState, useContext, Suspense } from "react";
import placeholder from "../img/foodPlaceholder.jpg";
import styles from "./recipeForm.module.css";
import { button, white } from "../commonStyles.module.css";
import { db } from "../firebase";
import { collection, doc } from "firebase/firestore";
import { UserContext } from "../App.js";
import { useParams } from "react-router-dom";
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import Loading from "../components/loading";

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
                        <div>
                            <div>{value.data().tags.map((tag, i) => {
                                return (<span key={i + tag}>#{tag}</span>)
                            })}</div>
                            <h1>{value.data().name}</h1>
                            <p>{value.data().desc}</p>
                            <p>
                                Prep:
                                {value.data().prep[0] > 0 && <span> {value.data().prep[0]} days, </span>}
                                {value.data().prep[1] > 0 && <span>{value.data().prep[1]} hours, </span>}
                                {!(value.data().prep[0] + value.data().prep[0] !== 0 && value.data().prep[2] === 0) && <span>{value.data().prep[2]} min </span>}
                            </p>
                            <p>
                                Cooking:
                                {value.data().cook[0] > 0 && <span> {value.data().cook[0]} days, </span>}
                                {value.data().cook[1] > 0 && <span>{value.data().cook[1]} hours, </span>}
                                {!(value.data().cook[0] + value.data().cook[0] !== 0 && value.data().cook[2] === 0) && <span>{value.data().cook[2]} min </span>}
                            </p>
                        </div>
                        <span className={styles.padding}></span>
                    </div>
                </Suspense>
            }
        </>
    );
}

export default RecipeForm;