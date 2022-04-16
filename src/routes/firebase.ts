// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection,
    addDoc, getDocs,
    connectFirestoreEmulator, serverTimestamp
} from "firebase/firestore";
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
connectFirestoreEmulator(db, 'localhost', 8080);
connectAuthEmulator(auth, "http://localhost:9099");

export async function createRoom(): Promise<string> {
    var uid = await getUserId();
    // log uid
    console.log(uid);
    var room = await addDoc(collection(db, 'rooms'), {
        owner: uid,
        players: [uid],
        createdAt: serverTimestamp(),
    });
    // add user to room subcollection

    await addDoc(collection(room, 'users'), {
        userId: uid,
        joinedAt: serverTimestamp(),
    });

    return room.id;
}

async function getUserId() {
    await signInAnonymously(auth);
    return auth.currentUser.uid;
}
