import { useRef, useEffect, useState } from "react";
import DurationInput from "../components/DurationInput";
import InstructionsInput from "../components/InstructionsInput";
import TagsInput from "../components/TagInput";
import placeholder from "../img/foodPlaceholder.jpg";
import styles from "./recipeForm.module.css";
import ContentEditable from 'react-contenteditable';
import sanitizeHtml from "sanitize-html";
import { button, white } from "../commonStyles.module.css";
import uploadImage from "../img/upload.svg";

function RecipeForm() {

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [tags, setTags] = useState(['Dinner', 'Moroccan']);
    const [ingredients, setIngredients] = useState(['1 cup flour', '2 tablespoon salt']);
    const [prep, setPrep] = useState([0, 0, 0]);
    const [cook, setCook] = useState([0, 0, 0]);
    const [instructions, setInstructions] = useState([""]);

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
    const selectedTags = (tags) => {
        // console.log(tags);
        setTags(tags);
    };
    const selectedIngredients = (ingreds) => {
        // console.log(tags);
        setIngredients(ingreds);
    };

    const sanitizeConf = {
        allowedTags: ["div", "br", "b", "i", "em", "strong", "u", "ins", "mark", "small", "sub", "sup"]
    };
    const onDescChange = (e) => {
        const html = e.target.value;
        const sanitized = sanitizeHtml(html, sanitizeConf);
        setDesc(sanitized);
    };

    function submit(e) {
        e.preventDefault();
        if (e.target.keyCode === 13) {
            return;
        }
        // console.log(e)
        console.log("submit")
    }
    function disableEnter(e) {
        if (e.keyCode === 13 && e.target.tagName.toLowerCase() === "input") {
            // console.log(e);
            e.preventDefault();
        }
    }

    return (
        <div ref={mainRef} className={styles.formContainer} >
            <img ref={imageRef} src={placeholder} alt="" />
            <form onKeyDown={disableEnter} onSubmit={submit}>
                <input type="text" className={styles.titleInput} name="title" id="title" placeholder="My Recipe Name" value={title} onChange={(e) => { setTitle(e.target.value) }} />
                <label htmlFor="desc">Description</label>
                <ContentEditable html={desc} onChange={onDescChange} className={styles.contentEditable} />
                {/* <div className={styles.contentEditable} name="desc" id="desc" contentEditable role="textbox" ></div> */}
                <label htmlFor="tags">Tags that describe the recipe</label>
                <TagsInput id="tags" selectedTags={selectedTags} tags={tags} />
                <label htmlFor="ingred">Ingredients</label>
                <TagsInput id="ingred" ingred selectedTags={selectedIngredients} tags={ingredients} />
                <div className={styles.gridDurationDiv}>
                    <label htmlFor="prepTime">Prep time</label>
                    <DurationInput id="prepTime" onChange={setPrep} />
                    <label htmlFor="cookTime">Cook time</label>
                    <DurationInput id="cookTime" onChange={setCook} />
                </div>
                <label htmlFor="instr">Instructions</label>
                <InstructionsInput id="instr" onChange={setInstructions} />
                <hr className={styles.hr} />
                <label htmlFor="">Share with</label>
                <input type="text" />
                <span>TODO</span>
                <button style={{ fontSize: "0.9em" }} className={[button, white].join(" ")}><img src={uploadImage} alt="" />Publish</button>
            </form>
            <span className={styles.padding}></span>
        </div>
    );
}

export default RecipeForm;