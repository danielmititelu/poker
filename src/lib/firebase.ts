// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getDatabase,
    connectDatabaseEmulator,
    set, ref, push, onValue, 
    onDisconnect,
    update,
    type Unsubscribe
} from "firebase/database";
import { getAuth, signInAnonymously, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA_6f2l7spzdFUDPgYjtHC_idN7MOrjMD8",
    authDomain: "poker-e8079.firebaseapp.com",
    databaseURL: "https://poker-e8079-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "poker-e8079",
    storageBucket: "poker-e8079.appspot.com",
    messagingSenderId: "934861521350",
    appId: "1:934861521350:web:f8a034319635d5a799f2c7",
    measurementId: "G-S0R6MQN23T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize authentication
const auth = getAuth(app);
const database = getDatabase(app);

// connectDatabaseEmulator(database, "localhost", 9000);
// connectAuthEmulator(auth, "http://localhost:9099");

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
    console.log("Joining room " + roomId);
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