import Avatar from "../components/avatar";
import GroupAvatar from "../components/groupAvatar";
import RecipeCard from "../components/recipeCard";
import "./recipes.css";
export default function Recipes() {
    let groups = [];
    for (var i = 0; i < 4; i++) {
        groups.push(<GroupAvatar name="בדיקה בדוק" tColor="white" key={i} />);
    }
    let cards = [];
    for (var j = 0; j < 10; j++) {
        cards.push(<RecipeCard key={j} />);
    }
    return (
        <main className="recipesPage">
            <div className="groupBar">
                <span className="allFilter">All</span>
                <Avatar mine />
                <GroupAvatar name="משפחת חסון" tColor="white" />
                <GroupAvatar name="הג'ינג'ית וארבעת המופלאים" tColor="white" />
                {groups}
            </div>
            <div className="recipesWindow">
                <div className="recipesHeader">
                    <h1>Group Name</h1>
                </div>
                <div className="recipesDisplay">
                    {cards}
                </div>
            </div>
        </main>
    );
}