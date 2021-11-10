import GroupAvatar from "../components/groupAvatar";
import "./groups.css"

export default function Groups() {
    let groups = [];
    for (var i = 0; i < 7; i++) {
        groups.push(<GroupAvatar size="170%" name="בדיקה בדוק" key={i} />);
    }
    return (
        <main style={{ padding: "1rem 0" }}>
            <h2>Groups</h2>
            <div className="groupContainer">
                <GroupAvatar size="170%" name="משפחת חסון" />
                {groups}
            </div>
        </main>
    );
}