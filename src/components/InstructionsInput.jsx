import { useEffect, useState } from "react";
import formstyles from "../routes/recipeForm.module.css";
import ContentEditable from 'react-contenteditable';
import sanitizeHtml from "sanitize-html";
import styles from "./instructionsInput.module.css";
import { button, blueHover } from "../commonStyles.module.css";
import addImage from "../img/add.svg";
import removeImage from "../img/remove.svg";


function InstructionsInput(props) {
    const [instructions, setInstructions] = useState([""]);
    const emit = props.onChange;

    const sanitizeConf = {
        allowedTags: ["div", "br", "b", "i", "em", "strong", "u", "ins", "mark", "small", "sub", "sup"]
    };

    const onStepChange = (e, index) => {
        const html = e.currentTarget.innerHTML;
        // const html = e.target.value
        const sanitized = sanitizeHtml(html, sanitizeConf)
        let newInstructions = [...instructions];
        newInstructions[index] = sanitized;
        //newInstructions[index] = html;
        // console.log(html);
        // console.log(sanitized);
        // console.log(instructions);
        // console.log(e.target.id);
        // newInstructions[e.target.id.split("-")[1]] = html;
        // setInstructions(newInstructions);
        setInstructions(newInstructions);
        emit(newInstructions);
    }

    useEffect(() => {
        setInstructions(props.value);
    }, [props.value])

    function addStep() {
        setInstructions([...instructions, ""]);
    }
    function removeStep() {
        let newinst = [...instructions];
        let deleted = newinst.pop();
        //TODO - check if deleted got value and ask to confirm with swal
        setInstructions(newinst);
    }
    return (
        <div id={props.id}>
            {instructions.map((instruc, index) => {
                return (
                    <div className={styles.instruc} key={index}>
                        {instructions.length > 1 && <span>{index + 1}</span>}
                        <ContentEditable html={instruc} onChange={(e) => { onStepChange(e, index) }} className={formstyles.contentEditable} />
                    </div>
                    // <div id={`instruc-${index}`} key={index} className={formstyles.contentEditable} onInput={onchange} contentEditable role="textbox">{instruc}</div>
                )
            })}
            <div className={blueHover} style={{ display: "flex", gap: "0.5em", justifyContent: "end" }}>
                <button className={button} onClick={addStep} type="button"><img src={addImage} alt="" />Add step</button>
                {instructions.length > 1 && <button className={button} onClick={removeStep} type="button"><img src={removeImage} alt="" />Remove step</button>}
            </div>
        </div>
    );
}

export default InstructionsInput;