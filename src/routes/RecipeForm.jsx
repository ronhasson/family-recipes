import { useRef, useEffect, useState, useContext } from "react";
import DurationInput from "../components/DurationInput";
import InstructionsInput from "../components/InstructionsInput";
import TagsInput from "../components/TagInput";
import placeholder from "../img/foodPlaceholder.webp";
import styles from "./recipeForm.module.css";
import ContentEditable from 'react-contenteditable';
import sanitizeHtml from "sanitize-html";
import { button, white } from "../commonStyles.module.css";
import uploadImage from "../img/upload.svg";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { GroupContext, UserContext } from "../App.js";
import { useNavigate, useParams } from "react-router-dom";
import { useDocumentOnce } from "react-firebase-hooks/firestore";

function RecipeForm() {
    const user = useContext(UserContext);
    const groups = useContext(GroupContext);
    let navigate = useNavigate();
    const urlParams = useParams();
    //console.log(urlParams);
    const [value, loading, error] = useDocumentOnce((urlParams.id) ? doc(db, "recipes", urlParams.id) : null);

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [tags, setTags] = useState(['Dinner', 'Moroccan']);
    const [ingredients, setIngredients] = useState(['1 cup flour', '2 tablespoon salt']);
    const [prep, setPrep] = useState([0, 0, 0]);
    const [cook, setCook] = useState([0, 0, 0]);
    const [instructions, setInstructions] = useState([""]);
    const [isPublic, setIsPublic] = useState(true);
    const [sharedGroups, setSharedGroups] = useState(new Set());

    useEffect(() => {
        if (value) {
            console.log(value.data())
            const v = value.data();
            setTitle(v.name);
            setDesc(v.desc);
            setTags(v.tags);
            setIngredients(v.ingredients);
            setPrep(v.prep);
            setCook(v.cook);
            setInstructions(v.instructions);
            setSharedGroups(new Set(v.sharedWith));
            setIsPublic(v.isPublic);
        }
    }, [value])

    const mainRef = useRef();
    const imageRef = useRef();
    const [publishing, setPublishing] = useState(false);

    //console.log(error)
    useEffect(() => {
        let mainR = mainRef.current;
        if (!error) {
            imageRef.current.style.height = "22em";
            mainR.addEventListener('scroll', resize);
        }
        return () => {
            if (!error) {
                mainR.removeEventListener("scroll", resize);
            }
        }
    }, [error]);
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

    async function submit(e) {
        e.preventDefault();
        // console.log(e)
        console.log("submit");
        setPublishing(true);
        const newData = {
            name: title,
            owner: user.uid,
            sharedWith: [...sharedGroups],
            isPublic: isPublic,
            date: serverTimestamp(),
            desc: desc,
            tags: tags,
            prep: prep,
            cook: cook,
            ingredients: ingredients,
            instructions: instructions
        }
        let docLocation;
        if (urlParams.id) {
            await updateDoc(doc(db, "recipes", urlParams.id), newData);
            docLocation = urlParams.id;
        } else {
            const docRef = await addDoc(collection(db, "recipes"), newData);
            docLocation = docRef.id;
        }
        console.log("Document written with ID: ", docLocation);
        navigate("/recipe/" + docLocation);
    }

    function disableEnter(e) {
        if (e.keyCode === 13 && e.target.tagName.toLowerCase() === "input") {
            // console.log(e);
            e.preventDefault();
        }
    }
    const handleToggle = ({ target }) => {
        if (target.checked) {
            setSharedGroups(new Set([...sharedGroups, target.id]))
        } else {
            let nSet = new Set([...sharedGroups]);
            nSet.delete(target.id);
            setSharedGroups(nSet);
        }
        // setSharedGroups(s => ({ ...s, [target.id]: !s[target.id] }))
    };
    // useEffect(() => {
    //     if (groups) {
    //         groups.docs.forEach((doc, i) => {
    //             setSharedGroups(s => ({ ...s, [doc.id]: false }));
    //         })
    //     }
    // }, [groups])
    return (
        <div ref={mainRef} className={styles.formContainer} >
            {error && <h2>{error.code}</h2>}
            {!error && <>
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
                        <DurationInput id="prepTime" onChange={setPrep} value={prep} />
                        <label htmlFor="cookTime">Cook time</label>
                        <DurationInput id="cookTime" onChange={setCook} value={cook} />
                    </div>
                    <label htmlFor="instr">Instructions</label>
                    <InstructionsInput id="instr" onChange={setInstructions} value={instructions} />
                    <hr className={styles.hr} />
                    <div><input type="checkbox" checked={isPublic} onChange={() => { setIsPublic(!isPublic) }} />Publicly avilable with link (TODO)</div>
                    <label htmlFor="">Share with:</label>
                    <div className={styles.groupShare}>
                        {groups && groups.docs.map((doc, i) => {
                            return (
                                <label className={sharedGroups.has(doc.id) ? styles.labelSelected : null} key={"g" + doc.id}><input checked={sharedGroups.has(doc.id)} onChange={handleToggle} type="checkbox" id={doc.id} value={doc.id} />{doc.data().name}</label>
                            )
                        })}
                        {groups && groups.docs.length === 0 && <span>No groups found.</span>}
                    </div>
                    {!publishing && <button style={{ fontSize: "0.9em", marginTop: "1.6em" }} className={[button, white].join(" ")}><img src={uploadImage} alt="" />Publish</button>}
                    {publishing && <span>Publishing...</span>}
                </form>
            </>}
            <span className={styles.padding}></span>
        </div>
    );
}

export default RecipeForm;