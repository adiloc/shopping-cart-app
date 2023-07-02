import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'
import { getDatabase, ref, push, onValue } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js'
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js'

import data from '/data.js'

const app = initializeApp(data)
const database = getDatabase(app)
const shopItems = ref(database, 'testoasa')
const auth = getAuth(app)



const inputFieldEl = document.getElementById('input_field')
const addBtnEl = document.getElementById('add_btn')
const shoppingList = document.getElementById('shopping_list')


addEventListener('click', render)
addEventListener('keypress', render)

function render(e) {
  if(e.target.id === "add_btn" || e.key === 'Enter') {
    let inputValue = inputFieldEl.value
    push(shopItems, inputValue)
    inputFieldEl.value = ''
  }
}

onValue(shopItems, function(snapshot) {
  
  shoppingList.innerHTML = ''
  let itemsArray = Object.entries(snapshot.val())
  for(let item in itemsArray){
    let curentItem = itemsArray[item]
    let curentItemId = curentItem[0]
    let curentItemValue = curentItem[1]
    getHtml(curentItemValue)
  }

})

function getHtml(item) {
  shoppingList.innerHTML += `
      <li>
        ${item}
      </li>
    `
}