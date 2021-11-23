import { useRef, useEffect, useState } from "react";
import DurationInput from "../components/DurationInput";
import InstructionsInput from "../components/InstructionsInput";
import TagsInput from "../components/TagInput";
import placeholder from "../img/foodPlaceholder.jpg";
import styles from "./recipeForm.module.css";
import ContentEditable from 'react-contenteditable';

function RecipeForm() {
    const mainRef = useRef();
    const imageRef = useRef();
    useEffect(() => {
        let mainR = mainRef.current;
        imageRef.current.style.height = "22em";
        mainR.addEventListener('scroll', resize);
        return () => {
            mainR.removeEventListener("scroll", resize);
        }
    }, []);
    function resize() {
        if (mainRef.current.scrollTop > 15) {
            imageRef.current.style.height = "12em";
        }
        if (mainRef.current.scrollTop < 1) {
            imageRef.current.style.height = "22em";
        }
    }
    const selectedTags = tags => {
        console.log(tags);
    };

    const [desc, setDesc] = useState("");

    return (
        <div ref={mainRef} className={styles.formContainer} >
            <img ref={imageRef} src={placeholder} alt="" />
            <form action="">
                <input type="text" className={styles.titleInput} name="title" id="title" placeholder="My Recipe Name" />
                <label htmlFor="desc">Description</label>
                <ContentEditable html={desc} onChange={(e) => { setDesc(e.target.value) }} className={styles.contentEditable} />
                {/* <div className={styles.contentEditable} name="desc" id="desc" contentEditable role="textbox" ></div> */}
                <label htmlFor="tags">Tags that describe the recipe</label>
                <TagsInput id="tags" selectedTags={selectedTags} tags={['Dinner', 'Moroccan']} />
                <label htmlFor="ingred">Ingredients</label>
                <TagsInput id="ingred" ingred selectedTags={selectedTags} tags={['1 cup flour', '2 tablespoon salt']} />
                <div className={styles.gridDurationDiv}>
                    <label htmlFor="prepTime">Prep time</label>
                    <DurationInput id="prepTime" />
                    <label htmlFor="cookTime">Cook time</label>
                    <DurationInput id="cookTime" />
                </div>
                <label htmlFor="instr">Instructions</label>
                <InstructionsInput id="instr" />
            </form>
            <span className={styles.padding}></span>
        </div>
    );
}

export default RecipeForm;