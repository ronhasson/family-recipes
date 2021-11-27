import { useNavigate } from "react-router-dom";
import "./recipeCard.css";
import sanitizeHtml from "sanitize-html";

function RecipeCard(props) {
    const title = props.title || "Roasted duck";
    const desc = props.desc || "Duck, marinaded with honey and lemon then roasted by your words";
    const id = props.id;

    let navigate = useNavigate();

    function sendTo() {
        if (id) {
            navigate("/recipe/" + id);
        }
    }

    const sanitizeConf = {
        allowedTags: ["div", "span"],
        transformTags: {
            'div': 'span'
        }
    };
    const sanitized = sanitizeHtml(desc, sanitizeConf);

    return (
        <div onClick={sendTo} className="recipeCard">
            <div className="cardImage"></div>
            <div className="cardText">
                <h3>{title}</h3>
                <p dangerouslySetInnerHTML={{ __html: sanitized }}></p>
            </div>
        </div>
    );
}

export default RecipeCard;