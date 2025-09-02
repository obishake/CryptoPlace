import { initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "cryptoplace-e9f51.firebaseapp.com",
    projectId: "cryptoplace-e9f51",
    storageBucket: "cryptoplace-e9f51.firebasestorage.app",
    messagingSenderId: "137557307346",
    appId: "1:137557307346:web:dcabdbd57341a14505a20b",
    measurementId: "G-VTM5DHDB94",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signUp = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "user"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        });
        toast.success("Account created successfully! Welcome to CryptoPlace!");
    } catch (error) {
        console.log(error);

        // Check for specific error codes and show user-friendly messages
        if (error.code === "auth/email-already-in-use") {
            toast.error("Email is already registered! Please sign in instead.");
        } else if (error.code === "auth/weak-password") {
            toast.error(
                "Password is too weak! Please use at least 6 characters."
            );
        } else if (error.code === "auth/invalid-email") {
            toast.error("Invalid email address!");
        } else {
            // Generic error message for other cases
            toast.error(error.code.split("/")[1].split("-").join(" "));
        }
    }
};

const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Login successful! Welcome back!");
    } catch (error) {
        console.log(error);

        // Check for specific error codes and show user-friendly messages
        if (
            error.code === "auth/user-not-found" ||
            error.code === "auth/wrong-password" ||
            error.code === "auth/invalid-credential"
        ) {
            toast.error(
                "Invalid credentials! Please check your email and password."
            );
        } else if (error.code === "auth/invalid-email") {
            toast.error("Invalid email address!");
        } else if (error.code === "auth/too-many-requests") {
            toast.error("Too many failed attempts. Please try again later.");
        } else {
            // Generic error message for other cases
            toast.error(
                "Invalid credentials! Please check your email and password."
            );
        }
    }
};

const logout = () => {
    signOut(auth);
};

export { auth, db, login, signUp, logout };
