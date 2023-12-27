import { initializeApp } from "firebase/app";
import {GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBohy--nFjQJhEdUVHmhzYGObBJxGC_7VI",
  authDomain: "reactjs-blog-website-80eb2.firebaseapp.com",
  projectId: "reactjs-blog-website-80eb2",
  storageBucket: "reactjs-blog-website-80eb2.appspot.com",
  messagingSenderId: "550924289633",
  appId: "1:550924289633:web:94a955087d9d95681dcc20"
};

const app = initializeApp(firebaseConfig);


//google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
    
    let user = null;

    await signInWithPopup(auth, provider)
        .then((result) => {
            user = result.user
        })
        .catch((err) =>{
            console.log(err);
        })

    return user;    

}