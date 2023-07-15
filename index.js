import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'

import { 
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut
 } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js"

import { 
    getDatabase, 
    ref, 
    push, 
    onValue, 
    remove
 } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js"

 const firebaseConfig = {
    apiKey: "AIzaSyDsIQRTFS6KMgscM8nAtN6CeLWfWCiMFy0",
    authDomain: "shopping-cart-305b8.firebaseapp.com",
    databaseURL:
      "https://shopping-cart-305b8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "shopping-cart-305b8",
    storageBucket: "shopping-cart-305b8.appspot.com",
    messagingSenderId: "394965173991",
    appId: "1:394965173991:web:2a60c8f310b5ede6e58442",
  };


const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider();


let shoppingListInDB;
let unsubscribe;

signInBtn.onclick = () => signInWithPopup(provider);
signOutBtn.onclick = () => signOut(auth);

onAuthStateChanged(user => {
    if (user) {
        // signed in
        signedIn.hidden = false;
        signedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    } else {
        // not signed in
        signedIn.hidden = true;
        signedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});



let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {

    if (user) {

        // Database Reference
        thingsRef = db.collection('things')

        createThing.onclick = () => {

            const { serverTimestamp } = firebase.firestore.FieldValue;

            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp()
            });
        }


        // Query
        unsubscribe = thingsRef
            .where('uid', '==', user.uid)
            .orderBy('createdAt') // Requires a query
            .onSnapshot(querySnapshot => {
                
                // Map results to an array of li elements

                const items = querySnapshot.docs.map(doc => {

                    return `<li>${doc.data().name}</li>`

                });

                thingsList.innerHTML = items.join('');

            });



    } else {
        // Unsubscribe when the user signs out
        unsubscribe && unsubscribe();
    }
});

