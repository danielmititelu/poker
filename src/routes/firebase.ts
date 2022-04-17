// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, doc,
    addDoc, getDocs, updateDoc, setDoc, deleteField,
    connectFirestoreEmulator, serverTimestamp, onSnapshot
} from "firebase/firestore";
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
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA_6f2l7spzdFUDPgYjtHC_idN7MOrjMD8",
    authDomain: "poker-e8079.firebaseapp.com",
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
const db = getFirestore(app);
const database = getDatabase(app);
connectFirestoreEmulator(db, 'localhost', 8080);
connectDatabaseEmulator(database, "localhost", 9000);
connectAuthEmulator(auth, "http://localhost:9099");

async function getUserId() {
    await signInAnonymously(auth);
    return auth.currentUser.uid;
}

export async function createRoom(): Promise<string> {
    var uid = await getUserId();
    var room = await push(ref(database, 'rooms'), {
        owner: uid,
    });
    return room.key;
}

export async function joinRoom(roomId: string): Promise<void> {
    var uid = await getUserId();
    const playerRef = ref(database, `players/${uid}`);
    await set(playerRef, {
        userId: uid,
        roomId: roomId,
        name: uid,
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

    var playersRef = query(ref(database, `players`),
         orderByChild('roomId'), equalTo(roomId));
    var playerUnsub = onValue(playersRef, (snapshot) => {
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
