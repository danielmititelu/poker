import { initializeApp } from "firebase/app";
import {
    getDatabase,
    connectDatabaseEmulator,
    set, ref, push, onValue,
    onDisconnect,
    update,
    type Unsubscribe
} from "firebase/database";
import { getAuth, signInAnonymously, connectAuthEmulator, type Auth } from "firebase/auth";
import { getAnalytics, type Analytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDE4JQ7kpAJ4Uh0Kr2XTYjgr90RtTvBVAo",
    authDomain: "poker-for-planning.firebaseapp.com",
    databaseURL: "https://poker-for-planning-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "poker-for-planning",
    storageBucket: "poker-for-planning.appspot.com",
    messagingSenderId: "437365859197",
    appId: "1:437365859197:web:0fa597dfcde85c5a736214",
    measurementId: "G-DK030PNWDE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
let analytics: Analytics;
let initialized = false;

export async function initializeFirebase() {
    if(window.location.hostname !== "localhost" && !analytics) {
        analytics = getAnalytics(app);
        console.log("Configured analytics");
    }

    if (window.location.hostname === "localhost" && !initialized) {
        connectDatabaseEmulator(database, "localhost", 9000);
        connectAuthEmulator(auth, "http://localhost:9099");
        console.log("Connected to firebase emulators");
        initialized = true;
    }
}

export async function getUserId() {
    var userCredentials = await signInAnonymously(auth);
    return userCredentials.user.uid;
}

export async function createRoom(): Promise<string> {
    var uid = await getUserId();
    var room = await push(ref(database, 'rooms'), {
        owner: uid,
        reveal: false,
        players: {}
    });

    return room.key;
}

export async function joinRoom(roomId: string, playerName: string): Promise<void> {

    var uid = await getUserId();
    const playerRef = ref(database, `rooms/${roomId}/players/${uid}`);
    await set(playerRef, {
        uid: uid,
        name: playerName,
        voted: false
    });

    onDisconnect(playerRef).remove();
}

export function subscribeTo(roomId: string,
    onRoomChanged: (room: Room) => void): Unsubscribe {

    const roomRef = ref(database, `rooms/${roomId}`);
    return onValue(roomRef, (snapshot) => {
        onRoomChanged(snapshot.val());
    });
}

export async function vote(roomId: string, vote: string) {
    var uid = await getUserId();
    const playerRef = ref(database, `rooms/${roomId}/players/${uid}`);
    await update(playerRef, {
        voted: true,
        vote: vote
    });
}

export async function revealCards(roomId: string) {
    ref(database, `rooms/${roomId}`)
    await update(ref(database, `rooms/${roomId}`), {
        reveal: true
    });
}

export async function startNewGame(roomId: string, players: Player[]) {
    const updates = {};
    updates[`rooms/${roomId}/reveal`] = false;
    players.forEach(player => {
        updates[`rooms/${roomId}/players/${player.uid}/voted`] = false;
        updates[`rooms/${roomId}/players/${player.uid}/vote`] = null;
    });
    await update(ref(database), updates);
}

export async function changeName(roomId: string,
    uid: string, playerName: string) {
    await update(ref(database, `rooms/${roomId}/players/${uid}`), {
        name: playerName
    });
}

export type Room = {
    owner: string,
    reveal: boolean,
    players: {
        [key: string]: Player
    }
}

export type Player = {
    uid: string,
    name: string,
    voted: boolean,
    vote: string
}
