import {
    db
} from "./firebase";
import {
    doc,
    getDoc
} from "firebase/firestore";

async function getProfile(id) {
    let local = getUserLocal(id);
    if(local && expValid(local.exp,30)){
        console.log("local ", local);
        return local;
    }
    let server = await getUserServer(id);
    if(server){
        console.log("server ", server);
        updateLocalUser(id,server);
        return server;
    }
    console.log("user not found");
    return undefined;
}

function getAllLocal() {
    return JSON.parse(localStorage.getItem("users"));
}

function getUserLocal(id) {
    let u = getAllLocal();
    if(!u){
        return undefined
    }
    return u[id];
}

function updateLocalUser(id, data) {
    let all = getAllLocal();
    if(!all){
        all = {};
    }
    let newData = data;
    newData.exp = new Date().toISOString();
    all[id] = newData;
    console.log(all);
    localStorage.setItem("users", JSON.stringify(all));
}

async function getUserServer(id) {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    return docSnap.data();
}

function expValid(date, days) {
    const today = new Date();
    const expDate = new Date(date);

    let diff = (today-expDate)/1000/60/60/24;
    return diff<days;
}
export default getProfile;