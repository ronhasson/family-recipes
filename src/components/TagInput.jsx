import { useState } from "react";
import tstyles from "./tagInput.module.css";
import istyles from "./tagInput_ingred.module.css";

function TagsInput(props) {
    const [tags, setTags] = useState(props.tags);

    const styles = (props.ingred) ? istyles : tstyles;

    const removeTags = indexToRemove => {
        setTags([...tags.filter((elm, index) => index !== indexToRemove)]);
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

    return (
        <div id={props.id || ""} className={styles.tagsInput}>
            <ul className={styles.tags}>
                {tags.map((tag, index) => (
                    <li key={index} className={styles.tag}>
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
                placeholder="Press enter to add tags"
            />
        </div>
    );
}

export default TagsInput;