import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'

import { 
    getDatabase, 
    ref, 
    push, 
    onValue, 
    remove
 } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js"

import { 
  getFirestore
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js'

import { 
  firebaseConfig,
  signedIn,
  signedOut, 
  signInBtn,
  signOutBtn,
  userDetails,
  inputField,
  cartBtn
} from '/ui.js'

const app = initializeApp(firebaseConfig)

const provider = new GoogleAuthProvider();

const auth = getAuth(app)



let shoppingListInDB;
let unsubscribe;

signInBtn.onclick = () => signInWithPopup(provider);

signOutBtn.onclick = () => signOut();

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



///// Firestore /////

const db = getFirestore(app);

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');


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

