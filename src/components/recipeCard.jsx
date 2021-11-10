import "./recipeCard.css"

function RecipeCard() {
    return (
        <div className="recipeCard">
            <div className="cardImage"></div>
            <div className="cardText">
                <h3>Roasted duck</h3>
                <p>Duck, marinaded with honey and lemon then roasted by your words</p>
            </div>
        </div>
    );
}

export default RecipeCard;