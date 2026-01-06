import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD98KXDcZumZrQ7SwWEzoTWsLtd4ST1zNY",
  authDomain: "beginner-react-7e41a.firebaseapp.com",
  projectId: "beginner-react-7e41a",
  storageBucket: "beginner-react-7e41a.appspot.com",
  messagingSenderId: "628811910710",
  appId: "1:628811910710:web:c4fbad031643da300cd297",
};

const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);



