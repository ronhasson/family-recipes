import { useEffect, useState } from "react";
import tstyles from "./tagInput.module.css";
import istyles from "./tagInput_ingred.module.css";

function TagsInput(props) {
    const [tags, setTags] = useState(props.tags);

    const styles = (props.ingred) ? istyles : tstyles;

    const removeTags = indexToRemove => {
        setTags([...tags.filter((elm, index) => index !== indexToRemove)]);
        props.selectedTags([...tags.filter((elm, index) => index !== indexToRemove)]);
    };
    const addTags = event => {
        if (event.target.value !== "") {
            setTags([...tags, event.target.value]);
            props.selectedTags([...tags, event.target.value]);
            //console.log(tags);
            //props.selectedTags(tags);
            event.target.value = "";
        }
    };

    useEffect(() => {
        setTags(props.tags);
    }, [props.tags])

    const handleBlur = (e) => {
        console.log(e);
        if (e.target.value) {
            e.target.focus();
            addTags(e);
        }
    };

    let inputText = (props.ingred) ? "Press enter to add ingredient" : "Press enter to add tags";

    return (
        <div id={props.id || ""} className={styles.tagsInput}>
            <ul className={styles.tags}>
                {tags.map((tag, index) => (
                    <li draggable key={index} className={styles.tag}>
                        <span className={styles.tagTitle}>{tag}</span>
                        <span className={styles.tagClose}
                            onClick={() => removeTags(index)}
                        >
                            x
                        </span>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                onKeyUp={event => event.key === "Enter" ? addTags(event) : null}
                onBlur={handleBlur}
                placeholder={inputText}
            />
        </div>
    );
}

export default TagsInput;