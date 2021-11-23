import { useState } from "react";
import formstyles from "../routes/recipeForm.module.css";
import ContentEditable from 'react-contenteditable';


function InstructionsInput(props) {
    const [instructions, setInstructions] = useState([""]);
    const onchange = (e, index) => {
        // console.log("hi");
        console.log(e.currentTarget)
        const html = e.currentTarget.innerHTML;
        let newInstructions = [...instructions];
        newInstructions[index] = html;
        console.log(html);
        console.log(instructions);
        // console.log(e.target.id);
        // newInstructions[e.target.id.split("-")[1]] = html;
        // setInstructions(newInstructions);
        setInstructions(newInstructions);
    }
    function addStep() {
        setInstructions([...instructions, ""]);
    }
    return (
        <div id={props.id}>
            {instructions.map((instruc, index) => {
                return (
                    <ContentEditable key={index} html={instruc} onChange={(e) => { onchange(e, index) }} className={formstyles.contentEditable} />
                    // <div id={`instruc-${index}`} key={index} className={formstyles.contentEditable} onInput={onchange} contentEditable role="textbox">{instruc}</div>
                )
            })}
            <button onClick={addStep} type="button">Add step</button>
        </div>
    );
}

export default InstructionsInput;