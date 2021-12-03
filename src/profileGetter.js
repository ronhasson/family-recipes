import {
    db
} from "../firebase";
import {
    doc,
    getDoc
} from "firebase/firestore";

async function getProfile(id) {


}

function getAllLocal() {
    return JSON.parse(localStorage.getItem("users"));
}

function getUserLocal(id) {
    let u = getAllLocal();
    return u[id];
}

function updateLocalUser(id, data) {
    let all = getAllLocal();
    let newData = data;
    newData.exp = new Date().toISOString;
    all[id] = newData;
    localStorage.setItem("users", JSON.stringify(all));
}

async function getUserServer(id) {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    return docSnap.data();
}
export default getProfile;