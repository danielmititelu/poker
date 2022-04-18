// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getDatabase,
    connectDatabaseEmulator,
    set, ref, push, onValue, 
    orderByChild, query,
    equalTo,
    onDisconnect,
    update
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
        reveal: false
    });
    return room.key;
}

export async function joinRoom(roomId: string, playerName: string): Promise<void> {
    var uid = await getUserId();
    const playerRef = ref(database, `players/${uid}`);
    await set(playerRef, {
        userId: uid,
        roomId: roomId,
        name: playerName,
        voted: false
    });

    onDisconnect(playerRef).remove();
}

var unSubscriptions = [];
export async function subscribeTo(roomId: string,
    onRoomChanged: (room: any) => void,
    onPlayerChanged: (player: any) => void) {

    const roomRef = ref(database, `rooms/${roomId}`);
    var roomUnsub = onValue(roomRef, (snapshot) => {
        onRoomChanged(snapshot.val());
    });

    var roomPlayersRef = query(ref(database, `players`),
         orderByChild('roomId'), equalTo(roomId));
    var playerUnsub = onValue(roomPlayersRef, (snapshot) => {
        var players = Object.values(snapshot.val());
        onPlayerChanged(players);
    });

    unSubscriptions.push(roomUnsub);
    unSubscriptions.push(playerUnsub);
}

export function unsubscribe() {
    unSubscriptions.forEach(unSub => unSub());
}

export async function vote(vote: string) {
    var uid = await getUserId();
    const playerRef = ref(database, `players/${uid}`);
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

export async function startNewGame(roomId: string, players: any[]) {
    const updates = {};
    updates[`rooms/${roomId}/reveal`] = false;
    players.forEach(player => {
        updates[`players/${player.userId}/voted`] = false;
        updates[`players/${player.userId}/vote`] = null;
    });
    await update(ref(database), updates);
}
