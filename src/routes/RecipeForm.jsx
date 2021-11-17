import { useRef, useEffect } from "react";
import TagsInput from "../components/TagInput";
import placeholder from "../img/foodPlaceholder.jpg";
import styles from "./recipeForm.module.css";
function RecipeForm() {
    const mainRef = useRef();
    const imageRef = useRef();
    useEffect(() => {
        imageRef.current.style.height = "22em";
        mainRef.current.addEventListener('scroll', resize);
        return () => {
            mainRef.current.removeEventListener("scroll", resize);
        }
    }, []);
    function resize() {
        if (mainRef.current.scrollTop > 150) {
            imageRef.current.style.height = "12em";
        }
        if (mainRef.current.scrollTop < 5) {
            imageRef.current.style.height = "22em";
        }
    }
    const selectedTags = tags => {
        console.log(tags);
    };
    return (
        <div ref={mainRef} className={styles.formContainer} >
            <img ref={imageRef} src={placeholder} alt="" />
            <form action="">
                <input type="text" name="title" id="title" placeholder="My Recipe" />
                <label htmlFor="desc">Description</label>
                <textarea name="desc" id="desc" cols="30" rows="3"></textarea>
                <label htmlFor="tags">Tags that describe the recipe</label>
                <TagsInput id="tags" selectedTags={selectedTags} tags={['Dinner', 'Moroccan']} />
                <label htmlFor="ingred">Ingredients</label>
                <TagsInput id="ingred" ingred selectedTags={selectedTags} tags={['1 cup flour', '2 tablespoon salt']} />
            </form>

        </div>
    );
}

export default RecipeForm;