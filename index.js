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
const database = getDatabase(app)

const provider = new GoogleAuthProvider(auth)

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

const whenSignedIn = document.getElementById('whenSignedIn')
const whenSignedOut = document.getElementById('whenSignedOut')

const signInBtn = document.getElementById('signInBtn')
const signOutBtn = document.getElementById('signOutBtn')

const shop = document.getElementById('shop')
const userDetails = document.getElementById('userDetails')

signInBtn.onclick = () => signInWithPopup(auth, provider)
signOutBtn.onclick = () => signOut(auth)

  
let shoppingListInDB
let unsubscribe

auth.onAuthStateChanged(user => {
    if (user) {
        whenSignedIn.hidden = false
        whenSignedOut.hidden = true
        shop.hidden = false
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
        const uid = user.uid
    } else {
        shop.hidden = true
        whenSignedIn.hidden = true
        whenSignedOut.hidden = false
        userDetails.innerHTML = ''
    }
})

auth.onAuthStateChanged(user => {

    if(user) {
        shoppingListInDB = ref(database, `shoppingList`)

        document.addEventListener("click", render)
        document.addEventListener("keypress", render)
        
        function render(e) { 
            if(e.target.dataset.addBtn || e.key === "Enter") {
                let inputValue = inputFieldEl.value
                shoppingListInDB = ref(database, `shoppingList/${user.uid}`)
                
                push(shoppingListInDB, inputValue)
                
                clearInputFieldEl()
            }  
        }

        unsubscribe = shoppingListInDB = ref(database, `shoppingList/${user.uid}`);
        onValue(shoppingListInDB, function(snapshot) {
            if (snapshot.exists()) {
                let itemsArray = Object.entries(snapshot.val())

                clearShoppingListEl()
                
                for (let i = 0; i < itemsArray.length; i++) {
                    let currentItem = itemsArray[i]
                    let currentItemID = currentItem[0]
                    let currentItemValue = currentItem[1]
                    appendItemToShoppingListEl(currentItem)
                }    
            } else {
                shoppingListEl.innerHTML = "No items here... yet"
            }
        })
        
        function clearShoppingListEl() {
            shoppingListEl.innerHTML = ""
        }
        
        function clearInputFieldEl() {
            inputFieldEl.value = ""
        }
        
        function appendItemToShoppingListEl(item) {
            let itemID = item[0]
            let itemValue = item[1]
            let newEl = document.createElement("li")
            newEl.textContent = itemValue
            
            newEl.addEventListener("click", function() {
                let exactLocationOfItemInDB = ref(database, `shoppingList/${user.uid}/${itemID}`)
                
                remove(exactLocationOfItemInDB)
            })
            
            shoppingListEl.append(newEl)
        }

    } else {
        unsubscribe
    }

})

